
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
}

// These images are placeholders that will be replaced with the user's actual photos
export const photos: Photo[] = [
  {
    id: "1",
    title: "Mountain Summit",
    location: "Alps, Switzerland",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    alt: "Landscape photography of mountain hit by sun rays",
    width: 800,
    height: 600,
    featured: true,
    tags: ["mountains", "nature", "landscape"],
    category: "landscape"
  },
  {
    id: "2",
    title: "Misty Forests",
    location: "Pacific Northwest",
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    alt: "Foggy mountain summit",
    width: 800,
    height: 1000,
    tags: ["forest", "fog", "nature"],
    category: "nature"
  },
  {
    id: "3",
    title: "Coastal Dreams",
    location: "Big Sur, California",
    src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    alt: "Ocean wave at beach",
    width: 800,
    height: 534,
    featured: true,
    tags: ["ocean", "wave", "water"],
    category: "landscape"
  },
  {
    id: "4",
    title: "Alpine Majesty",
    location: "Dolomites, Italy",
    src: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed",
    alt: "Landscape photo of mountain alps",
    width: 800,
    height: 1200,
    tags: ["mountains", "snow", "landscape"],
    category: "landscape"
  },
  {
    id: "5",
    title: "Canyon Waters",
    location: "Arizona, USA",
    src: "https://images.unsplash.com/photo-1504893524553-b855bce32c67",
    alt: "River surrounded by rock formation",
    width: 800,
    height: 800,
    tags: ["canyon", "river", "rocks"],
    category: "landscape"
  },
  {
    id: "6",
    title: "Enchanted Forest",
    location: "Redwood National Park",
    src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    alt: "Landmark photography of trees near rocky mountain under blue skies daytime",
    width: 800,
    height: 534,
    tags: ["forest", "trees", "nature"],
    category: "nature"
  },
  {
    id: "7",
    title: "Golden Hour",
    location: "Oregon, USA",
    src: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    alt: "Forest heat by sunbeam",
    width: 800,
    height: 1200,
    featured: true,
    tags: ["sunset", "forest", "light"],
    category: "nature"
  },
  {
    id: "8",
    title: "Ancient Bridge",
    location: "Rural Japan",
    src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    alt: "Gray concrete bridge and waterfalls during daytime",
    width: 800,
    height: 534,
    tags: ["bridge", "waterfall", "architecture"],
    category: "architecture"
  },
  {
    id: "9",
    title: "Valley Vista",
    location: "Yosemite National Park",
    src: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
    alt: "River between mountains under white clouds",
    width: 800,
    height: 534,
    tags: ["valley", "river", "mountains"],
    category: "landscape"
  },
  {
    id: "10",
    title: "Pine Forest",
    location: "British Columbia",
    src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
    alt: "Photo of pine trees",
    width: 800,
    height: 1200,
    tags: ["forest", "pine", "trees"],
    category: "nature"
  },
  {
    id: "11",
    title: "Forest Canopy",
    location: "Olympic National Park",
    src: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86",
    alt: "Low angle photography of trees at daytime",
    width: 800,
    height: 1200,
    tags: ["forest", "trees", "canopy"],
    category: "nature"
  }
];

export interface Collection {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  photoIds: string[];
}

// Generate collections dynamically based on categories
export const generateCollections = (): Collection[] => {
  const categories = Array.from(new Set(photos.map(photo => photo.category).filter(Boolean)));
  
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

  return categories.map(category => {
    const categoryPhotos = photos.filter(photo => photo.category === category);
    const info = categoryInfo[category!] || { title: category!, description: `Collection of ${category} photography` };
    
    return {
      id: category!,
      title: info.title,
      description: info.description,
      category: category!,
      coverImage: categoryPhotos[0]?.src || "",
      photoIds: categoryPhotos.map(photo => photo.id)
    };
  });
};

export const collections = generateCollections();
