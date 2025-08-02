import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Globe, Palette, Home, Droplets, Mail, AlertTriangle } from "lucide-react";

export const SimpleAdminSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Manage your photography portfolio settings and configuration
          </CardDescription>
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Database migration required to enable full settings functionality
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
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
                        placeholder="My Photography Portfolio"
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        placeholder="Capturing moments, creating memories"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-domain">Custom Domain (Optional)</Label>
                    <Input
                      id="custom-domain"
                      placeholder="www.yoursite.com"
                      disabled
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Site Logo</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <div className="flex flex-col items-center justify-center opacity-50">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">Upload Logo (Disabled)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Favicon</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <div className="flex flex-col items-center justify-center opacity-50">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">Upload Favicon (Disabled)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button disabled className="w-full">
                    Save General Settings (Requires Migration)
                  </Button>
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
                    <Select disabled>
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
                    <Label htmlFor="font-select">Font Family</Label>
                    <Select disabled>
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

                  <Button disabled className="w-full">
                    Save Appearance Settings (Requires Migration)
                  </Button>
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
                      <Switch disabled />
                      <Label>Show Featured Photos Section</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch disabled />
                      <Label>Show About Section</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch disabled />
                      <Label>Show Contact Form</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero-title">Hero Section Title</Label>
                      <Input
                        id="hero-title"
                        placeholder="Welcome to My Photography Portfolio"
                        disabled
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hero-subtitle">Hero Section Subtitle</Label>
                      <Input
                        id="hero-subtitle"
                        placeholder="Capturing life's beautiful moments"
                        disabled
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="about-text">About Section Text</Label>
                      <Textarea
                        id="about-text"
                        placeholder="Tell visitors about yourself and your photography..."
                        rows={4}
                        disabled
                      />
                    </div>
                  </div>

                  <Button disabled className="w-full">
                    Save Homepage Settings (Requires Migration)
                  </Button>
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
                    <Switch disabled />
                    <Label>Enable Watermark</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Watermark Image</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                      <div className="flex flex-col items-center justify-center opacity-50">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Upload Watermark (Disabled)</span>
                      </div>
                    </div>
                  </div>

                  <Button disabled className="w-full">
                    Save Watermark Settings (Requires Migration)
                  </Button>
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
                      placeholder="admin@yoursite.com"
                      disabled
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch disabled />
                    <Label>Send email notifications when someone contacts you</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch disabled />
                    <Label>Send auto-reply to visitors</Label>
                  </div>

                  <Button disabled className="w-full">
                    Save Contact Settings (Requires Migration)
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};