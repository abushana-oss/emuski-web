-- STEP 1: Run this first (Basic Setup)
-- Copy and paste this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    company_name TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    
    PRIMARY KEY (id),
    UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create CAD parts table
CREATE TABLE IF NOT EXISTS public.cad_parts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- User Association
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_email TEXT NOT NULL,
    
    -- Part Information
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT,
    file_checksum TEXT,
    
    -- Geometry Data
    volume NUMERIC,
    dimensions JSONB,
    surface_area NUMERIC,
    
    -- Manufacturing Data
    material TEXT,
    process TEXT,
    finish TEXT,
    tolerance TEXT DEFAULT 'ISO 2768-m (General)',
    threads TEXT DEFAULT 'No Threads Detected',
    inspection TEXT DEFAULT 'Standard QC (ASME Y14.5)',
    quantity INTEGER DEFAULT 1,
    
    -- Analysis Status
    analysis_status TEXT DEFAULT 'pending',
    
    -- Estimates
    manufacturability_score NUMERIC,
    estimated_cost NUMERIC,
    suggestions_count INTEGER DEFAULT 0,
    
    -- Metadata
    thumbnail_url TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Enable RLS on CAD parts
ALTER TABLE public.cad_parts ENABLE ROW LEVEL SECURITY;