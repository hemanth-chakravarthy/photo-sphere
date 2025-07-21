import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Photo {
  id: string;
  title: string;
  location?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  featured?: boolean;
  tags?: string[];
  category?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPhotos(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      // Remove from local state
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
      return true;
    } catch (err) {
      console.error('Error deleting photo:', err);
      return false;
    }
  };

  const updatePhoto = async (photoId: string, updates: Partial<Photo>) => {
    try {
      const { error } = await supabase
        .from('photos')
        .update(updates)
        .eq('id', photoId);

      if (error) throw error;

      // Update local state
      setPhotos(prev => prev.map(photo => 
        photo.id === photoId ? { ...photo, ...updates } : photo
      ));
      return true;
    } catch (err) {
      console.error('Error updating photo:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return {
    photos,
    loading,
    error,
    refetch: fetchPhotos,
    deletePhoto,
    updatePhoto
  };
};

export const useFeaturedPhotos = () => {
  const { photos, loading, error } = usePhotos();
  
  const featuredPhotos = photos.filter(photo => photo.featured);
  
  return {
    featuredPhotos,
    loading,
    error
  };
};

export interface Collection {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  photoIds: string[];
  photos: Photo[];
}

export const useCollections = (): { collections: Collection[], loading: boolean, error: string | null } => {
  const { photos, loading, error } = usePhotos();

  const collections = photos.reduce((acc: Collection[], photo) => {
    if (!photo.category) return acc;

    let collection = acc.find(c => c.category === photo.category);
    
    if (!collection) {
      const categoryInfo: Record<string, { title: string; description: string }> = {
        landscape: {
          title: "Landscapes",
          description: "Breathtaking landscapes and natural vistas from around the world"
        },
        nature: {
          title: "Nature",
          description: "The beauty of the natural world captured in stunning detail"
        },
        architecture: {
          title: "Architecture",
          description: "Architectural marvels and structural beauty"
        },
        street: {
          title: "Street Photography",
          description: "Life on the streets captured in candid moments"
        },
        portrait: {
          title: "Portraits",
          description: "Intimate portraits showcasing human emotion and character"
        },
        wildlife: {
          title: "Wildlife",
          description: "Amazing creatures in their natural habitats"
        },
        abstract: {
          title: "Abstract",
          description: "Artistic interpretations and abstract compositions"
        }
      };

      const info = categoryInfo[photo.category] || { 
        title: photo.category.charAt(0).toUpperCase() + photo.category.slice(1), 
        description: `Collection of ${photo.category} photography` 
      };

      collection = {
        id: photo.category,
        title: info.title,
        description: info.description,
        category: photo.category,
        coverImage: photo.src,
        photoIds: [],
        photos: []
      };
      acc.push(collection);
    }

    collection.photoIds.push(photo.id);
    collection.photos.push(photo);
    
    return acc;
  }, []);

  return { collections, loading, error };
};