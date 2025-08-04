import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Palette, Home, Droplets, Mail, MessageSquare, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ContactMessages } from "@/components/settings/ContactMessages";

interface SiteSettings {
  [key: string]: any;
}

export const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<SiteSettings>({});
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      console.log('Loading settings...');
      
      const { data, error } = await supabase
        .from('site_settings' as any)
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Raw settings data:', data);

      const settingsMap: SiteSettings = {};
      data?.forEach((setting: any) => {
        // Handle both string and JSONB values
        let value = setting.setting_value;
        if (typeof value === 'string') {
          try {
            // Try to parse as JSON if it's a string
            value = JSON.parse(value);
          } catch {
            // If parsing fails, keep as string
          }
        }
        settingsMap[setting.setting_key] = value;
      });

      console.log('Processed settings:', settingsMap);
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: `Failed to load settings: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    console.log(`Updating setting ${key} to:`, value);
    setUnsavedChanges(prev => ({ ...prev, [key]: value }));
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSetting = async (key: string) => {
    const value = unsavedChanges[key] !== undefined ? unsavedChanges[key] : settings[key];
    
    try {
      setSaving(key);
      console.log(`Saving setting ${key} with value:`, value);

      // Prepare the value - if it's an object, keep it as is (Supabase handles JSONB)
      // If it's a primitive, store it directly
      const settingValue = typeof value === 'object' && value !== null 
        ? value 
        : value;

      const { error } = await supabase
        .from('site_settings' as any)
        .upsert({
          setting_key: key,
          setting_value: settingValue
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        console.error('Supabase upsert error:', error);
        throw error;
      }

      // Remove from unsaved changes
      setUnsavedChanges(prev => {
        const newUnsaved = { ...prev };
        delete newUnsaved[key];
        return newUnsaved;
      });
      
      toast({
        title: "Success",
        description: `${key.replace('_', ' ')} updated successfully`,
      });
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${key}: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const saveAllSettings = async () => {
    if (Object.keys(unsavedChanges).length === 0) {
      toast({
        title: "Info",
        description: "No changes to save",
      });
      return;
    }

    try {
      setSaving('all');
      console.log('Saving all unsaved changes:', unsavedChanges);

      const updates = Object.entries(unsavedChanges).map(([key, value]) => ({
        setting_key: key,
        setting_value: typeof value === 'object' && value !== null ? value : value
      }));

      const { error } = await supabase
        .from('site_settings' as any)
        .upsert(updates, {
          onConflict: 'setting_key'
        });

      if (error) {
        console.error('Batch upsert error:', error);
        throw error;
      }

      setUnsavedChanges({});
      
      toast({
        title: "Success",
        description: "All settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving all settings:', error);
      toast({
        title: "Error",
        description: `Failed to save settings: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const getSetting = (key: string, defaultValue: any = '') => {
    return unsavedChanges[key] !== undefined ? unsavedChanges[key] : (settings[key] || defaultValue);
  };

  const hasUnsavedChanges = Object.keys(unsavedChanges).length > 0;

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
            {hasUnsavedChanges && (
              <Button 
                onClick={saveAllSettings}
                disabled={saving === 'all'}
                className="flex items-center gap-2"
              >
                {saving === 'all' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save All Changes
              </Button>
            )}
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
                      <div className="flex gap-2">
                        <Input
                          id="site-title"
                          value={getSetting('site_title')}
                          onChange={(e) => updateSetting('site_title', e.target.value)}
                          placeholder="My Photography Portfolio"
                          disabled={saving === 'site_title'}
                        />
                        <Button
                          size="sm"
                          onClick={() => saveSetting('site_title')}
                          disabled={saving === 'site_title' || getSetting('site_title') === settings.site_title}
                        >
                          {saving === 'site_title' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tagline">Tagline</Label>
                      <div className="flex gap-2">
                        <Input
                          id="tagline"
                          value={getSetting('site_tagline')}
                          onChange={(e) => updateSetting('site_tagline', e.target.value)}
                          placeholder="Capturing moments, creating memories"
                          disabled={saving === 'site_tagline'}
                        />
                        <Button
                          size="sm"
                          onClick={() => saveSetting('site_tagline')}
                          disabled={saving === 'site_tagline' || getSetting('site_tagline') === settings.site_tagline}
                        >
                          {saving === 'site_tagline' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-domain">Custom Domain (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="custom-domain"
                        value={getSetting('custom_domain')}
                        onChange={(e) => updateSetting('custom_domain', e.target.value)}
                        placeholder="www.yoursite.com"
                        disabled={saving === 'custom_domain'}
                      />
                      <Button
                        size="sm"
                        onClick={() => saveSetting('custom_domain')}
                        disabled={saving === 'custom_domain' || getSetting('custom_domain') === settings.custom_domain}
                      >
                        {saving === 'custom_domain' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
                    </div>
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
                    <div className="flex gap-2">
                      <Select
                        value={getSetting('theme', 'light')}
                        onValueChange={(value) => updateSetting('theme', value)}
                        disabled={saving === 'theme'}
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
                      <Button
                        size="sm"
                        onClick={() => saveSetting('theme')}
                        disabled={saving === 'theme' || getSetting('theme') === settings.theme}
                      >
                        {saving === 'theme' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Font Family</Label>
                    <div className="flex gap-2">
                      <Select
                        value={getSetting('font_family', 'inter')}
                        onValueChange={(value) => updateSetting('font_family', value)}
                        disabled={saving === 'font_family'}
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
                      <Button
                        size="sm"
                        onClick={() => saveSetting('font_family')}
                        disabled={saving === 'font_family' || getSetting('font_family') === settings.font_family}
                      >
                        {saving === 'font_family' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Gallery Layout</Label>
                    <div className="flex gap-2">
                      <Select
                        value={getSetting('gallery_layout', 'grid')}
                        onValueChange={(value) => updateSetting('gallery_layout', value)}
                        disabled={saving === 'gallery_layout'}
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
                      <Button
                        size="sm"
                        onClick={() => saveSetting('gallery_layout')}
                        disabled={saving === 'gallery_layout' || getSetting('gallery_layout') === settings.gallery_layout}
                      >
                        {saving === 'gallery_layout' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
                    </div>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={getSetting('show_featured_photos', false)}
                          onCheckedChange={(checked) => updateSetting('show_featured_photos', checked)}
                          disabled={saving === 'show_featured_photos'}
                        />
                        <Label>Show Featured Photos Section</Label>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => saveSetting('show_featured_photos')}
                        disabled={saving === 'show_featured_photos' || getSetting('show_featured_photos') === settings.show_featured_photos}
                      >
                        {saving === 'show_featured_photos' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={getSetting('show_about_section', false)}
                          onCheckedChange={(checked) => updateSetting('show_about_section', checked)}
                          disabled={saving === 'show_about_section'}
                        />
                        <Label>Show About Section</Label>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => saveSetting('show_about_section')}
                        disabled={saving === 'show_about_section' || getSetting('show_about_section') === settings.show_about_section}
                      >
                        {saving === 'show_about_section' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={getSetting('show_contact_form', false)}
                          onCheckedChange={(checked) => updateSetting('show_contact_form', checked)}
                          disabled={saving === 'show_contact_form'}
                        />
                        <Label>Show Contact Form</Label>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => saveSetting('show_contact_form')}
                        disabled={saving === 'show_contact_form' || getSetting('show_contact_form') === settings.show_contact_form}
                      >
                        {saving === 'show_contact_form' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero-title">Hero Section Title</Label>
                      <div className="flex gap-2">
                        <Input
                          id="hero-title"
                          value={getSetting('hero_title')}
                          onChange={(e) => updateSetting('hero_title', e.target.value)}
                          placeholder="Welcome to My Photography Portfolio"
                          disabled={saving === 'hero_title'}
                        />
                        <Button
                          size="sm"
                          onClick={() => saveSetting('hero_title')}
                          disabled={saving === 'hero_title' || getSetting('hero_title') === settings.hero_title}
                        >
                          {saving === 'hero_title' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hero-subtitle">Hero Section Subtitle</Label>
                      <div className="flex gap-2">
                        <Input
                          id="hero-subtitle"
                          value={getSetting('hero_subtitle')}
                          onChange={(e) => updateSetting('hero_subtitle', e.target.value)}
                          placeholder="Capturing life's beautiful moments"
                          disabled={saving === 'hero_subtitle'}
                        />
                        <Button
                          size="sm"
                          onClick={() => saveSetting('hero_subtitle')}
                          disabled={saving === 'hero_subtitle' || getSetting('hero_subtitle') === settings.hero_subtitle}
                        >
                          {saving === 'hero_subtitle' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="about-text">About Section Text</Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="about-text"
                          value={getSetting('about_text')}
                          onChange={(e) => updateSetting('about_text', e.target.value)}
                          placeholder="Tell visitors about yourself and your photography..."
                          rows={4}
                          disabled={saving === 'about_text'}
                        />
                        <Button
                          size="sm"
                          onClick={() => saveSetting('about_text')}
                          disabled={saving === 'about_text' || getSetting('about_text') === settings.about_text}
                        >
                          {saving === 'about_text' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        </Button>
                      </div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={getSetting('watermark_enabled', false)}
                        onCheckedChange={(checked) => updateSetting('watermark_enabled', checked)}
                        disabled={saving === 'watermark_enabled'}
                      />
                      <Label>Enable Watermark</Label>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => saveSetting('watermark_enabled')}
                      disabled={saving === 'watermark_enabled' || getSetting('watermark_enabled') === settings.watermark_enabled}
                    >
                      {saving === 'watermark_enabled' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label>Watermark Position</Label>
                    <div className="flex gap-2">
                      <Select
                        value={getSetting('watermark_position', 'bottom-right')}
                        onValueChange={(value) => updateSetting('watermark_position', value)}
                        disabled={saving === 'watermark_position'}
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
                      <Button
                        size="sm"
                        onClick={() => saveSetting('watermark_position')}
                        disabled={saving === 'watermark_position' || getSetting('watermark_position') === settings.watermark_position}
                      >
                        {saving === 'watermark_position' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="watermark-opacity">Watermark Opacity (%)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="watermark-opacity"
                        type="number"
                        min="0"
                        max="100"
                        value={getSetting('watermark_opacity', 50)}
                        onChange={(e) => updateSetting('watermark_opacity', parseInt(e.target.value) || 0)}
                        disabled={saving === 'watermark_opacity'}
                      />
                      <Button
                        size="sm"
                        onClick={() => saveSetting('watermark_opacity')}
                        disabled={saving === 'watermark_opacity' || getSetting('watermark_opacity') === settings.watermark_opacity}
                      >
                        {saving === 'watermark_opacity' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
                    </div>
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
                    <div className="flex gap-2">
                      <Input
                        id="admin-email"
                        type="email"
                        value={getSetting('admin_email')}
                        onChange={(e) => updateSetting('admin_email', e.target.value)}
                        placeholder="admin@yoursite.com"
                        disabled={saving === 'admin_email'}
                      />
                      <Button
                        size="sm"
                        onClick={() => saveSetting('admin_email')}
                        disabled={saving === 'admin_email' || getSetting('admin_email') === settings.admin_email}
                      >
                        {saving === 'admin_email' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={getSetting('email_notifications', false)}
                        onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
                        disabled={saving === 'email_notifications'}
                      />
                      <Label>Send email notifications when someone contacts you</Label>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => saveSetting('email_notifications')}
                      disabled={saving === 'email_notifications' || getSetting('email_notifications') === settings.email_notifications}
                    >
                      {saving === 'email_notifications' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={getSetting('auto_reply_enabled', false)}
                        onCheckedChange={(checked) => updateSetting('auto_reply_enabled', checked)}
                        disabled={saving === 'auto_reply_enabled'}
                      />
                      <Label>Send auto-reply to visitors</Label>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => saveSetting('auto_reply_enabled')}
                      disabled={saving === 'auto_reply_enabled' || getSetting('auto_reply_enabled') === settings.auto_reply_enabled}
                    >
                      {saving === 'auto_reply_enabled' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="auto-reply-message">Auto-reply Message</Label>
                    <div className="flex gap-2">
                      <Textarea
                        id="auto-reply-message"
                        value={getSetting('auto_reply_message')}
                        onChange={(e) => updateSetting('auto_reply_message', e.target.value)}
                        placeholder="Thank you for your message. I'll get back to you soon!"
                        rows={4}
                        disabled={saving === 'auto_reply_message'}
                      />
                      <Button
                        size="sm"
                        onClick={() => saveSetting('auto_reply_message')}
                        disabled={saving === 'auto_reply_message' || getSetting('auto_reply_message') === settings.auto_reply_message}
                      >
                        {saving === 'auto_reply_message' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
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
