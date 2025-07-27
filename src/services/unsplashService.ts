// Unsplash image service for professional imagery
// Since we can't make direct API calls in this environment, we'll use curated Unsplash URLs

export interface UnsplashImage {
  id: string;
  url: string;
  alt: string;
  description: string;
  photographer: string;
  width: number;
  height: number;
}

// Curated high-quality images for the food assistance platform
export const unsplashImages = {
  // Hero banners for home page
  heroes: [
    {
      id: "hero-1",
      url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920&h=800&fit=crop&crop=center",
      alt: "Community food distribution",
      description: "Community food distribution",
      photographer: "Joel Muniz",
      width: 1920,
      height: 800,
    },
    {
      id: "hero-2",
      url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&h=800&fit=crop&crop=center",
      alt: "Hands sharing food",
      description: "Hands sharing food",
      photographer: "Priscilla Du Preez",
      width: 1920,
      height: 800,
    },
    {
      id: "hero-3",
      url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&h=800&fit=crop&crop=center",
      alt: "Community helping together",
      description: "Community helping together",
      photographer: "Hannah Busing",
      width: 1920,
      height: 800,
    },
  ],

  // Category images
  categories: {
    "emergency-relief": {
      id: "cat-emergency",
      url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop&crop=center",
      alt: "Emergency food relief",
      description: "Emergency food relief",
      photographer: "Joel Muniz",
      width: 400,
      height: 300,
    },
    "food-banks": {
      id: "cat-food-banks",
      url: "https://images.unsplash.com/photo-1593113616828-6f22bfa65994?w=400&h=300&fit=crop&crop=center",
      alt: "Food bank organization",
      description: "Food bank organization",
      photographer: "Joel Muniz",
      width: 400,
      height: 300,
    },
    "community-kitchens": {
      id: "cat-kitchens",
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center",
      alt: "Community kitchen",
      description: "Community kitchen",
      photographer: "Annie Spratt",
      width: 400,
      height: 300,
    },
    "school-meals": {
      id: "cat-schools",
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
      alt: "School meal program",
      description: "School meal program",
      photographer: "National Cancer Institute",
      width: 400,
      height: 300,
    },
    "senior-support": {
      id: "cat-seniors",
      url: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&h=300&fit=crop&crop=center",
      alt: "Senior meal support",
      description: "Senior meal support",
      photographer: "Esther Ann",
      width: 400,
      height: 300,
    },
    "holiday-meals": {
      id: "cat-holidays",
      url: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&crop=center",
      alt: "Holiday meal distribution",
      description: "Holiday meal distribution",
      photographer: "Element5 Digital",
      width: 400,
      height: 300,
    },
  },

  // Cause example images
  causes: [
    {
      id: "cause-1",
      url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop&crop=center",
      alt: "Food distribution to families",
      description: "Food distribution to families",
      photographer: "Joel Muniz",
      width: 600,
      height: 400,
    },
    {
      id: "cause-2",
      url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop&crop=center",
      alt: "Community volunteers",
      description: "Community volunteers",
      photographer: "Hannah Busing",
      width: 600,
      height: 400,
    },
    {
      id: "cause-3",
      url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop&crop=center",
      alt: "Helping hands with food",
      description: "Helping hands with food",
      photographer: "Priscilla Du Preez",
      width: 600,
      height: 400,
    },
    {
      id: "cause-4",
      url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=400&fit=crop&crop=center",
      alt: "Food pantry organization",
      description: "Food pantry organization",
      photographer: "Joel Muniz",
      width: 600,
      height: 400,
    },
    {
      id: "cause-5",
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center",
      alt: "Nutritious meal preparation",
      description: "Nutritious meal preparation",
      photographer: "National Cancer Institute",
      width: 600,
      height: 400,
    },
    {
      id: "cause-6",
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&crop=center",
      alt: "Community cooking",
      description: "Community cooking",
      photographer: "Annie Spratt",
      width: 600,
      height: 400,
    },
  ],

  // Profile images
  profiles: [
    {
      id: "profile-1",
      url: "https://images.unsplash.com/photo-1494790108755-2616b612b586?w=150&h=150&fit=crop&crop=face",
      alt: "Professional woman",
      description: "Professional woman",
      photographer: "Christopher Campbell",
      width: 150,
      height: 150,
    },
    {
      id: "profile-2",
      url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      alt: "Professional man",
      description: "Professional man",
      photographer: "Christopher Campbell",
      width: 150,
      height: 150,
    },
    {
      id: "profile-3",
      url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      alt: "Young professional",
      description: "Young professional",
      photographer: "Christopher Campbell",
      width: 150,
      height: 150,
    },
  ],

  // Background patterns and textures
  backgrounds: {
    pattern1: {
      id: "bg-1",
      url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop&crop=center&opacity=0.1",
      alt: "Subtle pattern background",
      description: "Subtle pattern background",
      photographer: "Gradientify",
      width: 1920,
      height: 1080,
    },
    gradient1: {
      id: "bg-2",
      url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&h=1080&fit=crop&crop=center&opacity=0.1",
      alt: "Gradient background",
      description: "Gradient background",
      photographer: "Fakurian Design",
      width: 1920,
      height: 1080,
    },
  },
};

// Helper functions
export const getRandomHeroImage = (): UnsplashImage => {
  const heroes = unsplashImages.heroes;
  return heroes[Math.floor(Math.random() * heroes.length)] as UnsplashImage;
};

export const getRandomProfileImage = (): UnsplashImage => {
  const profiles = unsplashImages.profiles;
  return profiles[Math.floor(Math.random() * profiles.length)] as UnsplashImage;
};

export const getCategoryImage = (category: string): UnsplashImage | null => {
  const categoryKey = category.toLowerCase().replace(/\s+/g, "-");
  return (
    unsplashImages.categories[
      categoryKey as keyof typeof unsplashImages.categories
    ] || null
  );
};

export const getRandomCauseImage = (category?: string): UnsplashImage => {
  const causes = unsplashImages.causes;
  return causes[Math.floor(Math.random() * causes.length)] as UnsplashImage;
};

export const buildUnsplashUrl = (
  imageId: string,
  width: number = 800,
  height: number = 600,
  quality: number = 80,
): string => {
  return `https://images.unsplash.com/${imageId}?w=${width}&h=${height}&fit=crop&crop=center&q=${quality}&auto=format`;
};

// Optimized image loading with blur placeholders
export const getImageWithPlaceholder = (image: UnsplashImage) => {
  return {
    ...image,
    placeholder: `${image.url}&w=20&h=20&q=10&blur=50`,
    srcSet: [
      `${image.url}&w=400 400w`,
      `${image.url}&w=800 800w`,
      `${image.url}&w=1200 1200w`,
      `${image.url}&w=1920 1920w`,
    ].join(", "),
  };
};
