import { useState, useEffect, useCallback } from "react";

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Palette, Home, Droplets, Mail, MessageSquare, Save, Loader2, Upload, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ContactMessages } from "@/components/settings/ContactMessages";

interface SiteSettings {
  [key: string]: any;
}

export const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [uploadingWatermark, setUploadingWatermark] = useState(false);
  const { toast } = useToast();

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
        let value = setting.setting_value;
        // Handle JSONB values properly
        if (typeof value === 'object' && value !== null) {
          settingsMap[setting.setting_key] = value;
        } else if (typeof value === 'string') {
          try {
            settingsMap[setting.setting_key] = JSON.parse(value);
          } catch {
            settingsMap[setting.setting_key] = value;
          }
        } else {
          settingsMap[setting.setting_key] = value;
        }
      });

      setSettings(settingsMap);
      
      // Apply theme immediately
      if (settingsMap.theme) {
        applyTheme(settingsMap.theme);
      }
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

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'auto') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Auto-save individual settings with debouncing
  const saveSettingDebounced = useCallback(
    debounce(async (key: string, value: any) => {
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
      } catch (error) {
        console.error('Error saving setting:', error);
        toast({
          title: "Error",
          description: `Failed to save ${key}`,
          variant: "destructive",
        });
      }
    }, 1000),
    [toast]
  );

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Apply theme change immediately
    if (key === 'theme') {
      applyTheme(value);
    }

    // Auto-save after updating
    saveSettingDebounced(key, value);
  };

  const handleWatermarkUpload = async (file: File) => {
    try {
      setUploadingWatermark(true);
      setWatermarkFile(file);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `watermark-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      // Update the watermark image setting
      updateSetting('watermark_image', data.publicUrl);
      
      toast({
        title: "Success",
        description: "Watermark uploaded successfully",
      });

      setWatermarkFile(null);
    } catch (error) {
      console.error('Error uploading watermark:', error);
      toast({
        title: "Error",
        description: "Failed to upload watermark",
        variant: "destructive",
      });
    } finally {
      setUploadingWatermark(false);
    }
  };

  const saveAllSettings = async () => {
    try {
      setSaving(true);

      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));

      const { error } = await supabase
        .from('site_settings' as any)
        .upsert(updates, {
          onConflict: 'setting_key'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "All settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Manage your photography portfolio settings and configuration
              </CardDescription>
            </div>
            <Button 
              onClick={saveAllSettings}
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="homepage" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Homepage</span>
              </TabsTrigger>
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

            <TabsContent value="general" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Site Settings</CardTitle>
                  <CardDescription>
                    Configure your site's basic information and branding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-title">Site Title</Label>
                      <Input
                        id="site-title"
                        value={settings.site_title || ""}
                        onChange={(e) => updateSetting('site_title', e.target.value)}
                        placeholder="My Photography Portfolio"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={settings.site_tagline || ""}
                        onChange={(e) => updateSetting('site_tagline', e.target.value)}
                        placeholder="Capturing moments, creating memories"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-domain">Custom Domain (Optional)</Label>
                    <Input
                      id="custom-domain"
                      value={settings.custom_domain || ""}
                      onChange={(e) => updateSetting('custom_domain', e.target.value)}
                      placeholder="www.yoursite.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance & Theme Settings</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your photography portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Color Theme</Label>
                    <Select
                      value={settings.theme || "light"}
                      onValueChange={(value) => updateSetting('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light Theme</SelectItem>
                        <SelectItem value="dark">Dark Theme</SelectItem>
                        <SelectItem value="auto">Auto (System Preference)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Font Family</Label>
                    <Select
                      value={settings.font_family || "inter"}
                      onValueChange={(value) => updateSetting('font_family', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter (Sans-serif)</SelectItem>
                        <SelectItem value="playfair">Playfair Display (Serif)</SelectItem>
                        <SelectItem value="roboto">Roboto (Sans-serif)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Gallery Layout</Label>
                    <Select
                      value={settings.gallery_layout || "grid"}
                      onValueChange={(value) => updateSetting('gallery_layout', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid Layout</SelectItem>
                        <SelectItem value="masonry">Masonry Layout</SelectItem>
                        <SelectItem value="single">Single Column</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="homepage" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Homepage Layout Settings</CardTitle>
                  <CardDescription>
                    Configure what sections appear on your homepage and their content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.show_featured_photos || false}
                        onCheckedChange={(checked) => updateSetting('show_featured_photos', checked)}
                      />
                      <Label>Show Featured Photos Section</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.show_about_section || false}
                        onCheckedChange={(checked) => updateSetting('show_about_section', checked)}
                      />
                      <Label>Show About Section</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.show_contact_form || false}
                        onCheckedChange={(checked) => updateSetting('show_contact_form', checked)}
                      />
                      <Label>Show Contact Form</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero-title">Hero Section Title</Label>
                      <Input
                        id="hero-title"
                        value={settings.hero_title || ""}
                        onChange={(e) => updateSetting('hero_title', e.target.value)}
                        placeholder="Welcome to My Photography Portfolio"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hero-subtitle">Hero Section Subtitle</Label>
                      <Input
                        id="hero-subtitle"
                        value={settings.hero_subtitle || ""}
                        onChange={(e) => updateSetting('hero_subtitle', e.target.value)}
                        placeholder="Capturing life's beautiful moments"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="about-text">About Section Text</Label>
                      <Textarea
                        id="about-text"
                        value={settings.about_text || ""}
                        onChange={(e) => updateSetting('about_text', e.target.value)}
                        placeholder="Tell visitors about yourself and your photography..."
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="watermark" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Watermark Settings</CardTitle>
                  <CardDescription>
                    Configure watermark options for your photos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.watermark_enabled || false}
                      onCheckedChange={(checked) => updateSetting('watermark_enabled', checked)}
                    />
                    <Label>Enable Watermark</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Watermark Image</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleWatermarkUpload(e.target.files[0]);
                            }
                          }}
                          className="hidden"
                          id="watermark-upload"
                        />
                        <label htmlFor="watermark-upload" className="cursor-pointer">
                          <Button variant="outline" type="button" disabled={uploadingWatermark}>
                            {uploadingWatermark ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                {settings.watermark_image ? 'Change Watermark' : 'Upload Watermark'}
                              </>
                            )}
                          </Button>
                        </label>
                        {watermarkFile && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Selected: {watermarkFile.name}
                          </p>
                        )}
                        {settings.watermark_image && !watermarkFile && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Current watermark uploaded
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Watermark Position</Label>
                    <Select
                      value={settings.watermark_position || "bottom-right"}
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
                      min="0"
                      max="100"
                      value={settings.watermark_opacity || 50}
                      onChange={(e) => updateSetting('watermark_opacity', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Notification Settings</CardTitle>
                  <CardDescription>
                    Configure contact form and email settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email Address</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={settings.admin_email || ""}
                      onChange={(e) => updateSetting('admin_email', e.target.value)}
                      placeholder="admin@yoursite.com"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.email_notifications || false}
                      onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
                    />
                    <Label>Send email notifications when someone contacts you</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.auto_reply_enabled || false}
                      onCheckedChange={(checked) => updateSetting('auto_reply_enabled', checked)}
                    />
                    <Label>Send auto-reply to visitors</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="auto-reply-message">Auto-reply Message</Label>
                    <Textarea
                      id="auto-reply-message"
                      value={settings.auto_reply_message || ""}
                      onChange={(e) => updateSetting('auto_reply_message', e.target.value)}
                      placeholder="Thank you for your message. I'll get back to you soon!"
                      rows={4}
                    />
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
