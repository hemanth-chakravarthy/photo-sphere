import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const { data, error, count } = await supabase
          .from('contact_messages' as any)
          .select('id', { count: 'exact', head: true })
          .eq('read_status', false);

        if (error) throw error;
        const newCount = count || 0;
        setUnreadCount(newCount);
        console.log('[useUnreadMessages] Initial unread count:', newCount);
      } catch (error) {
        console.error('Error loading unread messages count:', error);
      }
    };

    loadUnreadCount();

    // Set up real-time subscription for message changes
    const channel = supabase
      .channel('unread_messages_count')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_messages'
        },
        () => {
          // New message added, increment count
          setUnreadCount(prev => {
            const next = prev + 1;
            console.log('[useUnreadMessages] New message inserted. Count:', next);
            return next;
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'contact_messages'
        },
        (payload) => {
          // Check if read_status changed from false to true
          const oldMessage = payload.old as any;
          const newMessage = payload.new as any;
          
          if (!oldMessage.read_status && newMessage.read_status) {
            // Message was marked as read, decrement count
            setUnreadCount(prev => {
              const next = Math.max(0, prev - 1);
              console.log('[useUnreadMessages] Message marked read. Count:', next);
              return next;
            });
          } else if (oldMessage.read_status && !newMessage.read_status) {
            // Message was marked as unread, increment count
            setUnreadCount(prev => {
              const next = prev + 1;
              console.log('[useUnreadMessages] Message marked unread. Count:', next);
              return next;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { unreadCount };
};