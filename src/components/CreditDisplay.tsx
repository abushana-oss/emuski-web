'use client';

import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface CreditDisplayProps {
  remaining: number;
  limit: number;
  resetTime?: string;
  timeUntilReset?: number;
  onRefresh?: () => void;
  className?: string;
  isLoading?: boolean;
}

export const CreditDisplay: React.FC<CreditDisplayProps> = ({
  remaining,
  limit,
  resetTime,
  timeUntilReset,
  onRefresh,
  className = '',
  isLoading = false
}) => {
  const [timeDisplay, setTimeDisplay] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update time display every minute
  useEffect(() => {
    const updateTimeDisplay = () => {
      const now = new Date();
      const reset = new Date(resetTime);
      const diffMs = reset.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setTimeDisplay('Credits have reset! Refresh to update.');
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeDisplay(`${hours}h ${minutes}m`);
      } else {
        setTimeDisplay(`${minutes}m`);
      }
    };

    updateTimeDisplay();
    const interval = setInterval(updateTimeDisplay, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [resetTime]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const formatResetTime = () => {
    const reset = new Date(resetTime);
    const now = new Date();
    
    // Check if reset is today or tomorrow
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const resetDate = new Date(reset.getFullYear(), reset.getMonth(), reset.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    let dateLabel = '';
    if (resetDate.getTime() === today.getTime()) {
      dateLabel = 'today';
    } else if (resetDate.getTime() === tomorrow.getTime()) {
      dateLabel = 'tomorrow';
    } else {
      dateLabel = reset.toLocaleDateString();
    }
    
    const timeLabel = reset.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    return `${dateLabel} at ${timeLabel}`;
  };

  const percentUsed = ((limit - remaining) / limit) * 100;
  const isLow = remaining <= 2;
  const isEmpty = remaining === 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Loading credits...
            </span>
            <div className="animate-pulse h-4 w-16 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Credit Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">
            {remaining.toFixed(1)} / {limit} credits
          </span>
          {isEmpty && (
            <Badge className="text-xs bg-red-100 text-red-800 border-red-200">
              No credits
            </Badge>
          )}
          {isLow && !isEmpty && (
            <Badge className="text-xs bg-orange-100 text-orange-800 border-orange-200">
              Low credits
            </Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-6 px-2 text-xs font-medium hover:bg-emuski-teal/10"
        >
          {isRefreshing ? 'Updating...' : 'Refresh'}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-border rounded-full h-2 mt-3 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            isEmpty ? 'bg-red-500' : 
            isLow ? 'bg-orange-500' : 
            'bg-gradient-to-r from-emuski-teal to-emuski-teal-light'
          }`}
          style={{ width: `${(remaining / limit) * 100}%` }}
        />
      </div>

      {/* Reset Information */}
      <div className="text-xs text-muted-foreground">
        {isEmpty ? (
          <span className="text-red-600 font-medium">
            Credits reset {formatResetTime()} ({timeDisplay})
          </span>
        ) : (
          <span>
            Resets {formatResetTime()} ({timeDisplay})
          </span>
        )}
      </div>


      {/* Low Credits Warning */}
      {isLow && !isEmpty && (
        <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl">
          <p className="text-sm text-orange-800 font-semibold">
            Only {remaining.toFixed(1)} credit{remaining === 1 ? '' : 's'} remaining
          </p>
          <p className="text-xs text-orange-700 mt-1.5">
            Use them wisely! Credits reset {formatResetTime()}.
          </p>
        </div>
      )}
    </div>
  );
};