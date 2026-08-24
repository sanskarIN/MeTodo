// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

# Complete File Structure & Documentation

## Project Overview

MeTodo is a comprehensive, production-ready task management mobile application built with React Native, Expo, and TypeScript. This document provides a complete overview of the project structure, all files, and their purposes.

## Directory Structure

```
metodo/
├── app/                          # Expo Router app directory
│   ├── _layout.tsx              # Root layout with providers
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── index.tsx            # Home screen
│   │   ├── tasks.tsx            # Tasks screen
│   │   ├── avatar.tsx           # Avatar creator screen
│   │   └── settings.tsx         # Settings screen
│   ├── create-task.tsx          # Create task modal
│   ├── task-detail.tsx          # Task detail screen
│   ├── theme-creator.tsx        # Theme creator screen
│   ├── dev-options.tsx          # Developer options screen
│   ├── image-showcase.tsx       # Image gallery screen
│   └── oauth/                   # OAuth callbacks
│
├── components/                   # Reusable components
│   ├── screen-container.tsx     # SafeArea wrapper
│   ├── themed-view.tsx          # Theme-aware view
│   ├── haptic-tab.tsx           # Haptic feedback tab
│   ├── image-gallery.tsx        # Image gallery component
│   ├── ui/                      # UI components
│   │   ├── icon-symbol.tsx      # Icon component
│   │   ├── icon-symbol.ios.tsx  # iOS-specific icons
│   │   └── collapsible.tsx      # Collapsible component
│   ├── external-link.tsx        # External link component
│   ├── hello-wave.tsx           # Wave animation
│   └── parallax-scroll-view.tsx # Parallax scroll
│
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts              # Authentication hook
│   ├── use-colors.ts            # Theme colors hook
│   ├── use-color-scheme.ts      # Dark/light mode hook
│   ├── use-color-scheme.web.ts  # Web-specific color scheme
│   ├── use-search.ts            # Search functionality hook
│   └── use-export-import.ts     # Export/import hook
│
├── lib/                          # Utility libraries and services
│   ├── utils.ts                 # Basic utilities (cn function)
│   ├── utils-extended.ts        # Extended utilities (50+ functions)
│   ├── trpc.ts                  # tRPC client configuration
│   ├── theme-provider.tsx       # Theme context provider
│   ├── task-context.tsx         # Task state context
│   ├── _core/                   # Core functionality
│   │   ├── api.ts               # API client setup
│   │   ├── auth.ts              # Authentication logic
│   │   ├── theme.ts             # Runtime theme builder
│   │   ├── nativewind-pressable.ts # NativeWind config
│   │   └── manus-runtime.ts     # Manus runtime integration
│   ├── notification-service.ts  # Push notifications
│   ├── analytics-service.ts     # Analytics tracking
│   ├── error-handler.ts         # Error handling & logging
│   ├── storage-utils.ts         # AsyncStorage utilities
│   ├── date-utils.ts            # Date/time utilities
│   ├── validation-utils.ts      # Input validation
│   ├── search-utils.ts          # Search & filtering
│   ├── export-import-service.ts # Export/import functionality
│   ├── task-template-service.ts # Task templates
│   └── formatting-utils.ts      # Text formatting utilities
│
├── types/                        # TypeScript type definitions
│   └── index.ts                 # All type definitions
│
├── constants/                    # App constants
│   ├── const.ts                 # General constants
│   ├── oauth.ts                 # OAuth constants
│   ├── theme.ts                 # Theme constants
│   └── images.ts                # Image asset constants
│
├── config/                       # Configuration files
│   └── app-config.ts            # App configuration
│
├── assets/                       # Static assets
│   └── images/                  # Image files
│       ├── icon.png             # App icon
│       ├── splash-icon.png      # Splash screen icon
│       ├── favicon.png          # Web favicon
│       ├── android-icon-*.png   # Android icons
│       └── react-logo*.png      # React logos
│
├── server/                       # Backend server
│   ├── _core/                   # Core server functionality
│   │   ├── index.ts             # Server entry point
│   │   ├── context.ts           # Request context
│   │   ├── cookies.ts           # Cookie management
│   │   ├── dataApi.ts           # Data API integration
│   │   ├── env.ts               # Environment variables
│   │   ├── heartbeat.ts         # Health check
│   │   ├── imageGeneration.ts   # Image generation
│   │   ├── llm.ts               # LLM integration
│   │   ├── notification.ts      # Notifications
│   │   ├── oauth.ts             # OAuth handling
│   │   ├── sdk.ts               # SDK integration
│   │   ├── storageProxy.ts      # Storage proxy
│   │   ├── systemRouter.ts      # System routes
│   │   ├── trpc.ts              # tRPC setup
│   │   ├── voiceTranscription.ts # Voice transcription
│   │   └── types/               # Server types
│   ├── db.ts                    # Database connection
│   ├── routers.ts               # API routers
│   ├── storage.ts               # Storage configuration
│   └── README.md                # Server documentation
│
├── drizzle/                      # Database migrations
│   ├── schema.ts                # Database schema
│   ├── relations.ts             # Database relations
│   └── migrations/              # Migration files
│
├── shared/                       # Shared code
│   ├── _core/                   # Core shared code
│   │   └── errors.ts            # Error definitions
│   ├── const.ts                 # Shared constants
│   └── types.ts                 # Shared types
│
├── tests/                        # Test files
│   └── auth.logout.test.ts      # Authentication tests
│
├── scripts/                      # Build scripts
│   ├── load-env.js              # Environment loader
│   ├── reset-project.js         # Project reset script
│   └── generate_qr.mjs          # QR code generator
│
├── docs/                         # Comprehensive documentation
│   ├── README.md                # Documentation index
│   ├── INDEX.md                 # Documentation navigation
│   ├── DOCUMENTATION_INDEX.md   # Extended documentation index
│   ├── QUICK_REFERENCE.md       # Quick reference guide
│   ├── GLOSSARY.md              # Terminology glossary
│   ├── RESOURCES.md             # External resources
│   ├── ROADMAP.md               # Project roadmap
│   ├── ENVIRONMENT_VARIABLES.md # Environment configuration
│   ├── BRANDING_AND_IMAGES.md   # Branding guidelines
│   ├── SECURITY_AND_PRIVACY.md  # Security policies
│   ├── LICENSE.md               # License information
│   ├── CHANGELOG.md             # Version history
│   ├── CONTRIBUTING.md          # Contribution guidelines
│   ├── COMMUNITY.md             # Community guidelines
│   ├── REPORT_ERROR.md          # Error reporting guide
│   ├── FEATURE_REQUEST.md       # Feature request guide
│   ├── FAQ_AND_TROUBLESHOOTING.md # FAQ & troubleshooting
│   │
│   ├── requirements/            # System requirements
│   │   └── SYSTEM_REQUIREMENTS.md
│   │
│   ├── how-to-run/              # Setup & installation guides
│   │   ├── DEVELOPMENT_SETUP.md
│   │   └── INSTALLATION_GUIDE.md
│   │
│   ├── make_executable-files/   # Build instructions
│   │   └── BUILD_GUIDE.md
│   │
│   ├── user-guides/             # User documentation
│   │   ├── TASK_CREATION_GUIDE.md
│   │   ├── AVATAR_CREATOR_USER_GUIDE.md
│   │   ├── THEMES_USER_GUIDE.md
│   │   ├── DEVELOPER_OPTIONS_GUIDE.md
│   │   └── SETTINGS_GUIDE.md
│   │
│   ├── developer-guides/        # Developer documentation
│   │   ├── DEVELOPMENT_SETUP_GUIDE.md
│   │   ├── PROJECT_STRUCTURE.md
│   │   ├── CODING_STANDARDS.md
│   │   ├── STATE_MANAGEMENT.md
│   │   ├── TESTING_GUIDE.md
│   │   ├── PERFORMANCE_OPTIMIZATION.md
│   │   ├── DEBUGGING_GUIDE.md
│   │   └── DEPLOYMENT_GUIDE.md
│   │
│   ├── advanced-features/       # Advanced feature guides
│   │   ├── ADVANCED_TASK_FEATURES.md
│   │   └── API_INTEGRATION_GUIDE.md
│   │
│   ├── technical/               # Technical documentation
│   │   ├── ARCHITECTURE.md
│   │   ├── COMPONENTS.md
│   │   ├── DATA_STORAGE.md
│   │   ├── TYPES.md
│   │   ├── API_DOCUMENTATION.md
│   │   └── COMPONENTS_SHOWCASE.md
│   │
│   ├── guides/                  # General guides
│   │   ├── GETTING_STARTED.md
│   │   ├── BEST_PRACTICES.md
│   │   └── MIGRATION_GUIDE.md
│   │
│   ├── troubleshooting/         # Troubleshooting
│   │   └── COMMON_ISSUES.md
│   │
│   ├── features/                # Feature documentation
│   │   ├── TASK_MANAGEMENT_DETAILED.md
│   │   ├── AVATAR_CREATOR_DETAILED.md
│   │   ├── THEMES_DETAILED.md
│   │   ├── DEVELOPER_OPTIONS_DETAILED.md
│   │   ├── task-management.md
│   │   ├── avatar-creator.md
│   │   ├── themes.md
│   │   └── developer-options.md
│   │
│   └── references/              # Reference documentation
│       └── (additional references)
│
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── .watchmanconfig              # Watchman configuration
├── .npmrc                        # NPM configuration
├── .project-config.json         # Project metadata
├── .manus-logs/                 # Development logs
│   └── devserver.log            # Dev server logs
│
├── app.config.ts                # Expo app configuration
├── babel.config.js              # Babel configuration
├── metro.config.js              # Metro bundler config
├── tailwind.config.js           # Tailwind CSS config
├── theme.config.js              # Theme configuration
├── theme.config.d.ts            # Theme type definitions
├── tsconfig.json                # TypeScript configuration
├── eslint.config.js             # ESLint configuration
├── drizzle.config.ts            # Drizzle ORM config
├── global.css                   # Global styles
├── nativewind-env.d.ts          # NativeWind types
├── expo-env.d.ts                # Expo types
│
├── package.json                 # Project dependencies
├── pnpm-lock.yaml               # Dependency lock file
├── todo.md                       # Project TODO list
├── next.md                       # Future roadmap
├── LOGO_AND_BRANDING.md         # Logo documentation
├── README_COMPLETE.md           # Complete README
├── LICENSE.md                   # Project license
├── CHANGELOG.md                 # Version history
└── template.json                # Project template
```

## Key Files & Their Purposes

### Core App Files

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root layout with theme provider and authentication |
| `app/(tabs)/_layout.tsx` | Tab navigation configuration |
| `app/(tabs)/index.tsx` | Home screen with task list |
| `app/(tabs)/settings.tsx` | Settings and customization |
| `app.config.ts` | Expo app configuration |

### Utility Libraries

| File | Purpose | Functions |
|------|---------|-----------|
| `lib/utils-extended.ts` | Extended utilities | 50+ helper functions |
| `lib/storage-utils.ts` | Storage management | AsyncStorage, cache, sessions |
| `lib/date-utils.ts` | Date/time handling | 30+ date functions |
| `lib/validation-utils.ts` | Input validation | 40+ validators |
| `lib/search-utils.ts` | Search & filtering | Full-text search, ranking |
| `lib/export-import-service.ts` | Data export/import | CSV, JSON, backup |
| `lib/task-template-service.ts` | Task templates | 6 preset templates |
| `lib/formatting-utils.ts` | Text formatting | 25+ formatters |

### Services

| File | Purpose |
|------|---------|
| `lib/notification-service.ts` | Push notifications & reminders |
| `lib/analytics-service.ts` | Productivity analytics |
| `lib/error-handler.ts` | Error handling & logging |

### Custom Hooks

| File | Purpose |
|------|---------|
| `hooks/use-search.ts` | Search functionality |
| `hooks/use-export-import.ts` | Export/import operations |
| `hooks/use-colors.ts` | Theme colors |
| `hooks/use-auth.ts` | Authentication |

### Configuration

| File | Purpose |
|------|---------|
| `config/app-config.ts` | App configuration (14 sections) |
| `constants/images.ts` | Image asset constants |
| `types/index.ts` | All TypeScript types |

### Documentation (50+ Files)

| Category | Files | Purpose |
|----------|-------|---------|
| User Guides | 5 files | How to use features |
| Developer Guides | 8 files | Development setup & standards |
| Technical | 6 files | Architecture & components |
| Features | 8 files | Detailed feature documentation |
| Requirements | 1 file | System requirements |
| Setup | 2 files | Installation & setup |
| Build | 1 file | Build instructions |
| Troubleshooting | 1 file | Common issues & solutions |
| Community | 3 files | Contribution & community |
| Advanced | 2 files | Advanced features |
| Guides | 3 files | General guides |

## File Statistics

- **Total Files:** 150+
- **TypeScript Files:** 50+
- **Documentation Files:** 50+
- **Configuration Files:** 15+
- **Component Files:** 20+
- **Service Files:** 8+
- **Hook Files:** 6+

## Development Workflow

1. **Start Development:** `npm run dev`
2. **Build App:** `npm run build`
3. **Run Tests:** `npm run test`
4. **Format Code:** `npm run format`
5. **Lint Code:** `npm run lint`

## Support

For questions or issues:

**Email:** supportramsandesh@gmail.com

**GitHub:** https://github.com/Sanskar-in/MeTodo

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
