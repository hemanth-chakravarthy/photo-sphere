import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Send, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useRateLimit } from "@/hooks/useRateLimit";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const { toast } = useToast();
  const { checkRateLimit } = useRateLimit();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Error", 
        description: "Email is required",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.message.trim()) {
      toast({
        title: "Error",
        description: "Message is required", 
        variant: "destructive",
      });
      return false;
    }

    if (formData.name.length > 100) {
      toast({
        title: "Error",
        description: "Name must be less than 100 characters",
        variant: "destructive",
      });
      return false;
    }

    if (formData.email.length > 255) {
      toast({
        title: "Error",
        description: "Email must be less than 255 characters",
        variant: "destructive",
      });
      return false;
    }

    if (formData.message.length > 2000) {
      toast({
        title: "Error",
        description: "Message must be less than 2000 characters",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRateLimitError(null);

    console.log('[ContactForm] Submitting with data:', formData);

    if (!validateForm()) {
      console.log('[ContactForm] Validation failed');
      return;
    }
    console.log('[ContactForm] Validation passed');

    // Check rate limit
    const rateLimitResult = await checkRateLimit('contact_form', 3, 60); // 3 submissions per hour
    console.log('[ContactForm] Rate limit result:', rateLimitResult);
    if (!rateLimitResult.isAllowed) {
      const resetTimeStr = rateLimitResult.resetTime ? 
        rateLimitResult.resetTime.toLocaleTimeString() : 
        'in a while';
      setRateLimitError(`Too many submissions. Please try again after ${resetTimeStr}.`);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[ContactForm] Inserting into contact_messages...');
      const { error } = await supabase
        .from('contact_messages' as any)
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            message: formData.message.trim(),
          },
        ]);

      if (error) {
        console.error('[ContactForm] Insert error:', error);
        throw error;
      }
      console.log('[ContactForm] Insert success');

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      toast({
        title: 'Success!',
        description: "Your message has been sent successfully. We'll get back to you soon!",
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      // Handle specific validation errors from our database trigger
      if (error instanceof Error) {
        if (
          error.message.includes('Name is required') ||
          error.message.includes('Valid email is required') ||
          error.message.includes('Message is required') ||
          error.message.includes('must be less than')
        ) {
          toast({
            title: 'Validation Error',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to send message. Please try again later.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send message. Please try again later.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
      console.log('[ContactForm] Submit finished');
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
            <p className="text-muted-foreground mb-4">
              Thank you for contacting us. We'll get back to you soon!
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSubmitted(false)}
            >
              Send Another Message
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get In Touch</CardTitle>
      </CardHeader>
      <CardContent>
        {rateLimitError && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {rateLimitError}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                disabled={isSubmitting}
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={255}
                disabled={isSubmitting}
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              maxLength={2000}
              disabled={isSubmitting}
              placeholder="Your message..."
              rows={6}
            />
            <div className="text-sm text-muted-foreground text-right">
              {formData.message.length}/2000 characters
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};