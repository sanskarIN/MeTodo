# MeTodo - Logo & Branding Assets

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This file documents the location and usage of MeTodo logo and branding assets.

---

## Logo Files Location

### Local Assets (In App)

All logo and branding assets are stored in the `assets/images/` directory:

```
assets/images/
├── metodo-logo-main.png          # Main app logo (512x512px)
├── metodo-icon.png               # App icon for launcher (256x256px)
├── icon.png                       # Default app icon
├── splash-icon.png               # Splash screen icon
├── favicon.png                   # Web favicon
├── android-icon-foreground.png   # Android adaptive icon foreground
├── android-icon-background.png   # Android adaptive icon background
└── android-icon-monochrome.png   # Android adaptive icon monochrome
```

### Cloud URLs (For Reference)

The following URLs are configured in `app.config.ts` and `constants/images.ts`:

**Logo Assets:**
- Main Logo: `/manus-storage/metodo-logo-main_31adc223.png`
- App Icon: `/manus-storage/metodo-icon_a1a34a6e.png`

**Feature Images:**
- Task Management: `/manus-storage/metodo-feature-tasks_36440349.png`
- Avatar Creator: `/manus-storage/metodo-feature-avatar_e0e366ca.png`
- Themes: `/manus-storage/metodo-feature-themes_dd971af3.png`
- Developer Options: `/manus-storage/metodo-feature-developer_c34d5fbb.png`

**Icons:**
- Task Icon: `/manus-storage/metodo-icon-task_28eae538.png`
- Avatar Icon: `/manus-storage/metodo-icon-avatar_ea3735f9.png`
- Themes Icon: `/manus-storage/metodo-icon-themes_dc961362.png`

---

## Logo Specifications

### Main Logo

**File:** `metodo-logo-main.png`  
**Dimensions:** 512x512px  
**Format:** PNG with transparency  
**Color:** Teal to Blue gradient  
**Style:** Minimalist, modern checklist icon with checkmark  
**Usage:** App icon, branding materials, documentation

### App Icon

**File:** `metodo-icon.png`  
**Dimensions:** 256x256px  
**Format:** PNG with transparency  
**Color:** Teal to Blue gradient  
**Style:** Simplified checklist icon  
**Usage:** App launcher, quick reference

---

## How to Use Logos

### In App Configuration

The logos are referenced in `app.config.ts`:

```typescript
const env = {
  logoUrl: "/manus-storage/metodo-logo-main_31adc223.png",
  // ... other branding URLs
};
```

### In Components

Access logos using the image constants:

```tsx
import { LOGO_ASSETS } from '@/constants/images';

export function LogoDisplay() {
  return (
    <Image
      source={{ uri: LOGO_ASSETS.main }}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

### In Documentation

Reference logos in markdown:

```markdown
![MeTodo Logo](/manus-storage/metodo-logo-main_31adc223.png)
```

---

## Branding Guidelines

### Color Palette

**Primary Colors:**
- Teal: #0a7ea4
- Blue: #0066cc

**Logo Style:**
- Minimalist and modern
- Suitable for app stores
- Works on both light and dark backgrounds
- Includes subtle depth and shadows

### Logo Usage Rules

**Do's:**
- ✓ Use official logo files
- ✓ Maintain aspect ratio
- ✓ Ensure adequate spacing
- ✓ Use on contrasting backgrounds
- ✓ Keep color integrity

**Don'ts:**
- ✗ Stretch or distort logo
- ✗ Change colors without permission
- ✗ Use low-resolution versions
- ✗ Place on similar-colored backgrounds
- ✗ Rotate or flip logo

---

## Image Gallery Access

View all MeTodo logos and branding assets in the app:

1. Open MeTodo app
2. Navigate to Settings tab
3. Tap "🖼️ Image Gallery"
4. Browse "Logos & Branding" category
5. View all available logos and assets

---

## File Size Optimization

All logo files are optimized for:
- Fast loading
- Minimal storage usage
- High quality on all devices
- Offline availability

**Typical File Sizes:**
- Main Logo: ~2-3 MB (high resolution)
- App Icon: ~1-2 MB
- Feature Images: ~2-4 MB each
- Icon Assets: ~1-3 MB each

---

## Support & Questions

For questions about logo usage, branding guidelines, or custom assets:

**Email:** supportramsandesh@gmail.com

**GitHub:** https://github.com/Sanskar-in/MeTodo

**Documentation:** See `docs/BRANDING_AND_IMAGES.md` for comprehensive branding documentation

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Need help? Email us at supportramsandesh@gmail.com**
