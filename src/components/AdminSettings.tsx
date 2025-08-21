import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageSquare, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ContactMessages } from "@/components/settings/ContactMessages";

interface SiteSettings {
  [key: string]: any;
}

export const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  // Debounced save function
  const debounceTimeout = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings' as any)
        .select('*');

      if (error) throw error;

      const settingsMap: SiteSettings = {};
      data?.forEach((setting: any) => {
        settingsMap[setting.setting_key] = setting.setting_value;
      });

      setSettings(settingsMap);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const debouncedSave = useCallback((key: string, value: any) => {
    if (debounceTimeout[0]) {
      clearTimeout(debounceTimeout[0]);
    }

    const timeout = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('site_settings' as any)
          .upsert({
            setting_key: key,
            setting_value: value
          }, {
            onConflict: 'setting_key'
          });

        if (error) throw error;

        toast({
          title: "Saved",
          description: `${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} updated successfully`,
        });
      } catch (error) {
        console.error(`Error saving ${key}:`, error);
        toast({
          title: "Error",
          description: `Failed to save ${key}`,
          variant: "destructive",
        });
      }
    }, 1000);

    debounceTimeout[1](timeout);
  }, [toast]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAndNormalizeURL = (url: string) => {
    if (!url || url.trim() === '') return { isValid: true, normalizedUrl: '' };
    
    const trimmedUrl = url.trim();
    
    // Check if it's already a full URL
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      try {
        new URL(trimmedUrl);
        return { isValid: true, normalizedUrl: trimmedUrl };
      } catch {
        return { isValid: false, normalizedUrl: trimmedUrl };
      }
    }
    
    // Try to normalize by adding https://
    const normalizedUrl = `https://${trimmedUrl}`;
    try {
      new URL(normalizedUrl);
      // Additional validation for common patterns
      const urlPattern = /^https:\/\/[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?([/?].*)?$/;
      if (urlPattern.test(normalizedUrl)) {
        return { isValid: true, normalizedUrl };
      }
      return { isValid: false, normalizedUrl: trimmedUrl };
    } catch {
      return { isValid: false, normalizedUrl: trimmedUrl };
    }
  };

  const updateSetting = (key: string, value: any) => {
    // Validate specific fields before updating
    if (key === 'contact_email' && value && !validateEmail(value)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if ((key.includes('_url') || key === 'website_url') && value) {
      const { isValid, normalizedUrl } = validateAndNormalizeURL(value);
      if (!isValid) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid URL (e.g., example.com or https://example.com)",
          variant: "destructive",
        });
        return;
      }
      // Use the normalized URL for saving
      value = normalizedUrl;
    }

    setSettings(prev => ({ ...prev, [key]: value }));
    debouncedSave(key, value);
  };

  const getSetting = (key: string, defaultValue: any = '') => {
    return settings[key] !== undefined ? settings[key] : defaultValue;
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Manage your photography portfolio settings - changes are automatically saved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
            </TabsList>



            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Configure your contact details and social media links
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={getSetting('contact_email')}
                        onChange={(e) => updateSetting('contact_email', e.target.value)}
                        placeholder="hello@yoursite.com"
                      />
                      <p className="text-xs text-muted-foreground">
                        This email will appear in the footer and can be used for contact links
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Phone Number</Label>
                      <Input
                        id="contact-phone"
                        value={getSetting('contact_phone')}
                        onChange={(e) => updateSetting('contact_phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-address">Address</Label>
                    <Textarea
                      id="contact-address"
                      value={getSetting('contact_address')}
                      onChange={(e) => updateSetting('contact_address', e.target.value)}
                      placeholder="123 Photography Street, City, State 12345"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram-url">Instagram URL</Label>
                      <Input
                        id="instagram-url"
                        value={getSetting('instagram_url')}
                        onChange={(e) => updateSetting('instagram_url', e.target.value)}
                        placeholder="https://instagram.com/yourusername"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter URL with or without https:// (e.g., instagram.com/username)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook-url">Facebook URL</Label>
                      <Input
                        id="facebook-url"
                        value={getSetting('facebook_url')}
                        onChange={(e) => updateSetting('facebook_url', e.target.value)}
                        placeholder="https://facebook.com/yourpage"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter URL with or without https:// (e.g., facebook.com/yourpage)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitter-url">Twitter URL</Label>
                      <Input
                        id="twitter-url"
                        value={getSetting('twitter_url')}
                        onChange={(e) => updateSetting('twitter_url', e.target.value)}
                        placeholder="https://twitter.com/yourusername"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter URL with or without https:// (e.g., twitter.com/username)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                      <Input
                        id="linkedin-url"
                        value={getSetting('linkedin_url')}
                        onChange={(e) => updateSetting('linkedin_url', e.target.value)}
                        placeholder="https://linkedin.com/in/yourusername"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter URL with or without https:// (e.g., linkedin.com/in/username)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website-url">Website URL</Label>
                    <Input
                      id="website-url"
                      value={getSetting('website_url')}
                      onChange={(e) => updateSetting('website_url', e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter URL with or without https:// (e.g., yourwebsite.com)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="mt-6">
              <ContactMessages />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};