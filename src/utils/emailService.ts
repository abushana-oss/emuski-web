import { generateEmailContent } from '../components/EmailTemplates';

export interface EmailSubscriber {
  id: string;
  email: string;
  subscribeDate: string;
  status: 'active' | 'unsubscribed';
  source: string;
  interests: string[];
  lastEmailOpened?: string;
  emailsOpened?: number;
  clicksCount?: number;
}

export interface EmailCampaign {
  id: string;
  subject: string;
  sentDate: string;
  recipientCount: number;
  openRate: number;
  clickRate: number;
  unsubscribeCount: number;
  content?: string;
}

class EmailService {
  private baseUrl = 'https://api.EMUSKI.com'; // Replace with your actual API endpoint

  async subscribe(email: string, source: string = 'website'): Promise<{ success: boolean; message: string; subscriberId?: string }> {
    try {
      // In a real implementation, this would call your backend API
      const response = await fetch(`${this.baseUrl}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source,
          interests: ['manufacturing', 'engineering', 'AI'],
          subscribeDate: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Send welcome email
      if (data.success) {
        await this.sendWelcomeEmail(email);
      }
      
      return data;
    } catch (error) {
      // Fallback: Store locally
      return this.subscribeLocally(email, source);
    }
  }

  private subscribeLocally(email: string, source: string): { success: boolean; message: string; subscriberId?: string } {
    try {
      const subscribers = this.getLocalSubscribers();
      const existingSubscriber = subscribers.find(sub => sub.email === email.trim().toLowerCase());
      
      if (existingSubscriber) {
        return {
          success: false,
          message: 'You are already subscribed to our newsletter!'
        };
      }

      const newSubscriber: EmailSubscriber = {
        id: Date.now().toString(),
        email: email.trim().toLowerCase(),
        subscribeDate: new Date().toISOString(),
        status: 'active',
        source,
        interests: ['manufacturing', 'engineering', 'AI'],
        emailsOpened: 0,
        clicksCount: 0
      };

      subscribers.push(newSubscriber);
      localStorage.setItem('emuski_subscribers', JSON.stringify(subscribers));

      return {
        success: true,
        message: 'Successfully subscribed! Welcome to EMUSKI insights.',
        subscriberId: newSubscriber.id
      };
    } catch (error) {
      return {
        success: false,
        message: 'Subscription failed. Please try again.'
      };
    }
  }

  async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      return await response.json();
    } catch (error) {
      // Fallback: Update locally
      const subscribers = this.getLocalSubscribers();
      const subscriberIndex = subscribers.findIndex(sub => sub.email === email);
      
      if (subscriberIndex !== -1) {
        subscribers[subscriberIndex].status = 'unsubscribed';
        localStorage.setItem('emuski_subscribers', JSON.stringify(subscribers));
        
        return {
          success: true,
          message: 'Successfully unsubscribed.'
        };
      }
      
      return {
        success: false,
        message: 'Email not found in our records.'
      };
    }
  }

  async sendWelcomeEmail(email: string): Promise<void> {
    try {
      const emailContent = generateEmailContent('welcome', { email });
      
      await fetch(`${this.baseUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
          type: 'welcome'
        }),
      });
    } catch (error) {
      // Failed to send welcome email - silently continue
    }
  }

  async sendDailyNewsletter(): Promise<{ success: boolean; sentCount: number; errors: string[] }> {
    try {
      const subscribers = this.getActiveSubscribers();
      const emailContent = generateEmailContent('daily', {
        featuredArticle: {
          title: "Strategic Sourcing: Building Resilient Supply Chains",
          excerpt: "Learn how strategic sourcing reduces procurement costs by 15-25% while improving supplier performance and risk management.",
          slug: "strategic-sourcing-resilient-supply-chain-manufacturing-success"
        }
      });

      const results = await Promise.allSettled(
        subscribers.map(subscriber => 
          fetch(`${this.baseUrl}/api/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: subscriber.email,
              subject: emailContent.subject,
              html: emailContent.html.replace('{{email}}', subscriber.email),
              text: emailContent.text,
              type: 'daily_newsletter',
              subscriberId: subscriber.id
            }),
          })
        )
      );

      const successCount = results.filter(result => result.status === 'fulfilled').length;
      const errors = results
        .filter((result, index) => result.status === 'rejected')
        .map((result, index) => `${subscribers[index].email}: ${(result as PromiseRejectedResult).reason}`);

      // Log campaign
      this.logCampaign({
        id: Date.now().toString(),
        subject: emailContent.subject,
        sentDate: new Date().toISOString(),
        recipientCount: subscribers.length,
        openRate: 0, // Will be updated when opens are tracked
        clickRate: 0, // Will be updated when clicks are tracked
        unsubscribeCount: 0 // Will be updated when unsubscribes happen
      });

      return {
        success: successCount > 0,
        sentCount: successCount,
        errors
      };
    } catch (error) {
      return {
        success: false,
        sentCount: 0,
        errors: ['Failed to send newsletter: ' + (error as Error).message]
      };
    }
  }

  getLocalSubscribers(): EmailSubscriber[] {
    try {
      const subscribers = localStorage.getItem('emuski_subscribers');
      return subscribers ? JSON.parse(subscribers) : [];
    } catch (error) {
      return [];
    }
  }

  getActiveSubscribers(): EmailSubscriber[] {
    return this.getLocalSubscribers().filter(subscriber => subscriber.status === 'active');
  }

  getSubscriberStats(): {
    total: number;
    active: number;
    unsubscribed: number;
    subscriptionsToday: number;
    subscriptionsThisWeek: number;
  } {
    const subscribers = this.getLocalSubscribers();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: subscribers.length,
      active: subscribers.filter(s => s.status === 'active').length,
      unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
      subscriptionsToday: subscribers.filter(s => 
        new Date(s.subscribeDate) >= today
      ).length,
      subscriptionsThisWeek: subscribers.filter(s => 
        new Date(s.subscribeDate) >= weekAgo
      ).length,
    };
  }

  private logCampaign(campaign: EmailCampaign): void {
    try {
      const campaigns = JSON.parse(localStorage.getItem('emuski_email_campaigns') || '[]');
      campaigns.unshift(campaign); // Add to beginning
      
      // Keep only last 50 campaigns
      const limitedCampaigns = campaigns.slice(0, 50);
      localStorage.setItem('emuski_email_campaigns', JSON.stringify(limitedCampaigns));
    } catch (error) {
      // Failed to log campaign - silently continue
    }
  }

  async trackEmailOpen(subscriberId: string, campaignId: string): Promise<void> {
    try {
      // Update subscriber stats
      const subscribers = this.getLocalSubscribers();
      const subscriberIndex = subscribers.findIndex(s => s.id === subscriberId);
      
      if (subscriberIndex !== -1) {
        subscribers[subscriberIndex].lastEmailOpened = new Date().toISOString();
        subscribers[subscriberIndex].emailsOpened = (subscribers[subscriberIndex].emailsOpened || 0) + 1;
        localStorage.setItem('emuski_subscribers', JSON.stringify(subscribers));
      }

      // Track in analytics (replace with your analytics service)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'email_open', {
          'event_category': 'email_engagement',
          'event_label': campaignId
        });
      }
    } catch (error) {
      // Failed to track email open - silently continue
    }
  }

  async trackEmailClick(subscriberId: string, campaignId: string, url: string): Promise<void> {
    try {
      // Update subscriber stats
      const subscribers = this.getLocalSubscribers();
      const subscriberIndex = subscribers.findIndex(s => s.id === subscriberId);
      
      if (subscriberIndex !== -1) {
        subscribers[subscriberIndex].clicksCount = (subscribers[subscriberIndex].clicksCount || 0) + 1;
        localStorage.setItem('emuski_subscribers', JSON.stringify(subscribers));
      }

      // Track in analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'email_click', {
          'event_category': 'email_engagement',
          'event_label': url
        });
      }
    } catch (error) {
      // Failed to track email click - silently continue
    }
  }

  // Automated daily sending (would be triggered by a cron job or similar)
  setupDailySending(): void {
    // This would typically be handled by your backend cron job
    // For demo purposes, this shows how you might set up daily sending
    
    const sendDaily = () => {
      const now = new Date();
      const hours = now.getHours();
      
      // Send at 8 AM local time
      if (hours === 8) {
        this.sendDailyNewsletter().then(result => {
          // Daily newsletter sent successfully
        }).catch(error => {
          // Failed to send daily newsletter - silently continue
        });
      }
    };

    // Check every hour
    setInterval(sendDaily, 60 * 60 * 1000);
  }

  // Export subscribers for backup/analysis
  exportSubscribers(): void {
    const subscribers = this.getLocalSubscribers();
    const dataStr = JSON.stringify(subscribers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `emuski_subscribers_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
}

// Singleton instance
export const emailService = new EmailService();

// Helper function for React components
export const useEmailService = () => {
  return emailService;
};