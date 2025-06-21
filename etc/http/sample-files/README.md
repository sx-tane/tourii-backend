# Sample Files for HTTP Testing

This directory should contain sample files for testing photo upload endpoints.

## Required Files for Photo Upload Testing

Place the following sample files in this directory:

### Valid Image Files
- `temple-photo.jpg` - Sample temple/location photo (JPEG format)
- `location-photo.png` - Sample location photo (PNG format)  
- `tourist-spot.webp` - Sample tourist spot photo (WebP format)
- `high-resolution.jpg` - Large high-resolution image for testing limits
- `test.jpg` - Generic test image

### Invalid Files (for error testing)
- `document.pdf` - PDF file (should be rejected)
- `animation.gif` - GIF file (should be rejected)
- `oversized-image.jpg` - File larger than 10MB (should be rejected)

## Usage in HTTP Files

The photo upload HTTP files reference these samples using relative paths:
```
< ./sample-files/temple-photo.jpg
```

## File Requirements

- **Supported formats**: JPEG, PNG, WebP only
- **Maximum size**: 10MB per file
- **Minimum resolution**: No specific limit, but should be actual photos

## Creating Test Files

You can create test files using:
1. Download sample images from free stock photo sites
2. Use image editing tools to create files of specific sizes
3. Convert between formats for testing different mime types
4. Create oversized files by duplicating/enlarging existing images

## Security Note

Do not commit actual photos or sensitive images to version control. Use generic, safe-for-public test images only.