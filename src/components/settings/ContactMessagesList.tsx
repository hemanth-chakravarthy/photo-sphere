import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Mail, Clock, User, Trash2, Archive, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read_status: boolean;
  admin_notes?: string;
}

interface ContactMessagesListProps {
  messages: ContactMessage[];
  onMessageClick: (message: ContactMessage) => void;
  onMessageUpdate: () => void;
  onMessageDelete: (messageId: string) => void;
  onMessageRead: (messageId: string) => void;
}

export const ContactMessagesList = ({ messages, onMessageClick, onMessageUpdate, onMessageDelete, onMessageRead }: ContactMessagesListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;

    setIsDeleting(true);
    
    try {
      console.log('[ContactMessagesList] Deleting message:', messageToDelete.id);
      
      // Optimistic update - remove from UI immediately
      onMessageDelete(messageToDelete.id);

      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageToDelete.id);

      if (error) {
        console.error('[ContactMessagesList] Delete error:', error);
        throw error;
      }

      console.log('[ContactMessagesList] Message deleted successfully');
      
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    } catch (error) {
      console.error('[ContactMessagesList] Error deleting message:', error);
      
      // Revert optimistic update by refreshing the data
      onMessageUpdate();
      
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      console.log('[ContactMessagesList] Marking message as read:', messageId);
      
      // Optimistic update
      onMessageRead(messageId);

      const { error } = await supabase
        .from('contact_messages')
        .update({ read_status: true })
        .eq('id', messageId);

      if (error) {
        console.error('[ContactMessagesList] Mark as read error:', error);
        throw error;
      }

      console.log('[ContactMessagesList] Message marked as read successfully');
    } catch (error) {
      console.error('[ContactMessagesList] Error marking message as read:', error);
      
      // Revert optimistic update
      onMessageUpdate();
      
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive",
      });
    }
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg">No messages have been received yet</p>
        <p className="text-sm mt-2">Messages from your contact form will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {messages.map((message) => (
          <Card 
            key={message.id} 
            className={`transition-colors hover:shadow-md ${
              !message.read_status ? 'border-primary/50 bg-primary/5' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div 
                  className="space-y-2 flex-1 cursor-pointer"
                  onClick={() => {
                    onMessageClick(message);
                    if (!message.read_status) {
                      markAsRead(message.id);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{message.name}</span>
                    {!message.read_status && (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-red-500 rounded-full" />
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{message.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(message.created_at)}</span>
                  </div>
                  
                  <p className="text-sm mt-2 line-clamp-2">
                    {message.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {!message.read_status && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(message.id);
                      }}
                      title="Mark as read"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMessageToDelete(message);
                      setDeleteDialogOpen(true);
                    }}
                    title="Delete message"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};