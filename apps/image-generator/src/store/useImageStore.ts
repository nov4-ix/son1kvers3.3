import { create } from 'zustand';
import { GeneratedImage, ImageGenerationRequest, ImageGallery, ImageStyle, ImageQuality, AspectRatio } from '../types/imageGenerator';

interface ImageState {
  // Generated Images
  generatedImages: GeneratedImage[];
  selectedImageId: string | null;
  
  // Generation State
  isGenerating: boolean;
  generationProgress: number;
  currentGenerationId: string | null;
  
  // Galleries
  galleries: ImageGallery[];
  selectedGalleryId: string | null;
  
  // UI State
  activeView: 'generate' | 'gallery' | 'history';
  sidebarOpen: boolean;
  
  // Actions
  generateImage: (request: ImageGenerationRequest) => Promise<void>;
  setSelectedImage: (imageId: string | null) => void;
  deleteImage: (imageId: string) => void;
  downloadImage: (imageId: string) => void;
  
  createGallery: (name: string, description: string) => void;
  addImageToGallery: (galleryId: string, imageId: string) => void;
  removeImageFromGallery: (galleryId: string, imageId: string) => void;
  deleteGallery: (galleryId: string) => void;
  
  setActiveView: (view: 'generate' | 'gallery' | 'history') => void;
  toggleSidebar: () => void;
  
  // Utility
  getImageById: (imageId: string) => GeneratedImage | undefined;
  getGalleryById: (galleryId: string) => ImageGallery | undefined;
}

export const useImageStore = create<ImageState>((set, get) => ({
  // Initial state
  generatedImages: [],
  selectedImageId: null,
  
  isGenerating: false,
  generationProgress: 0,
  currentGenerationId: null,
  
  galleries: [],
  selectedGalleryId: null,
  
  activeView: 'generate',
  sidebarOpen: true,
  
  // Actions
  generateImage: async (request: ImageGenerationRequest) => {
    const generationId = `gen_${Date.now()}`;
    
    set({
      isGenerating: true,
      generationProgress: 0,
      currentGenerationId: generationId
    });
    
    try {
      // Simulate Flux API call with progress updates
      const progressInterval = setInterval(() => {
        set((state) => ({
          generationProgress: Math.min(state.generationProgress + Math.random() * 20, 90)
        }));
      }, 500);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      
      // Create generated image
      const generatedImage: GeneratedImage = {
        id: `img_${Date.now()}`,
        prompt: request.prompt,
        imageUrl: `https://picsum.photos/1024/1024?random=${Date.now()}`, // Placeholder
        thumbnailUrl: `https://picsum.photos/256/256?random=${Date.now()}`, // Placeholder
        style: request.style,
        quality: request.quality,
        aspectRatio: request.aspectRatio,
        createdAt: new Date().toISOString(),
        seed: request.seed || Math.floor(Math.random() * 1000000),
        metadata: {
          width: 1024,
          height: 1024,
          fileSize: Math.floor(Math.random() * 2000000) + 500000,
          generationTime: 3000,
          model: 'dimensional-renderer',
          version: '1.0.0'
        }
      };
      
      set((state) => ({
        generatedImages: [generatedImage, ...state.generatedImages],
        selectedImageId: generatedImage.id,
        isGenerating: false,
        generationProgress: 100,
        currentGenerationId: null
      }));
      
      // Reset progress after a delay
      setTimeout(() => {
        set({ generationProgress: 0 });
      }, 1000);
      
    } catch (error) {
      console.error('Error generating image:', error);
      set({
        isGenerating: false,
        generationProgress: 0,
        currentGenerationId: null
      });
    }
  },
  
  setSelectedImage: (imageId: string | null) => {
    set({ selectedImageId: imageId });
  },
  
  deleteImage: (imageId: string) => {
    set((state) => ({
      generatedImages: state.generatedImages.filter(img => img.id !== imageId),
      selectedImageId: state.selectedImageId === imageId ? null : state.selectedImageId,
      galleries: state.galleries.map(gallery => ({
        ...gallery,
        images: gallery.images.filter(img => img.id !== imageId)
      }))
    }));
  },
  
  downloadImage: (imageId: string) => {
    const image = get().getImageById(imageId);
    if (image) {
      const link = document.createElement('a');
      link.href = image.imageUrl;
      link.download = `son1kverse_${image.id}.jpg`;
      link.click();
    }
  },
  
  createGallery: (name: string, description: string) => {
    const gallery: ImageGallery = {
      id: `gallery_${Date.now()}`,
      name,
      description,
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
      tags: []
    };
    
    set((state) => ({
      galleries: [...state.galleries, gallery],
      selectedGalleryId: gallery.id
    }));
  },
  
  addImageToGallery: (galleryId: string, imageId: string) => {
    const image = get().getImageById(imageId);
    if (image) {
      set((state) => ({
        galleries: state.galleries.map(gallery =>
          gallery.id === galleryId
            ? {
                ...gallery,
                images: [...gallery.images, image],
                updatedAt: new Date().toISOString()
              }
            : gallery
        )
      }));
    }
  },
  
  removeImageFromGallery: (galleryId: string, imageId: string) => {
    set((state) => ({
      galleries: state.galleries.map(gallery =>
        gallery.id === galleryId
          ? {
              ...gallery,
              images: gallery.images.filter(img => img.id !== imageId),
              updatedAt: new Date().toISOString()
            }
          : gallery
      )
    }));
  },
  
  deleteGallery: (galleryId: string) => {
    set((state) => ({
      galleries: state.galleries.filter(gallery => gallery.id !== galleryId),
      selectedGalleryId: state.selectedGalleryId === galleryId ? null : state.selectedGalleryId
    }));
  },
  
  setActiveView: (view: 'generate' | 'gallery' | 'history') => {
    set({ activeView: view });
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  
  // Utility
  getImageById: (imageId: string) => {
    return get().generatedImages.find(img => img.id === imageId);
  },
  
  getGalleryById: (galleryId: string) => {
    return get().galleries.find(gallery => gallery.id === galleryId);
  }
}));