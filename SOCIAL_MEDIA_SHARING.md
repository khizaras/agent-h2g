# Social Media Sharing Setup Guide

## Overview

The Hands2gether platform now includes comprehensive social media sharing capabilities for cause pages. When users share a cause URL (e.g., `http://localhost:3000/causes/3`), it will display rich preview cards with cause images, descriptions, and the H2G logo across all major platforms.

## Features Implemented

### ✅ Rich Preview Cards Support

- **WhatsApp**: Rich link previews with cause image, title, and description
- **Facebook**: Open Graph cards with optimized images and metadata
- **Twitter**: Twitter Cards with large images and proper formatting
- **LinkedIn**: Professional sharing cards with cause details
- **Telegram**: Rich message previews with images
- **Email**: Well-formatted email sharing
- **Copy Link**: One-click URL copying

### ✅ Meta Tags & SEO

- **Open Graph**: Full implementation for Facebook, WhatsApp, LinkedIn
- **Twitter Cards**: Optimized for Twitter sharing
- **JSON-LD**: Structured data for search engines
- **Dynamic Meta Tags**: Server-side generated metadata per cause
- **Image Optimization**: Proper image dimensions and formats

### ✅ Social Share Component

- **Dropdown Menu**: Quick access to all sharing options
- **Modal View**: Detailed sharing options with hashtag copying
- **Native Sharing**: Mobile-first approach with Web Share API
- **Copy to Clipboard**: Easy link sharing functionality

## Implementation Details

### Server-Side Metadata Generation

```typescript
// Location: src/app/causes/[id]/layout.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  // Dynamically generates meta tags for each cause
  // Includes Open Graph, Twitter Cards, and custom metadata
}
```

### Social Share Component

```typescript
// Location: src/components/ui/SocialShare.tsx
<SocialShare
  url="http://localhost:3000/causes/3"
  title="Cause Title"
  description="Cause description..."
  image="/path/to/cause/image.jpg"
  hashtags={['Hands2gether', 'Charity', 'Community']}
/>
```

### Integration in Cause Pages

```typescript
// Added to cause detail page action buttons
<SocialShare
  url={`${window.location.origin}/causes/${cause.id}`}
  title={cause.title}
  description={cause.short_description || cause.description.substring(0, 160) + '...'}
  image={cause.image}
  hashtags={['Hands2gether', 'Charity', 'Community', cause.category_display_name]}
/>
```

## Environment Variables

Add these to your `.env.local` file for enhanced functionality:

```bash
# Base URL for your application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Social Media App IDs (Optional)
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_TWITTER_SITE=@hands2gether

# Verification Codes (Optional)
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_google_verification_code
NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION=your_facebook_domain_verification
```

## Logo Assets Used

- **Primary Logo**: `/images/logo2.png` (used for all social media previews)
- **Fallback**: `/images/logo2.png` (when cause has no image)
- **Square Logo**: `/images/logo2.png` (for square format requirements)

## Testing Social Media Previews

### WhatsApp

1. Share cause URL in WhatsApp
2. Rich preview should show: cause image, title, supporter count, location
3. H2G logo appears as fallback if no cause image

### Facebook

1. Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter cause URL: `http://localhost:3000/causes/3`
3. Check Open Graph tags and preview image

### Twitter

1. Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter cause URL and validate card appearance
3. Verify "summary_large_image" card type

### LinkedIn

1. Share URL on LinkedIn
2. Rich preview should show cause details
3. Professional formatting with cause metadata

## Metadata Structure

### Open Graph Tags

```html
<meta property="og:type" content="website" />
<meta property="og:url" content="http://localhost:3000/causes/3" />
<meta property="og:title" content="Cause Title | Hands2gether" />
<meta
  property="og:description"
  content="Cause description | 15 supporters • Location"
/>
<meta
  property="og:image"
  content="http://localhost:3000/path/to/cause/image.jpg"
/>
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="Hands2gether" />
```

### Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@hands2gether" />
<meta name="twitter:title" content="Cause Title | Hands2gether" />
<meta name="twitter:description" content="Cause description..." />
<meta name="twitter:image" content="http://localhost:3000/path/to/image.jpg" />
```

### Custom Metadata

```html
<meta name="cause:id" content="3" />
<meta name="cause:category" content="food" />
<meta name="cause:location" content="New York, NY" />
<meta name="cause:supporters" content="15" />
```

## Performance Optimizations

### Image Optimization

- Uses Next.js Image component for optimal loading
- Proper width/height ratios for social media (1200x630 for large images)
- Fallback to H2G logo when cause image unavailable

### Metadata Caching

- Server-side metadata generation for faster sharing
- Database queries optimized for essential metadata only
- No client-side API calls for meta tag generation

### Mobile Optimization

- Web Share API integration for native mobile sharing
- Responsive modal design for share options
- Touch-friendly interface elements

## Usage Examples

### Basic Sharing

```typescript
import SocialShare from '@/components/ui/SocialShare';

<SocialShare
  url="http://localhost:3000/causes/3"
  title="Help Provide Meals for Local Families"
  description="Join us in supporting families in need with nutritious meals."
  image="/images/causes/food-cause.jpg"
/>
```

### With Custom Hashtags

```typescript
<SocialShare
  url="http://localhost:3000/causes/3"
  title="Education Support Program"
  description="Providing educational resources to underserved communities."
  hashtags={['Education', 'Community', 'Learning', 'Hands2gether']}
/>
```

## Troubleshooting

### Preview Not Showing

1. Verify `NEXT_PUBLIC_BASE_URL` is set correctly
2. Check if cause image URLs are accessible
3. Ensure `logo2.png` exists in `/public/images/`
4. Clear social media cache (Facebook debugger, etc.)

### Sharing Links Not Working

1. Check URL encoding in share links
2. Verify social media platform URL schemes
3. Test with different browsers and devices
4. Check console for JavaScript errors

### Image Issues

1. Ensure images are publicly accessible
2. Check image dimensions meet social media requirements
3. Verify image file formats (JPG, PNG supported)
4. Test fallback logo loading

## Future Enhancements

### Planned Features

- [ ] Instagram story sharing integration
- [ ] Pinterest pin creation
- [ ] Reddit post sharing
- [ ] Custom share image generation
- [ ] Analytics tracking for shared links
- [ ] A/B testing for share descriptions

### Technical Improvements

- [ ] Image CDN integration for faster loading
- [ ] Dynamic image generation for better previews
- [ ] Advanced OG tag customization per category
- [ ] Multilingual meta tag support
- [ ] Advanced analytics integration

## Support

For issues related to social media sharing:

1. Check browser console for errors
2. Verify environment variables are set
3. Test with social media debugger tools
4. Ensure database contains required cause fields

## Success Metrics

When successfully implemented, you should see:

- ✅ Rich previews in WhatsApp with cause image and H2G logo
- ✅ Facebook cards with proper Open Graph metadata
- ✅ Twitter cards with large images and descriptions
- ✅ LinkedIn professional sharing previews
- ✅ Proper fallback to H2G logo when cause has no image
- ✅ Mobile-native sharing experience on supported devices
