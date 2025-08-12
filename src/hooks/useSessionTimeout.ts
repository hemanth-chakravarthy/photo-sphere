import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIMEOUT = 25 * 60 * 1000; // 25 minutes (5 min warning)

export function useSessionTimeout() {
  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningTimeoutRef = useRef<NodeJS.Timeout>();
  const warningShownRef = useRef(false);

  const resetTimeout = useCallback(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    warningShownRef.current = false;

    // Only set timeout for admin users
    if (user && isAdmin) {
      // Set warning timeout
      warningTimeoutRef.current = setTimeout(() => {
        if (!warningShownRef.current) {
          warningShownRef.current = true;
          toast({
            title: "Session Warning",
            description: "Your admin session will expire in 5 minutes due to inactivity.",
            variant: "destructive",
          });
        }
      }, WARNING_TIMEOUT);

      // Set logout timeout
      timeoutRef.current = setTimeout(() => {
        signOut();
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity.",
          variant: "destructive",
        });
      }, IDLE_TIMEOUT);
    }
  }, [user, isAdmin, signOut, toast]);

  useEffect(() => {
    if (user && isAdmin) {
      // Events that reset the timeout
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      const resetTimeoutHandler = () => resetTimeout();
      
      // Add event listeners
      events.forEach(event => {
        document.addEventListener(event, resetTimeoutHandler, true);
      });

      // Initial timeout setup
      resetTimeout();

      return () => {
        // Clean up event listeners
        events.forEach(event => {
          document.removeEventListener(event, resetTimeoutHandler, true);
        });
        
        // Clear timeouts
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current);
        }
      };
    }
  }, [user, isAdmin, resetTimeout]);

  return { resetTimeout };
}