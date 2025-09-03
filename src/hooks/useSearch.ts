import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Photo } from "./usePhotos";

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPhotos = useCallback(async (searchTerm: string): Promise<Photo[]> => {
    if (!searchTerm.trim()) {
      return [];
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: searchError } = await supabase
        .from('photos')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (searchError) throw searchError;

      return data || [];
    } catch (err) {
      console.error('Error searching photos:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchPhotos,
    loading,
    error
  };
};