import { emailService } from './emailService';

// Daily Email Automation Script
// This would typically run as a server-side cron job

export class EmailAutomation {
  private isRunning = false;
  private sendTime = { hour: 8, minute: 0 }; // 8:00 AM

  constructor() {
    this.setupDailyScheduler();
  }

  private setupDailyScheduler(): void {
    // Check every minute if it's time to send
    setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Send at 8:00 AM every day
      if (
        currentHour === this.sendTime.hour && 
        currentMinute === this.sendTime.minute && 
        !this.isRunning
      ) {
        this.sendDailyNewsletter();
      }
    }, 60000); // Check every minute

    // Email automation scheduled for daily sending
  }

  public async sendDailyNewsletter(): Promise<void> {
    if (this.isRunning) {
      // Daily newsletter is already being sent
      return;
    }

    this.isRunning = true;
    // Starting daily newsletter send

    try {
      const result = await emailService.sendDailyNewsletter();
      
      if (result.success) {
        // Daily newsletter sent successfully
        
        if (result.errors.length > 0) {
          // Some emails failed to send
        }

        // Log stats
        const stats = emailService.getSubscriberStats();

      } else {
        // Failed to send daily newsletter
      }

    } catch (error) {
      // Error in daily newsletter automation
    } finally {
      this.isRunning = false;
    }
  }

  public async sendTestNewsletter(): Promise<void> {
    // Sending test newsletter
    await this.sendDailyNewsletter();
  }

  public getScheduleInfo(): { nextSend: Date; subscriberCount: number } {
    const now = new Date();
    const nextSend = new Date();
    
    // Set to next 8 AM
    nextSend.setHours(this.sendTime.hour, this.sendTime.minute, 0, 0);
    
    // If it's past 8 AM today, schedule for tomorrow
    if (now.getHours() >= this.sendTime.hour && now.getMinutes() >= this.sendTime.minute) {
      nextSend.setDate(nextSend.getDate() + 1);
    }

    const stats = emailService.getSubscriberStats();

    return {
      nextSend,
      subscriberCount: stats.active
    };
  }

  public updateSendTime(hour: number, minute: number): void {
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      this.sendTime = { hour, minute };
      // Email send time updated
    } else {
      throw new Error('Invalid time format. Hour must be 0-23, minute must be 0-59.');
    }
  }
}

// Singleton instance
export const emailAutomation = new EmailAutomation();

// Demo functions for testing
export const demoEmailSystem = {
  // Add sample subscribers for testing
  addSampleSubscribers: () => {
    const sampleEmails = [
      'john.doe@manufacturing.com',
      'sarah.smith@industrialcorp.com',
      'mike.wilson@autoparts.com',
      'lisa.chen@electronics.com',
      'david.brown@aerospace.com'
    ];

    sampleEmails.forEach(email => {
      emailService.subscribe(email, 'demo').then(result => {
        // Sample subscriber added
      });
    });
  },

  // Send test email immediately
  sendTestEmail: async () => {
    // Sending test email to all active subscribers
    const result = await emailService.sendDailyNewsletter();
    return result;
  },

  // Get current statistics
  getStats: () => {
    const stats = emailService.getSubscriberStats();
    return stats;
  },

  // Show schedule information
  getScheduleInfo: () => {
    const info = emailAutomation.getScheduleInfo();
    return info;
  },

  // Export all subscriber data
  exportData: () => {
    emailService.exportSubscribers();
  }
};

// Auto-start the automation when imported
// Email automation system initialized

// Add to window for browser console access
if (typeof window !== 'undefined') {
  (window as any).emailDemo = demoEmailSystem;
  (window as any).emailAutomation = emailAutomation;
}