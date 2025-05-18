# ImageKit Integration

This document provides information about the ImageKit integration in the Hands2gether application.

## Overview

Hands2gether now uses ImageKit as a cloud storage solution for handling images. This provides several benefits:

- Improved performance with optimized image delivery
- Automatic image transformations (resizing, cropping, etc.)
- CDN delivery for faster global access
- Reduced server storage requirements
- Better scalability

## How It Works

1. When a user uploads an image for a cause, it's temporarily stored on the server.
2. The image is then uploaded to ImageKit via their API.
3. After successful upload, the local temporary file is deleted.
4. The cause record in the database stores both the ImageKit URL and file ID.
5. Frontend components display images directly from ImageKit using the stored URL.

## Implementation Details

### Backend Components

- `imageKitService.js`: Utility for interacting with the ImageKit API
- `uploadMiddleware.js`: Middleware for handling file uploads
- `causeController.js`: Updated to use ImageKit URLs and manage images

### Database Changes

- Added `imageFileId` column to the `causes` table to store ImageKit file IDs
- Modified image paths to store full URLs instead of relative paths

### Migration Scripts

- `add_imageFileId_to_causes.js`: Adds the new column to the database
- `migrate_images_to_imagekit.js`: Migrates existing images to ImageKit

## Managing Images

### Uploading

Image uploading is handled automatically through the existing UI. When a user uploads an image, the system will:

1. Validate the image (size, type, etc.)
2. Upload to ImageKit
3. Store the URL and file ID in the database

### Deleting

When a cause is deleted or its image is updated, the old image is automatically removed from ImageKit to free up storage.

## Troubleshooting

If images aren't displaying properly:

1. Check that the ImageKit credentials are properly set in the `.env` file
2. Verify that the image URL in the database is a full ImageKit URL
3. Run the test script: `node backend/utils/testImageKit.js`
4. Check the server logs for any ImageKit-related errors

## Environment Variables

The following environment variables are required for ImageKit integration:

```
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_account
```
