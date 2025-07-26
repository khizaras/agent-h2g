"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Skeleton } from "antd";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  sizes,
  priority = false,
  quality = 80,
  placeholder = "empty",
  blurDataURL,
  fallbackSrc = "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop&q=20&blur=50",
  onLoad,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
    setImgSrc(fallbackSrc);
    if (onError) onError();
  };

  if (loading && !error) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <Skeleton.Image
          active
          style={{
            width: fill ? "100%" : width,
            height: fill ? "100%" : height,
          }}
        />
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
}

// Pre-built blur placeholder for better loading experience
export const createBlurPlaceholder = (
  width: number = 20,
  height: number = 20,
) => {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>`,
  ).toString("base64")}`;
};
