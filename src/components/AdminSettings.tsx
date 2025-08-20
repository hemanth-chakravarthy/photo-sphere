import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, Mail, MessageSquare, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ContactMessages } from "@/components/settings/ContactMessages";

interface SiteSettings {
  [key: string]: any;
}

export const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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
          description: `${key.replace('_', ' ')} updated`,
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

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    debouncedSave(key, value);
  };

  const getSetting = (key: string, defaultValue: any = '') => {
    return settings[key] !== undefined ? settings[key] : defaultValue;
  };

  const handleWatermarkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `watermark.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      updateSetting('watermark_url', data.publicUrl);

      toast({
        title: "Success",
        description: "Watermark uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading watermark:', error);
      toast({
        title: "Error",
        description: "Failed to upload watermark",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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
          <Tabs defaultValue="watermark" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="watermark" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                <span className="hidden sm:inline">Watermark</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
            </TabsList>


            <TabsContent value="watermark" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Watermark Settings</CardTitle>
                  <CardDescription>
                    Upload and configure watermarks for your photos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={getSetting('enable_watermark', false)}
                        onCheckedChange={(checked) => updateSetting('enable_watermark', checked)}
                      />
                      <Label>Enable Watermark on Images</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="watermark-upload">Watermark Image</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() => document.getElementById('watermark-input')?.click()}
                          disabled={uploading}
                          className="flex items-center gap-2"
                        >
                          {uploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          Upload Watermark
                        </Button>
                        <input
                          id="watermark-input"
                          type="file"
                          accept="image/*"
                          onChange={handleWatermarkUpload}
                          className="hidden"
                        />
                        {getSetting('watermark_url') && (
                          <div className="text-sm text-muted-foreground">
                            Watermark uploaded ✓
                          </div>
                        )}
                      </div>
                    </div>

                    {getSetting('watermark_url') && (
                      <div className="space-y-2">
                        <Label>Watermark Preview</Label>
                        <img
                          src={getSetting('watermark_url')}
                          alt="Watermark preview"
                          className="max-w-32 max-h-32 object-contain border rounded"
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label>Watermark Position</Label>
                      <Select
                        value={getSetting('watermark_position', 'bottom-right')}
                        onValueChange={(value) => updateSetting('watermark_position', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-left">Top Left</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="watermark-opacity">Watermark Opacity (%)</Label>
                      <Input
                        id="watermark-opacity"
                        type="number"
                        min="10"
                        max="100"
                        value={getSetting('watermark_opacity', 50)}
                        onChange={(e) => updateSetting('watermark_opacity', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook-url">Facebook URL</Label>
                      <Input
                        id="facebook-url"
                        value={getSetting('facebook_url')}
                        onChange={(e) => updateSetting('facebook_url', e.target.value)}
                        placeholder="https://facebook.com/yourpage"
                      />
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website-url">Website URL</Label>
                      <Input
                        id="website-url"
                        value={getSetting('website_url')}
                        onChange={(e) => updateSetting('website_url', e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
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