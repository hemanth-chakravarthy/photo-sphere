import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ContactMessagesList } from "./ContactMessagesList";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read_status: boolean;
  admin_notes?: string;
}

export const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('contact_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_messages'
        },
        (payload) => {
          console.log('New contact message received:', payload);
          const newMessage = payload.new as ContactMessage;
          setMessages(prev => [newMessage, ...prev]);
          toast({
            title: "New Message Received",
            description: `New message from ${newMessage.name}`,
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
          console.log('Contact message updated:', payload);
          const updatedMessage = payload.new as ContactMessage;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const loadMessages = async () => {
    try {
      console.log('[ContactMessages] Loading messages...');
      const { data, error } = await supabase
        .from('contact_messages' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('[ContactMessages] Loaded messages count:', (data as any)?.length ?? 0);
      setMessages((data as unknown as ContactMessage[]) || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load contact messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMessageDelete = (messageId: string) => {
    console.log('[ContactMessages] Optimistically removing message:', messageId);
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    // Clear selected message if it was deleted
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
  };

  const handleMessageRead = (messageId: string) => {
    console.log('[ContactMessages] Optimistically marking message as read:', messageId);
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, read_status: true } : msg
      )
    );
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages' as any)
        .update({ read_status: true })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, read_status: true } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive",
      });
    }
  };

  const saveAdminNotes = async (messageId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages' as any)
        .update({ admin_notes: notes })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, admin_notes: notes } : msg
        )
      );

      toast({
        title: "Success",
        description: "Admin notes saved successfully",
      });
    } catch (error) {
      console.error('Error saving admin notes:', error);
      toast({
        title: "Error",
        description: "Failed to save admin notes",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading messages...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Messages
            {messages.filter(msg => !msg.read_status).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {messages.filter(msg => !msg.read_status).length} new
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            View and manage messages from visitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactMessagesList 
            messages={messages} 
            onMessageClick={(message) => {
              setSelectedMessage(message);
              setAdminNotes(message.admin_notes || "");
            }}
            onMessageUpdate={loadMessages}
            onMessageDelete={handleMessageDelete}
            onMessageRead={handleMessageRead}
          />
        </CardContent>
      </Card>

      {selectedMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
            <CardDescription>
              From: {selectedMessage.name} ({selectedMessage.email})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Message:</Label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Received:</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDate(selectedMessage.created_at)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-notes">Admin Notes (Internal)</Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this message..."
                rows={3}
              />
              <Button 
                onClick={() => saveAdminNotes(selectedMessage.id, adminNotes)}
                size="sm"
              >
                Save Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};