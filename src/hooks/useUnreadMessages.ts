import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('id', { count: 'exact' })
          .eq('read_status', false);

        if (error) throw error;
        setUnreadCount(data?.length || 0);
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
          setUnreadCount(prev => prev + 1);
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
            setUnreadCount(prev => Math.max(0, prev - 1));
          } else if (oldMessage.read_status && !newMessage.read_status) {
            // Message was marked as unread, increment count
            setUnreadCount(prev => prev + 1);
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