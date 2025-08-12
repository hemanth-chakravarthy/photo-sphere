import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RateLimitResult {
  isAllowed: boolean;
  remainingAttempts: number;
  resetTime?: Date;
}

export function useRateLimit() {
  const [isChecking, setIsChecking] = useState(false);

  const checkRateLimit = useCallback(async (action: string, maxAttempts = 5, windowMinutes = 15): Promise<RateLimitResult> => {
    setIsChecking(true);
    
    try {
      // Get client IP (this is a simplified approach - in production you'd want server-side rate limiting)
      const now = new Date();
      const windowStart = new Date(now.getTime() - (windowMinutes * 60 * 1000));
      
      // For contact form, we'll use a simple localStorage-based approach for demo purposes
      // In production, this should be handled server-side with IP tracking
      const storageKey = `rate_limit_${action}`;
      const attempts = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Filter attempts within the time window
      const recentAttempts = attempts.filter((timestamp: string) => 
        new Date(timestamp) > windowStart
      );
      
      const remainingAttempts = Math.max(0, maxAttempts - recentAttempts.length);
      const isAllowed = recentAttempts.length < maxAttempts;
      
      if (isAllowed) {
        // Record this attempt
        recentAttempts.push(now.toISOString());
        localStorage.setItem(storageKey, JSON.stringify(recentAttempts));
      }
      
      const resetTime = recentAttempts.length > 0 ? 
        new Date(new Date(recentAttempts[0]).getTime() + (windowMinutes * 60 * 1000)) : 
        undefined;
      
      return {
        isAllowed,
        remainingAttempts,
        resetTime
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Allow by default on error to prevent blocking users
      return {
        isAllowed: true,
        remainingAttempts: maxAttempts
      };
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    checkRateLimit,
    isChecking
  };
}