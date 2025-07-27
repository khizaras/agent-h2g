import { useState } from 'react';
import { message } from 'antd';

interface UploadedImage {
  fileId: string;
  url: string;
  thumbnailUrl?: string;
  name: string;
  size: number;
  localPreview?: string; // For immediate preview before upload
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [previewImages, setPreviewImages] = useState<UploadedImage[]>([]);

  const uploadImage = async (file: File): Promise<UploadedImage | null> => {
    if (uploadedImages.length + previewImages.length >= 5) {
      message.error('Maximum 5 images allowed');
      return null;
    }

    // Create immediate preview
    const localPreview = URL.createObjectURL(file);
    const tempImage: UploadedImage = {
      fileId: `temp-${Date.now()}`,
      url: localPreview,
      localPreview,
      name: file.name,
      size: file.size,
    };

    setPreviewImages(prev => [...prev, tempImage]);
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const uploadedImage = result.data;
        
        // Remove from preview and add to uploaded
        setPreviewImages(prev => prev.filter(img => img.fileId !== tempImage.fileId));
        setUploadedImages(prev => [...prev, uploadedImage]);
        
        // Clean up local preview URL
        URL.revokeObjectURL(localPreview);
        
        message.success(`${file.name} uploaded successfully!`);
        return uploadedImage;
      } else {
        // Remove failed preview
        setPreviewImages(prev => prev.filter(img => img.fileId !== tempImage.fileId));
        URL.revokeObjectURL(localPreview);
        
        message.error(result.error || 'Upload failed');
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Remove failed preview
      setPreviewImages(prev => prev.filter(img => img.fileId !== tempImage.fileId));
      URL.revokeObjectURL(localPreview);
      
      message.error('Upload failed. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (fileId: string) => {
    // Check if it's an uploaded image
    const uploadedImage = uploadedImages.find(img => img.fileId === fileId);
    if (uploadedImage) {
      setUploadedImages(prev => prev.filter(img => img.fileId !== fileId));
      return;
    }

    // Check if it's a preview image
    const previewImage = previewImages.find(img => img.fileId === fileId);
    if (previewImage) {
      setPreviewImages(prev => prev.filter(img => img.fileId !== fileId));
      if (previewImage.localPreview) {
        URL.revokeObjectURL(previewImage.localPreview);
      }
    }
  };

  const resetImages = () => {
    // Clean up local preview URLs
    previewImages.forEach(img => {
      if (img.localPreview) {
        URL.revokeObjectURL(img.localPreview);
      }
    });
    
    setUploadedImages([]);
    setPreviewImages([]);
  };

  // Combine uploaded and preview images for display
  const allImages = [...uploadedImages, ...previewImages];

  return {
    uploading,
    uploadedImages,
    previewImages,
    allImages,
    uploadImage,
    removeImage,
    resetImages,
  };
};