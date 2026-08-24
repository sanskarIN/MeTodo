# MeTodo - Themes & Customization - Comprehensive Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This document provides comprehensive, in-depth documentation for the Themes and Customization feature of MeTodo. It covers all 50+ themes, custom theme creation, color customization, and personalization options.

---

## Table of Contents

1. [Overview](#overview)
2. [Theme System](#theme-system)
3. [Pre-Installed Themes](#pre-installed-themes)
4. [Custom Theme Creator](#custom-theme-creator)
5. [Color Customization](#color-customization)
6. [Theme Management](#theme-management)
7. [Dark Mode](#dark-mode)
8. [Theme Application](#theme-application)
9. [Advanced Customization](#advanced-customization)
10. [Theme Sharing](#theme-sharing)
11. [Troubleshooting](#troubleshooting)

---

## Overview

### What are Themes?

Themes are pre-designed color schemes and visual styles that change the appearance of the MeTodo app.

**Theme Features:**
- 50+ pre-installed themes
- Custom theme creator
- Light and dark modes
- Color customization
- Real-time preview
- Save and reuse
- Easy switching

### Why Use Themes?

**Benefits:**
- **Personalization** - Make app match your style
- **Accessibility** - Choose colors that work for you
- **Mood** - Match your emotional state
- **Productivity** - Optimize for focus
- **Eye Comfort** - Reduce eye strain
- **Branding** - Match personal brand

### Theme Components

Each theme consists of:
1. **Primary Color** - Main accent color
2. **Secondary Color** - Supporting accent
3. **Background Color** - Main background
4. **Surface Color** - Card/elevated surfaces
5. **Text Color** - Primary text
6. **Muted Text Color** - Secondary text
7. **Border Color** - Dividers and borders
8. **Success Color** - Success states
9. **Warning Color** - Warning states
10. **Error Color** - Error states

---

## Theme System

### Theme Data Structure

```typescript
interface Theme {
  // Identifiers
  id: string;                    // Unique theme ID
  name: string;                  // Theme name
  category: ThemeCategory;       // Theme category
  
  // Colors
  colors: {
    primary: string;             // Primary color (hex)
    secondary: string;           // Secondary color (hex)
    background: string;          // Background color (hex)
    surface: string;             // Surface color (hex)
    foreground: string;          // Text color (hex)
    muted: string;               // Muted text color (hex)
    border: string;              // Border color (hex)
    success: string;             // Success color (hex)
    warning: string;             // Warning color (hex)
    error: string;               // Error color (hex)
  };
  
  // Properties
  isDark: boolean;               // Is dark theme
  isCustom: boolean;             // Is custom theme
  
  // Metadata
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last modification
  description?: string;          // Theme description
  author?: string;               // Theme creator
}

type ThemeCategory = 'default' | 'dark' | 'colorful' | 'minimal' | 'custom';
```

### Theme Categories

**1. Default Themes**
- Light theme
- Dark theme
- High contrast
- System theme

**2. Dark Themes**
- AMOLED Dark
- Deep Dark
- Charcoal
- Midnight
- Carbon

**3. Colorful Themes**
- Rainbow
- Pastel
- Neon
- Vibrant
- Gradient

**4. Minimal Themes**
- Minimalist
- Monochrome
- Grayscale
- Neutral
- Zen

**5. Custom Themes**
- User-created themes
- Saved combinations
- Personal preferences

---

## Pre-Installed Themes

### Complete Theme List (50+ Themes)

#### Default Themes (4)

**1. Light**
- Primary: #0a7ea4
- Background: #ffffff
- Surface: #f5f5f5
- Foreground: #11181c
- Muted: #687076
- Best For: Daytime, bright environments

**2. Dark**
- Primary: #0a7ea4
- Background: #151718
- Surface: #1e2022
- Foreground: #ecedee
- Muted: #9ba1a6
- Best For: Nighttime, reduced eye strain

**3. High Contrast**
- Primary: #0000ff
- Background: #ffffff
- Surface: #f0f0f0
- Foreground: #000000
- Muted: #666666
- Best For: Accessibility, visibility

**4. System**
- Follows device settings
- Auto light/dark
- Adapts to system
- Best For: Consistency

#### Dark Themes (8)

**5. AMOLED Dark**
- Primary: #00bfff
- Background: #000000
- Surface: #0a0a0a
- Foreground: #ffffff
- Muted: #b0b0b0
- Best For: OLED screens, battery saving

**6. Deep Dark**
- Primary: #6366f1
- Background: #0f0f0f
- Surface: #1a1a1a
- Foreground: #f5f5f5
- Muted: #a0a0a0
- Best For: Low light, eye comfort

**7. Charcoal**
- Primary: #ff6b6b
- Background: #2a2a2a
- Surface: #3a3a3a
- Foreground: #e0e0e0
- Muted: #999999
- Best For: Professional, neutral

**8. Midnight**
- Primary: #00d4ff
- Background: #0d1117
- Surface: #161b22
- Foreground: #c9d1d9
- Muted: #8b949e
- Best For: GitHub-inspired, tech

**9. Carbon**
- Primary: #58a6ff
- Background: #0d1117
- Surface: #161b22
- Foreground: #e6edf3
- Muted: #8b949e
- Best For: Professional, sleek

**10. Obsidian**
- Primary: #a78bfa
- Background: #1a1a2e
- Surface: #16213e
- Foreground: #eaeaea
- Muted: #999999
- Best For: Gaming, immersive

**11. Twilight**
- Primary: #f472b6
- Background: #1f1f3d
- Surface: #2a2a4a
- Foreground: #f0f0f0
- Muted: #b0b0b0
- Best For: Evening, calming

**12. Void**
- Primary: #ec4899
- Background: #0a0e27
- Surface: #1a1f3a
- Foreground: #f5f5f5
- Muted: #a0a0a0
- Best For: Minimalist, dark

#### Colorful Themes (15)

**13. Ocean**
- Primary: #0ea5e9
- Secondary: #06b6d4
- Background: #f0f9ff
- Surface: #e0f2fe
- Foreground: #0c4a6e
- Best For: Calming, water-inspired

**14. Sunset**
- Primary: #f97316
- Secondary: #ec4899
- Background: #fef2f2
- Surface: #fee2e2
- Foreground: #7c2d12
- Best For: Warm, energetic

**15. Forest**
- Primary: #16a34a
- Secondary: #65a30d
- Background: #f0fdf4
- Surface: #dcfce7
- Foreground: #166534
- Best For: Nature-inspired, fresh

**16. Lavender**
- Primary: #a855f7
- Secondary: #d946ef
- Background: #faf5ff
- Surface: #f3e8ff
- Foreground: #6b21a8
- Best For: Calm, creative

**17. Mint**
- Primary: #14b8a6
- Secondary: #06b6d4
- Background: #f0fdfa
- Surface: #ccfbf1
- Foreground: #134e4a
- Best For: Fresh, modern

**18. Coral**
- Primary: #ff6b6b
- Secondary: #ff8787
- Background: #ffe0e0
- Surface: #ffc9c9
- Foreground: #c92a2a
- Best For: Vibrant, playful

**19. Cyberpunk**
- Primary: #ff006e
- Secondary: #00f5ff
- Background: #0a0e27
- Surface: #1a1f3a
- Foreground: #00f5ff
- Best For: Tech, futuristic

**20. Neon**
- Primary: #39ff14
- Secondary: #ff10f0
- Background: #0a0a0a
- Surface: #1a1a1a
- Foreground: #ffffff
- Best For: Bold, eye-catching

**21. Pastel**
- Primary: #ffc0cb
- Secondary: #ffb6c1
- Background: #fff0f5
- Surface: #ffe4e1
- Foreground: #c71585
- Best For: Soft, gentle

**22. Rainbow**
- Primary: #ff0000
- Secondary: #00ff00
- Background: #ffffff
- Surface: #f5f5f5
- Foreground: #000000
- Best For: Playful, colorful

**23. Gradient Purple**
- Primary: #9333ea
- Secondary: #a855f7
- Background: #faf5ff
- Surface: #f3e8ff
- Foreground: #581c87
- Best For: Creative, modern

**24. Gradient Blue**
- Primary: #3b82f6
- Secondary: #0ea5e9
- Background: #f0f9ff
- Surface: #e0f2fe
- Foreground: #1e40af
- Best For: Professional, calm

**25. Gradient Green**
- Primary: #22c55e
- Secondary: #16a34a
- Background: #f0fdf4
- Surface: #dcfce7
- Foreground: #166534
- Best For: Growth, positive

**26. Gradient Pink**
- Primary: #ec4899
- Secondary: #f472b6
- Background: #fce7f3
- Surface: #fbcfe8
- Foreground: #be185d
- Best For: Fun, energetic

**27. Gradient Orange**
- Primary: #f97316
- Secondary: #fb923c
- Background: #fff7ed
- Surface: #fed7aa
- Foreground: #92400e
- Best For: Warm, inviting

#### Minimal Themes (12)

**28. Minimalist**
- Primary: #000000
- Background: #ffffff
- Surface: #f9f9f9
- Foreground: #000000
- Muted: #666666
- Best For: Clean, simple

**29. Monochrome**
- Primary: #333333
- Background: #ffffff
- Surface: #f5f5f5
- Foreground: #333333
- Muted: #999999
- Best For: Professional, neutral

**30. Grayscale**
- Primary: #4a4a4a
- Background: #ffffff
- Surface: #f0f0f0
- Foreground: #2a2a2a
- Muted: #808080
- Best For: Focus, distraction-free

**31. Neutral**
- Primary: #6b7280
- Background: #f9fafb
- Surface: #f3f4f6
- Foreground: #1f2937
- Muted: #9ca3af
- Best For: Balanced, calm

**32. Zen**
- Primary: #78716c
- Background: #faf8f3
- Surface: #f5f3ee
- Foreground: #44403c
- Muted: #a8a29e
- Best For: Peaceful, meditative

**33. Ink**
- Primary: #1f2937
- Background: #ffffff
- Surface: #f3f4f6
- Foreground: #111827
- Muted: #6b7280
- Best For: Writing, focus

**34. Paper**
- Primary: #92400e
- Background: #fffbeb
- Surface: #fef3c7
- Foreground: #78350f
- Muted: #b45309
- Best For: Warm, paper-like

**35. Slate**
- Primary: #475569
- Background: #f8fafc
- Surface: #f1f5f9
- Foreground: #1e293b
- Muted: #64748b
- Best For: Professional, cool

**36. Stone**
- Primary: #57534e
- Background: #fafaf9
- Surface: #f5f5f4
- Foreground: #292524
- Muted: #a8a29e
- Best For: Natural, earthy

**37. Zinc**
- Primary: #52525b
- Background: #fafafa
- Surface: #f4f4f5
- Foreground: #18181b
- Muted: #a1a1aa
- Best For: Neutral, balanced

**38. Warm Gray**
- Primary: #78716c
- Background: #faf8f3
- Surface: #f5f3ee
- Foreground: #44403c
- Muted: #a8a29e
- Best For: Warm, inviting

**39. Cool Gray**
- Primary: #6b7280
- Background: #f9fafb
- Surface: #f3f4f6
- Foreground: #1f2937
- Muted: #9ca3af
- Best For: Cool, professional

#### Special Themes (11)

**40. Retro**
- Primary: #ff6b35
- Secondary: #f7931e
- Background: #fffacd
- Surface: #ffecb3
- Foreground: #8b4513
- Best For: Vintage, nostalgic

**41. Synthwave**
- Primary: #ff006e
- Secondary: #00f5ff
- Background: #0a0a1a
- Surface: #1a1a2a
- Foreground: #00f5ff
- Best For: 80s, retro-futuristic

**42. Vaporwave**
- Primary: #ff10f0
- Secondary: #00ffff
- Background: #ffc0cb
- Surface: #ffb6c1
- Foreground: #ff1493
- Best For: Aesthetic, dreamy

**43. Cottagecore**
- Primary: #8b4513
- Secondary: #daa520
- Background: #fef5e7
- Surface: #fdebd0
- Foreground: #5d4e37
- Best For: Rustic, cozy

**44. Cyberpunk 2077**
- Primary: #ffff00
- Secondary: #ff00ff
- Background: #0a0a0a
- Surface: #1a1a1a
- Foreground: #00ff00
- Best For: Gaming, futuristic

**45. Steampunk**
- Primary: #8b4513
- Secondary: #daa520
- Background: #2f1f0f
- Surface: #3f2f1f
- Foreground: #daa520
- Best For: Industrial, vintage

**46. Cyberpunk Neon**
- Primary: #00ff00
- Secondary: #ff00ff
- Background: #000000
- Surface: #0a0a0a
- Foreground: #00ff00
- Best For: Intense, bold

**47. Matrix**
- Primary: #00ff00
- Secondary: #00aa00
- Background: #000000
- Surface: #0a0a0a
- Foreground: #00ff00
- Best For: Hacker, tech

**48. Terminal**
- Primary: #00ff00
- Secondary: #ffff00
- Background: #000000
- Surface: #0a0a0a
- Foreground: #00ff00
- Best For: Developer, retro

**49. Hacker**
- Primary: #00ff00
- Secondary: #ff0000
- Background: #0a0a0a
- Surface: #1a1a1a
- Foreground: #00ff00
- Best For: Intense, focused

**50. Cyberpunk Pink**
- Primary: #ff006e
- Secondary: #00f5ff
- Background: #0a0a1a
- Surface: #1a1a2a
- Foreground: #ff006e
- Best For: Bold, modern

---

## Custom Theme Creator

### Creating Custom Themes

#### Method 1: From Settings

1. **Go to Settings** - Bottom tab
2. **Tap "Themes"** - Theme section
3. **Tap "Create Custom Theme"** - New theme button
4. **Enter Theme Name** - Give it a name
5. **Choose Colors** - See below
6. **Preview** - See changes in real-time
7. **Save Theme** - Theme created

#### Method 2: From Theme Selector

1. **Go to Settings** - Bottom tab
2. **Tap "Themes"** - Theme section
3. **Tap "+"** - New theme button
4. **Select "Create New"** - From menu
5. **Enter Theme Name** - Give it a name
6. **Choose Colors** - See below
7. **Save Theme** - Theme created

### Color Selection

#### Primary Color

**Purpose:** Main accent color used for buttons and highlights

**How to Select:**
1. Tap "Primary Color"
2. Color picker appears
3. Select color
4. Preview updates
5. Confirm selection

**Best Practices:**
- Choose vibrant color
- Ensure good contrast
- Consider accessibility
- Test with background

#### Secondary Color

**Purpose:** Supporting accent color

**How to Select:**
1. Tap "Secondary Color"
2. Color picker appears
3. Select color
4. Preview updates
5. Confirm selection

**Best Practices:**
- Complement primary color
- Different from primary
- Good contrast with background
- Harmonious combination

#### Background Color

**Purpose:** Main app background

**How to Select:**
1. Tap "Background Color"
2. Color picker appears
3. Select color
4. Preview updates
5. Confirm selection

**Best Practices:**
- Light for light themes
- Dark for dark themes
- Easy on eyes
- Good contrast with text

#### Surface Color

**Purpose:** Card and elevated surface color

**How to Select:**
1. Tap "Surface Color"
2. Color picker appears
3. Select color
4. Preview updates
5. Confirm selection

**Best Practices:**
- Slightly different from background
- Visible elevation
- Good contrast
- Harmonious with background

#### Text Colors

**Foreground Color (Primary Text):**
- Main text color
- High contrast with background
- Easy to read
- Typically dark or light

**Muted Color (Secondary Text):**
- Secondary text color
- Lower contrast
- Subtle appearance
- Typically gray

#### Accent Colors

**Success Color:**
- Used for success states
- Typically green
- Clear and visible

**Warning Color:**
- Used for warnings
- Typically orange/yellow
- Clear and visible

**Error Color:**
- Used for errors
- Typically red
- Clear and visible

### Color Picker Interface

**Color Picker Controls:**

```
┌─────────────────────────────┐
│  Color Picker               │
├─────────────────────────────┤
│  [Hue Slider]               │
│  [Saturation Slider]        │
│  [Brightness Slider]        │
│  [Hex Input: #RRGGBB]       │
│  [RGB Input: R G B]         │
│  [Preview]                  │
└─────────────────────────────┘
```

**Using Color Picker:**
1. Adjust hue slider - Select color family
2. Adjust saturation - Intensity of color
3. Adjust brightness - Light or dark
4. Or enter hex code directly
5. Or enter RGB values
6. Preview updates in real-time
7. Confirm when satisfied

### Theme Preview

**Real-Time Preview:**
- See theme applied to app
- All colors visible
- Interactive preview
- Zoom and scroll

**Preview Features:**
- Full app preview
- Component preview
- Color palette view
- Contrast checker

### Saving Custom Themes

#### Save Theme

1. **Customize Colors** - Choose all colors
2. **Tap "Save Theme"** - Save button
3. **Enter Theme Name** - Give it a name
4. **Add Description** (Optional) - Describe theme
5. **Confirm** - Theme saved

#### Theme Name

**Guidelines:**
- Descriptive name
- Easy to remember
- Examples:
  - "My Blue Theme"
  - "Work Theme"
  - "Night Mode"
  - "Productivity"

#### Theme Description

**Optional Description:**
- Why you created it
- When to use it
- Special features
- Inspiration

---

## Color Customization

### Understanding Color Theory

**Color Harmony:**
- Complementary - Opposite colors
- Analogous - Adjacent colors
- Triadic - Three colors equally spaced
- Monochromatic - Shades of one color

**Color Psychology:**
- Red - Energy, passion, urgency
- Blue - Calm, trust, professional
- Green - Growth, nature, balance
- Yellow - Happiness, optimism, energy
- Purple - Creativity, luxury, wisdom
- Orange - Warmth, enthusiasm, fun

### Contrast and Accessibility

**Color Contrast:**
- WCAG AA: 4.5:1 ratio
- WCAG AAA: 7:1 ratio
- Check contrast in preview
- Ensure readability

**Accessibility Tips:**
- High contrast for readability
- Avoid color-only information
- Use patterns in addition to color
- Test with color blindness simulator

### Color Combinations

**Recommended Combinations:**

| Primary | Secondary | Background | Best For |
|---------|-----------|-----------|----------|
| #0a7ea4 | #06b6d4 | #ffffff | Professional |
| #ec4899 | #f472b6 | #fce7f3 | Creative |
| #22c55e | #16a34a | #f0fdf4 | Growth |
| #f97316 | #fb923c | #fff7ed | Warm |
| #a855f7 | #d946ef | #faf5ff | Creative |

### Color Adjustment Tools

**Lighten Color:**
1. Increase brightness slider
2. Or increase lightness in HSL
3. Makes color lighter
4. Reduces intensity

**Darken Color:**
1. Decrease brightness slider
2. Or decrease lightness in HSL
3. Makes color darker
4. Increases intensity

**Saturate Color:**
1. Increase saturation slider
2. Makes color more vibrant
3. More intense appearance
4. More eye-catching

**Desaturate Color:**
1. Decrease saturation slider
2. Makes color more muted
3. Less intense appearance
4. More subtle

---

## Theme Management

### Viewing All Themes

**Theme List:**
1. Go to Settings - Bottom tab
2. Tap "Themes" - Theme section
3. All themes displayed
4. Tap to preview
5. Tap to apply

**Theme Organization:**
- Grouped by category
- Search functionality
- Favorites section
- Recently used

### Applying Themes

#### Method 1: From Theme List

1. Go to Settings - Bottom tab
2. Tap "Themes" - Theme section
3. Find theme to apply
4. Tap theme
5. Preview appears
6. Tap "Apply"
7. Theme applied immediately

#### Method 2: Quick Theme Switcher

1. Go to Settings - Bottom tab
2. Tap "Quick Theme" - Quick access
3. Select from favorites
4. Theme applied immediately

#### Method 3: Theme Shortcut

1. Create shortcut to theme
2. Quick access from home
3. One-tap theme switching
4. Useful for frequently used themes

### Editing Custom Themes

**Modify Custom Theme:**
1. Go to Settings - Bottom tab
2. Tap "Themes" - Theme section
3. Find custom theme
4. Tap "Edit"
5. Modify colors
6. Save changes
7. Theme updated

### Deleting Custom Themes

**Remove Custom Theme:**
1. Go to Settings - Bottom tab
2. Tap "Themes" - Theme section
3. Find custom theme
4. Swipe left
5. Tap "Delete"
6. Confirm deletion
7. Theme removed

**Note:** Cannot delete pre-installed themes.

### Duplicating Themes

**Create Copy of Theme:**
1. Go to Settings - Bottom tab
2. Tap "Themes" - Theme section
3. Find theme to duplicate
4. Tap "Duplicate"
5. New custom theme created
6. Modify as needed
7. Save with new name

### Favorite Themes

**Mark as Favorite:**
1. Go to Settings - Bottom tab
2. Tap "Themes" - Theme section
3. Find theme
4. Tap heart icon
5. Theme marked as favorite
6. Appears in favorites section

**Quick Access:**
1. Favorites appear at top
2. Easy to find and apply
3. Quick switching
4. Organize frequently used

### Importing Themes

**Import Theme File:**
1. Go to Settings - Bottom tab
2. Tap "Themes" - Theme section
3. Tap "Import"
4. Select theme file
5. Theme imported
6. Added to custom themes
7. Can be edited

**Theme File Format:**
- JSON format
- Contains color definitions
- Can be shared
- Portable

### Exporting Themes

**Export Custom Theme:**
1. Go to Settings - Bottom tab
2. Tap "Themes" - Theme section
3. Find custom theme
4. Tap "Export"
5. Choose location
6. Theme file saved
7. Can be shared

---

## Dark Mode

### Understanding Dark Mode

Dark mode uses dark colors to reduce eye strain in low-light environments.

**Benefits:**
- Reduces eye strain
- Saves battery on OLED screens
- Improves readability in dark
- Reduces blue light exposure
- Professional appearance

### Dark Mode Options

#### System Dark Mode

**Follows Device Settings:**
1. Go to Settings - Bottom tab
2. Tap "Theme Mode"
3. Select "System"
4. App follows device setting
5. Auto switches light/dark

#### Always Dark

**Always Use Dark Theme:**
1. Go to Settings - Bottom tab
2. Tap "Theme Mode"
3. Select "Always Dark"
4. Dark theme always active
5. Regardless of time

#### Always Light

**Always Use Light Theme:**
1. Go to Settings - Bottom tab
2. Tap "Theme Mode"
3. Select "Always Light"
4. Light theme always active
5. Regardless of time

#### Scheduled Dark Mode

**Automatic Switching by Time:**
1. Go to Settings - Bottom tab
2. Tap "Theme Mode"
3. Select "Scheduled"
4. Set start time (e.g., 8 PM)
5. Set end time (e.g., 8 AM)
6. Dark mode active during times

### Dark Mode Customization

**Choose Dark Theme:**
1. Go to Settings - Bottom tab
2. Tap "Themes" - Theme section
3. Select dark theme
4. Apply theme
5. Used when dark mode active

**Create Custom Dark Theme:**
1. Follow custom theme creation
2. Use dark colors
3. High contrast for readability
4. Save as dark theme

---

## Theme Application

### How Themes Work

**Theme Application Process:**
1. Theme selected
2. Color variables updated
3. App re-renders with new colors
4. All screens updated
5. Changes applied immediately

**Affected Elements:**
- Background colors
- Text colors
- Button colors
- Border colors
- Accent colors
- Component colors

### Theme Persistence

**Theme Saved:**
1. Theme selection saved
2. Persists across sessions
3. Restored on app restart
4. Synced across devices (if enabled)

### Theme Switching

**Instant Switching:**
1. Select different theme
2. Applied immediately
3. No app restart needed
4. Smooth transition
5. All screens updated

### Theme Preview Before Applying

**Preview Theme:**
1. Go to Settings - Bottom tab
2. Tap "Themes" - Theme section
3. Tap theme to preview
4. Full preview appears
5. See all colors applied
6. Tap "Apply" to confirm
7. Or tap back to cancel

---

## Advanced Customization

### Advanced Color Options

**Color Modes:**
- RGB - Red, Green, Blue
- HSL - Hue, Saturation, Lightness
- HSV - Hue, Saturation, Value
- HEX - Hexadecimal code
- CMYK - Cyan, Magenta, Yellow, Black

**Color Spaces:**
- sRGB - Standard RGB
- Adobe RGB - Wider gamut
- Display P3 - Apple color space
- Lab - Perceptual color space

### Advanced Theme Features

**Theme Variants:**
- Light variant
- Dark variant
- High contrast variant
- Custom variants

**Theme Presets:**
- Save color combinations
- Quick apply
- Organize by use case
- Share presets

### Theme Scheduling

**Schedule Theme Changes:**
1. Go to Settings - Bottom tab
2. Tap "Theme Scheduling"
3. Add schedule rule
4. Select theme
5. Set time
6. Theme auto-applies at time

**Example Schedules:**
- 8 AM - Work theme
- 12 PM - Lunch theme
- 5 PM - Evening theme
- 8 PM - Night theme

### Theme Profiles

**Create Theme Profiles:**
1. Go to Settings - Bottom tab
2. Tap "Theme Profiles"
3. Create new profile
4. Select themes for different contexts
5. Save profile
6. Switch profiles as needed

**Profile Use Cases:**
- Work profile
- Personal profile
- Gaming profile
- Reading profile

---

## Theme Sharing

### Sharing Custom Themes

**Share Theme with Others:**
1. Go to Settings - Bottom tab
2. Tap "Themes" - Theme section
3. Find custom theme
4. Tap "Share"
5. Choose sharing method:
   - Email
   - Social media
   - Direct link
   - QR code
6. Share

### Theme Community

**Access Theme Community (Future Feature):**
1. Go to Settings - Bottom tab
2. Tap "Theme Community"
3. Browse shared themes
4. Download themes
5. Rate themes
6. Share your themes

### Theme Marketplace

**Theme Marketplace (Future Feature):**
1. Go to Settings - Bottom tab
2. Tap "Theme Marketplace"
3. Browse available themes
4. Purchase themes (if applicable)
5. Download and install
6. Use in app

---

## Troubleshooting

### Common Issues

#### Theme Not Applying

**Problem:** Theme selected but not applied

**Solutions:**
1. Restart app
2. Try applying again
3. Check device storage
4. Clear app cache
5. Reinstall app

#### Theme Colors Not Correct

**Problem:** Theme colors appear wrong

**Solutions:**
1. Check display settings
2. Adjust brightness
3. Check color profile
4. Try different theme
5. Update app

#### Custom Theme Not Saving

**Problem:** Custom theme not saved

**Solutions:**
1. Check device storage space
2. Restart app
3. Try saving again
4. Check for error messages
5. Clear app cache

#### Dark Mode Not Working

**Problem:** Dark mode not switching

**Solutions:**
1. Check dark mode settings
2. Verify system setting
3. Try manual switching
4. Restart app
5. Check device settings

#### Theme Switching Slow

**Problem:** Theme changes slowly

**Solutions:**
1. Close other apps
2. Restart app
3. Clear cache
4. Update app
5. Check device performance

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
