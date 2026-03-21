import { supabase } from './supabase';
import { createClient } from '@supabase/supabase-js';

// Service role client for server-side operations (bypasses RLS)
const supabaseServiceRole = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export interface UserCredits {
  user_id: string;
  credits_remaining: number; // Now supports decimal values like 4.7, 3.2, etc
  credits_limit: number;
  last_reset: string;
  created_at: string;
  updated_at: string;
}

export interface CreditUsage {
  user_id: string;
  tokens_used: number;
  cost_usd: number;
  request_type: 'dfm_analysis' | 'chat' | 'upload';
  file_name?: string;
  created_at: string;
}

export class CreditsManager {
  private static readonly DEFAULT_CREDITS = 5; // Per day for free users
  private static readonly RESET_TIME_UTC = { hour: 0, minute: 0 }; // Daily reset at UTC midnight for security
  private static readonly TOKENS_PER_CREDIT = 1000; // 1 credit = 1000 tokens (for fractional calculation)
  private static readonly COST_PER_1M_TOKENS = 3.00; // Claude pricing
  private static readonly MIN_CREDIT_CHARGE = 0.1; // Minimum charge for any request
  
  // Security and rate limiting constants (industry standards)
  private static readonly MAX_REQUESTS_PER_MINUTE = 10; // Rate limiting per user
  private static readonly MAX_REQUESTS_PER_HOUR = 100; // Hourly rate limit
  private static readonly SUSPICIOUS_ACTIVITY_THRESHOLD = 50; // Credits used in 1 hour
  private static readonly MAX_CONCURRENT_REQUESTS = 3; // Per user concurrent limit

  /**
   * Get user credits with automatic daily reset (Industry Standard Performance)
   */
  static async getUserCredits(userId: string): Promise<UserCredits> {
    try {
      // Check if environment variables are configured
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY_MISSING');
      }

      // Single database query for maximum performance (Industry Standard)
      const { data: userCredits, error } = await supabaseServiceRole
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // User doesn't exist, create new record
        return await this.createUserCredits(userId);
      } else if (error) {
        throw error;
      }

      // Check if reset is needed (UTC midnight standard)
      const now = new Date();
      const lastReset = new Date(userCredits.last_reset);
      const nextResetTime = this.getNextResetTime(lastReset);

      if (now >= nextResetTime) {
        return await this.resetUserCredits(userId);
      }

      return userCredits;
    } catch (error) {
      throw new Error('Failed to retrieve user credits');
    }
  }


  /**
   * Create initial user credits record
   */
  private static async createUserCredits(userId: string): Promise<UserCredits> {
    const now = new Date().toISOString();
    const { data, error } = await supabaseServiceRole
      .from('user_credits')
      .insert({
        user_id: userId,
        credits_remaining: this.DEFAULT_CREDITS,
        credits_limit: this.DEFAULT_CREDITS,
        last_reset: now,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Calculate next reset time based on industry standards (fixed daily time in UTC)
   */
  public static getNextResetTime(lastReset: Date): Date {
    const resetTime = new Date(lastReset);
    
    // Set to the next occurrence of RESET_TIME_UTC
    resetTime.setUTCHours(this.RESET_TIME_UTC.hour, this.RESET_TIME_UTC.minute, 0, 0);
    
    // If the reset time for today has already passed, move to tomorrow
    const now = new Date();
    if (resetTime <= now || resetTime <= lastReset) {
      resetTime.setUTCDate(resetTime.getUTCDate() + 1);
    }
    
    return resetTime;
  }

  /**
   * Reset user credits (daily at fixed UTC time)
   */
  private static async resetUserCredits(userId: string): Promise<UserCredits> {
    const now = new Date().toISOString();
    const { data, error } = await supabaseServiceRole
      .from('user_credits')
      .update({
        credits_remaining: this.DEFAULT_CREDITS,
        last_reset: now,
        updated_at: now
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Check if user has sufficient credits for a request
   */
  static async checkCredits(userId: string, estimatedTokens: number): Promise<{
    hasCredits: boolean;
    creditsRequired: number;
    creditsRemaining: number;
    timeUntilReset: number;
  }> {
    const userCredits = await this.getUserCredits(userId);
    
    // Calculate fractional credits based on actual token usage
    const rawCreditsRequired = estimatedTokens / this.TOKENS_PER_CREDIT;
    const creditsRequired = Math.max(this.MIN_CREDIT_CHARGE, Math.round(rawCreditsRequired * 10) / 10); // Round to 0.1 precision
    
    const now = new Date();
    const lastReset = new Date(userCredits.last_reset);
    const nextResetTime = this.getNextResetTime(lastReset);
    const msUntilReset = nextResetTime.getTime() - now.getTime();
    const hoursUntilReset = Math.max(0, msUntilReset / (1000 * 60 * 60));

    return {
      hasCredits: userCredits.credits_remaining >= creditsRequired,
      creditsRequired,
      creditsRemaining: userCredits.credits_remaining,
      timeUntilReset: hoursUntilReset
    };
  }

  /**
   * Deduct credits from user account
   */
  static async deductCredits(
    userId: string, 
    tokensUsed: number, 
    requestType: CreditUsage['request_type'],
    fileName?: string
  ): Promise<UserCredits> {
    // Calculate fractional credits based on actual token usage
    const rawCreditsUsed = tokensUsed / this.TOKENS_PER_CREDIT;
    const creditsUsed = Math.max(this.MIN_CREDIT_CHARGE, Math.round(rawCreditsUsed * 10) / 10); // Round to 0.1 precision
    const costUsd = (tokensUsed / 1000000) * this.COST_PER_1M_TOKENS;

    try {
      // Get current credits first to ensure proper deduction
      const currentCredits = await this.getUserCredits(userId);
      const newRemainingCredits = Math.max(0, currentCredits.credits_remaining - creditsUsed);
      
      // Update credits with explicit value (not raw SQL to avoid issues)
      const { data: userCredits, error: creditsError } = await supabaseServiceRole
        .from('user_credits')
        .update({
          credits_remaining: newRemainingCredits,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (creditsError) throw creditsError;

      // Log usage for analytics
      await this.logCreditUsage(userId, tokensUsed, costUsd, requestType, fileName);

      return userCredits;
    } catch (error) {
      throw new Error('Failed to deduct credits');
    }
  }

  /**
   * Log credit usage for analytics and monitoring
   */
  private static async logCreditUsage(
    userId: string,
    tokensUsed: number,
    costUsd: number,
    requestType: CreditUsage['request_type'],
    fileName?: string
  ): Promise<void> {
    try {
      await supabaseServiceRole
        .from('credit_usage')
        .insert({
          user_id: userId,
          tokens_used: tokensUsed,
          cost_usd: costUsd,
          request_type: requestType,
          file_name: fileName,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      // Don't throw - logging failure shouldn't block the main request
    }
  }

  /**
   * Get user usage statistics
   */
  static async getUserUsageStats(userId: string, days = 7): Promise<{
    totalTokensUsed: number;
    totalCost: number;
    requestCount: number;
    averageTokensPerRequest: number;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('credit_usage')
      .select('tokens_used, cost_usd')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error) {
      return { totalTokensUsed: 0, totalCost: 0, requestCount: 0, averageTokensPerRequest: 0 };
    }

    const totalTokensUsed = data.reduce((sum, usage) => sum + usage.tokens_used, 0);
    const totalCost = data.reduce((sum, usage) => sum + usage.cost_usd, 0);
    const requestCount = data.length;
    const averageTokensPerRequest = requestCount > 0 ? totalTokensUsed / requestCount : 0;

    return {
      totalTokensUsed,
      totalCost,
      requestCount,
      averageTokensPerRequest
    };
  }

  /**
   * Estimate tokens for a request (for pre-flight checks)
   */
  static estimateTokens(userMessage: string, geometryData?: any): number {
    // User message tokens (1 token ≈ 3-4 characters)
    const messageTokens = Math.ceil(userMessage.length / 3.5);
    
    // Base system prompt tokens (smaller, more realistic)
    const basePromptTokens = 150;
    
    // Geometry data tokens (if any)
    const geometryTokens = geometryData ? Math.ceil(JSON.stringify(geometryData).length / 4) : 0;
    
    // Estimate response tokens based on message complexity
    let responseTokens;
    if (messageTokens <= 10) { // Simple messages like "hi", "cost"
      responseTokens = 100; // Short responses
    } else if (messageTokens <= 50) { // Medium messages
      responseTokens = 300; // Medium responses  
    } else { // Complex messages
      responseTokens = 500; // Detailed responses
    }
    
    const totalTokens = basePromptTokens + messageTokens + geometryTokens + responseTokens;
    
    return totalTokens;
  }
}

// Database schema for credits (SQL to run in Supabase)
export const CREDITS_SCHEMA = `
-- User credits table  
CREATE TABLE IF NOT EXISTS user_credits (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_remaining DECIMAL(10,1) NOT NULL DEFAULT 5.0, -- Support decimal credits like 4.7, 3.2
  credits_limit DECIMAL(10,1) NOT NULL DEFAULT 5.0,
  last_reset TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Credit usage log table
CREATE TABLE IF NOT EXISTS credit_usage (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tokens_used INTEGER NOT NULL,
  cost_usd DECIMAL(10,6) NOT NULL,
  request_type TEXT NOT NULL,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" ON user_credits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own usage" ON credit_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_user_id ON credit_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_created_at ON credit_usage(created_at);
`;