import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  [key: string]: any;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings' as any)
        .select('*');

      if (error) throw error;

      const settingsMap: SiteSettings = {};
      data?.forEach((setting: any) => {
        let value = setting.setting_value;
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch {
            // Keep as string
          }
        }
        settingsMap[setting.setting_key] = value;
      });

      setSettings(settingsMap);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, refetch: loadSettings };
};
