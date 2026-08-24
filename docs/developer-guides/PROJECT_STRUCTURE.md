# MeTodo - Project Structure & File Organization Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This comprehensive guide explains the complete project structure of MeTodo. It describes every directory, file, and its purpose, helping developers understand the codebase organization.

---

## Table of Contents

1. [Overview](#overview)
2. [Root Directory](#root-directory)
3. [App Directory](#app-directory)
4. [Components Directory](#components-directory)
5. [Hooks Directory](#hooks-directory)
6. [Lib Directory](#lib-directory)
7. [Types Directory](#types-directory)
8. [Docs Directory](#docs-directory)
9. [Assets Directory](#assets-directory)
10. [Configuration Files](#configuration-files)
11. [Best Practices](#best-practices)

---

## Overview

### Project Architecture

MeTodo uses a modular architecture with clear separation of concerns:

```
MeTodo/
├── app/                    # Expo Router screens
├── components/             # Reusable React components
├── docs/                   # Documentation
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and helpers
├── types/                  # TypeScript type definitions
├── assets/                 # Images, fonts, etc.
├── server/                 # Backend server code
├── tests/                  # Test files
└── Configuration files     # package.json, tsconfig.json, etc.
```

### Design Principles

**Modularity:**
- Each feature is self-contained
- Clear dependencies
- Easy to test
- Easy to reuse

**Scalability:**
- Easy to add features
- Easy to maintain
- Easy to extend
- Grows with project

**Maintainability:**
- Clear file organization
- Consistent naming
- Good documentation
- Easy to navigate

---

## Root Directory

### Root Files

**package.json**
- Project metadata
- Dependencies list
- Scripts configuration
- Version information

**tsconfig.json**
- TypeScript configuration
- Compiler options
- Path aliases
- Module resolution

**tailwind.config.js**
- Tailwind CSS configuration
- Theme customization
- Plugin configuration
- Utility extensions

**theme.config.js**
- Theme color definitions
- Color palette
- Light/dark mode colors
- Custom colors

**app.config.ts**
- Expo configuration
- App metadata
- Build settings
- Platform-specific config

**babel.config.js**
- Babel configuration
- Plugin configuration
- Preset configuration
- Transform options

**metro.config.js**
- Metro bundler configuration
- Module resolution
- Asset configuration
- Transform configuration

**eslint.config.js**
- ESLint configuration
- Code style rules
- Plugin configuration
- Parser options

**.env.example**
- Environment variable template
- Example configuration
- Required variables
- Optional variables

**.gitignore**
- Git ignore patterns
- Excluded files/directories
- Build artifacts
- Dependencies

### Root Directories

**node_modules/**
- Installed dependencies
- Third-party packages
- Package code
- Not committed to git

**.expo/**
- Expo configuration
- Device information
- Build cache
- Runtime data

**.git/**
- Git repository data
- Commit history
- Branches
- Tags

---

## App Directory

### Purpose

The `app/` directory contains all Expo Router screens and navigation structure.

### Structure

```
app/
├── _layout.tsx              # Root layout with providers
├── (tabs)/                  # Tab bar screens
│   ├── _layout.tsx         # Tab navigation layout
│   ├── index.tsx           # Home screen
│   ├── tasks.tsx           # Tasks screen
│   ├── avatar.tsx          # Avatar screen
│   └── settings.tsx        # Settings screen
├── create-task.tsx          # Create task modal
├── task-detail.tsx          # Task detail screen
├── theme-creator.tsx        # Theme creator screen
├── dev-options.tsx          # Developer options screen
└── oauth/                   # OAuth callbacks
    └── callback.tsx        # OAuth callback handler
```

### File Descriptions

**_layout.tsx (Root)**
- Root layout component
- Provides global context
- Sets up providers (Theme, Task, etc.)
- Handles navigation structure
- Wraps all screens

**_layout.tsx (Tabs)**
- Tab navigation layout
- Configures tab bar
- Defines tab screens
- Handles tab switching
- Manages tab state

**index.tsx (Home)**
- Home screen component
- Task list display
- Statistics display
- Quick actions
- Main entry point

**tasks.tsx**
- Tasks screen component
- Full task list
- Filtering options
- Sorting options
- Task management

**avatar.tsx**
- Avatar screen component
- Avatar list display
- Avatar creation
- Avatar selection
- Avatar management

**settings.tsx**
- Settings screen component
- All settings options
- Preferences management
- About information
- Support links

**create-task.tsx**
- Task creation modal
- Form fields
- Validation
- Submission handling
- Navigation

**task-detail.tsx**
- Task detail screen
- Task information display
- Edit functionality
- Subtasks display
- Notes display

**theme-creator.tsx**
- Theme creation screen
- Color pickers
- Theme preview
- Theme saving
- Theme management

**dev-options.tsx**
- Developer options screen
- Debugging tools
- Performance monitoring
- Data inspection
- System information

---

## Components Directory

### Purpose

The `components/` directory contains reusable React components used throughout the app.

### Structure

```
components/
├── screen-container.tsx     # SafeArea wrapper
├── themed-view.tsx          # Theme-aware view
├── haptic-tab.tsx           # Tab with haptics
├── hello-wave.tsx           # Wave animation
├── parallax-scroll-view.tsx # Parallax scrolling
├── external-link.tsx        # External link component
└── ui/                      # UI components
    ├── icon-symbol.tsx      # Icon component
    ├── collapsible.tsx      # Collapsible component
    └── [other UI components]
```

### Component Descriptions

**screen-container.tsx**
- SafeArea wrapper component
- Handles notch/home indicator
- Provides consistent padding
- Used on all screens
- Manages background color

**themed-view.tsx**
- Theme-aware view component
- Applies theme colors
- Handles dark mode
- Responsive styling
- Consistent appearance

**haptic-tab.tsx**
- Tab button with haptics
- Provides tactile feedback
- Haptic on press
- Customizable feedback
- Accessibility support

**icon-symbol.tsx**
- Icon component wrapper
- Maps SF Symbols to Material Icons
- Platform-specific icons
- Consistent icon usage
- Easy customization

**collapsible.tsx**
- Collapsible section component
- Expand/collapse functionality
- Smooth animations
- Content management
- State management

---

## Hooks Directory

### Purpose

The `hooks/` directory contains custom React hooks for common functionality.

### Structure

```
hooks/
├── use-colors.ts            # Theme colors hook
├── use-color-scheme.ts      # Color scheme detection
├── use-color-scheme.web.ts  # Web-specific implementation
└── use-auth.ts              # Authentication hook
```

### Hook Descriptions

**use-colors.ts**
- Returns current theme colors
- Handles dark/light mode
- Provides color palette
- Used throughout app
- Reactive to theme changes

**use-color-scheme.ts**
- Detects system color scheme
- Returns 'light' or 'dark'
- Reactive to system changes
- Platform-specific
- Used for theme detection

**use-auth.ts**
- Authentication state hook
- User information
- Login/logout functions
- Session management
- Auth status

---

## Lib Directory

### Purpose

The `lib/` directory contains utility functions, helpers, and core functionality.

### Structure

```
lib/
├── utils.ts                 # Utility functions (cn, etc.)
├── trpc.ts                  # tRPC client configuration
├── theme-provider.tsx       # Theme context provider
├── task-context.tsx         # Task state context
└── _core/                   # Core functionality
    ├── theme.ts            # Theme builder
    ├── auth.ts             # Authentication logic
    ├── api.ts              # API client
    ├── nativewind-pressable.ts  # NativeWind fixes
    └── [other core files]
```

### File Descriptions

**utils.ts**
- Utility functions
- `cn()` for class merging
- Helper functions
- Common utilities
- Reusable logic

**trpc.ts**
- tRPC client setup
- API client configuration
- Request configuration
- Error handling
- Type safety

**theme-provider.tsx**
- Theme context provider
- Theme state management
- Dark mode toggle
- Theme persistence
- Wraps app

**task-context.tsx**
- Task state management
- Task storage logic
- AsyncStorage integration
- Task operations
- State persistence

---

## Types Directory

### Purpose

The `types/` directory contains TypeScript type definitions and interfaces.

### Structure

```
types/
├── index.ts                 # Main types export
├── task.ts                  # Task types
├── avatar.ts                # Avatar types
├── theme.ts                 # Theme types
└── [other type files]
```

### Type Descriptions

**index.ts**
- Main types export
- Re-exports all types
- Central type location
- Easy importing
- Type organization

**task.ts**
- Task interface
- Task properties
- Task subtypes
- Task enums
- Task utilities

**avatar.ts**
- Avatar interface
- Avatar properties
- Avatar customization types
- Avatar enums
- Avatar utilities

**theme.ts**
- Theme interface
- Color definitions
- Theme properties
- Theme types
- Theme utilities

---

## Docs Directory

### Purpose

The `docs/` directory contains all project documentation.

### Structure

```
docs/
├── README.md                # Main documentation
├── INDEX.md                 # Documentation index
├── COMMUNITY.md             # Community guidelines
├── CONTRIBUTING.md          # Contributing guide
├── REPORT_ERROR.md          # Error reporting guide
├── FEATURE_REQUEST.md       # Feature request guide
├── FAQ_AND_TROUBLESHOOTING.md  # FAQ
├── SECURITY_AND_PRIVACY.md  # Security/privacy
├── LICENSE.md               # License
├── CHANGELOG.md             # Version history
├── user-guides/             # User documentation
│   ├── TASK_CREATION_GUIDE.md
│   ├── AVATAR_CREATOR_USER_GUIDE.md
│   ├── THEMES_USER_GUIDE.md
│   ├── DEVELOPER_OPTIONS_GUIDE.md
│   └── SETTINGS_GUIDE.md
├── developer-guides/        # Developer documentation
│   ├── DEVELOPMENT_SETUP_GUIDE.md
│   ├── PROJECT_STRUCTURE.md
│   ├── CODING_STANDARDS.md
│   └── [other dev guides]
├── technical/               # Technical documentation
│   ├── ARCHITECTURE.md
│   ├── COMPONENTS.md
│   ├── API_DOCUMENTATION.md
│   ├── DATA_STORAGE.md
│   └── TYPES.md
├── features/                # Feature documentation
│   ├── TASK_MANAGEMENT_DETAILED.md
│   ├── AVATAR_CREATOR_DETAILED.md
│   ├── THEMES_DETAILED.md
│   └── DEVELOPER_OPTIONS_DETAILED.md
├── requirements/            # System requirements
│   ├── SYSTEM_REQUIREMENTS.md
│   └── [other requirements]
├── how-to-run/              # Setup guides
│   ├── DEVELOPMENT_SETUP.md
│   ├── INSTALLATION_GUIDE.md
│   └── [other setup guides]
└── make_executable-files/   # Build guides
    ├── BUILD_GUIDE.md
    └── [other build guides]
```

---

## Assets Directory

### Purpose

The `assets/` directory contains images, fonts, and other static assets.

### Structure

```
assets/
└── images/                  # Image files
    ├── icon.png            # App icon
    ├── splash-icon.png     # Splash screen icon
    ├── favicon.png         # Web favicon
    ├── android-icon-foreground.png  # Android icon
    ├── android-icon-background.png
    ├── android-icon-monochrome.png
    ├── react-logo.png      # React logo
    ├── react-logo@2x.png   # Retina version
    ├── react-logo@3x.png   # High-res version
    └── partial-react-logo.png
```

### Asset Guidelines

**Images:**
- Use PNG format for icons
- Provide multiple resolutions (@2x, @3x)
- Optimize for size
- Use appropriate naming

**Icons:**
- Square format for app icons
- 1024x1024 minimum
- PNG format
- Transparent background

---

## Configuration Files

### Important Configuration Files

**package.json**
- Project metadata
- Dependencies
- Scripts
- Version

**tsconfig.json**
- TypeScript settings
- Path aliases
- Compiler options
- Module resolution

**tailwind.config.js**
- Tailwind configuration
- Theme customization
- Plugin configuration

**theme.config.js**
- Theme colors
- Color palette
- Light/dark modes

**app.config.ts**
- Expo configuration
- App metadata
- Build settings

**babel.config.js**
- Babel configuration
- Plugins
- Presets

**eslint.config.js**
- ESLint rules
- Code style
- Plugins

---

## Best Practices

### File Organization

**Do:**
- ✅ Keep files small and focused
- ✅ Use descriptive names
- ✅ Organize by feature
- ✅ Group related files
- ✅ Use consistent naming

**Don't:**
- ❌ Create deeply nested directories
- ❌ Mix concerns in one file
- ❌ Use vague names
- ❌ Disorganize files
- ❌ Ignore structure

### Naming Conventions

**Components:**
- PascalCase for components
- Example: `TaskCard.tsx`, `AvatarPreview.tsx`

**Hooks:**
- camelCase with 'use' prefix
- Example: `useColors.ts`, `useAuth.ts`

**Utilities:**
- camelCase for functions
- Example: `formatDate.ts`, `calculateStats.ts`

**Types:**
- PascalCase for types
- Example: `Task.ts`, `Avatar.ts`

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Need help? Email us at supportramsandesh@gmail.com**
