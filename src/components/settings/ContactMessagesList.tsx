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
}

export const ContactMessagesList = ({ messages, onMessageClick, onMessageUpdate }: ContactMessagesListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;

    try {
      const { error } = await supabase
        .from('contact_messages' as any)
        .delete()
        .eq('id', messageToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
      
      onMessageUpdate();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages' as any)
        .update({ read_status: true })
        .eq('id', messageId);

      if (error) throw error;
      onMessageUpdate();
    } catch (error) {
      console.error('Error marking message as read:', error);
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
                      setMessageToDelete(message.id);
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};