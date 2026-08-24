# MeTodo - Complete Task Management Mobile Application

## Overview

**MeTodo** is a comprehensive, production-ready mobile task management application built with React Native, Expo, and TypeScript. It provides a complete solution for personal task management with offline-first architecture, 50+ themes, advanced features, and extensive documentation.

**Support Email:** supportramsandesh@gmail.com  
**Buy Me a Coffee:** [buymeacoffee.com/sanskarIN](https://www.buymeacoffee.com/sanskarIN)

## Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Getting Started](#getting-started)
5. [Architecture](#architecture)
6. [Features in Detail](#features-in-detail)
7. [Themes](#themes)
8. [Developer Options](#developer-options)
9. [Services and Utilities](#services-and-utilities)
10. [Documentation](#documentation)
11. [Contributing](#contributing)
12. [License](#license)
13. [Comprehensive Audit Report](#comprehensive-audit-report)
14. [Feature Verification Report](#feature-verification-report)
15. [Type Safety and Code Quality Report](#type-safety-and-code-quality-report)
16. [API and Service Verification Report](#api-and-service-verification-report)
17. [Database Schema and ORM Verification Report](#database-schema-and-orm-verification-report)
18. [Component Implementation Review Report](#component-implementation-review-report)
19. [Security and Performance Analysis Report](#security-and-performance-analysis-report)

## Features

### Core Task Management
- **Complete CRUD Operations:** Create, read, update, and delete tasks with full functionality
- **Task Priorities:** Set task priority levels (Low, Medium, High, Critical) with color-coded indicators
- **Due Dates:** Assign and manage task due dates with visual indicators and reminders
- **Task Categories:** Organize tasks into custom categories for better organization
- **Tags and Labels:** Add multiple tags to tasks for flexible filtering and organization
- **Task Status:** Mark tasks as completed, pending, or in-progress with visual feedback
- **Subtasks:** Break down complex tasks into smaller subtasks with individual tracking
- **Recurring Tasks:** Create recurring tasks with customizable patterns (daily, weekly, monthly, yearly)
- **Smart Reminders:** Set intelligent reminders with quiet hours support and smart scheduling
- **Rich Text Notes:** Add detailed notes to tasks with formatting support
- **Task Search:** Full-text search across all tasks with advanced filtering options
- **Batch Operations:** Perform bulk actions on multiple tasks simultaneously

### Avatar Creator
- **Customizable Avatars:** Create personalized avatars with multiple customization options
- **Hair Styles:** 5 different hair styles with color customization
- **Eye Shapes:** 4 different eye shapes with color options
- **Accessories:** Multiple accessories to personalize avatars
- **Skin Tones:** 5 different skin tone options
- **Avatar Preview:** Real-time preview of avatar customization
- **Avatar Management:** Save, load, and manage multiple avatars
- **Avatar Display:** Display selected avatar throughout the app

### Themes and Customization
- **50+ Pre-installed Themes:** Comprehensive collection of themes across multiple categories
- **Light Themes:** 10 light-themed color schemes for daytime use
- **Dark Themes:** 10 dark-themed color schemes for nighttime use
- **Vibrant Themes:** 10 vibrant and colorful themes
- **Pastel Themes:** 10 soft pastel-colored themes
- **Professional Themes:** 10 professional business-oriented themes
- **Custom Theme Creator:** Create personalized themes with color picker
- **Theme Persistence:** Save and load custom themes
- **Dark Mode Support:** Automatic dark mode switching based on system preferences
- **Theme Import/Export:** Share themes with other users

### Developer Options
- **30+ Debugging Tools:** Comprehensive debugging and monitoring tools
- **Performance Monitoring:** Monitor app performance and frame rates
- **Memory Usage:** Track memory consumption and optimization
- **Storage Inspector:** View and manage local storage
- **Network Activity:** Monitor network requests and responses
- **Layout Debugging:** Visualize component boundaries and layout issues
- **Touch Target Display:** Show interactive element boundaries
- **Animation Controls:** Toggle and control animations
- **Font Size Adjuster:** Test different font sizes
- **Accessibility Inspector:** Check accessibility compliance
- **Color Contrast Checker:** Verify color contrast ratios
- **Device Information:** Display device and system information
- **Debug Console:** In-app console for debugging
- **Crash Reporter:** Capture and report crashes
- **Performance Profiler:** Profile app performance
- **Gesture Debugger:** Debug gesture interactions

### Advanced Features
- **Offline Sync Queue:** Automatic synchronization of changes when connection returns
- **Voice Task Creation:** Create tasks using voice input with NLP processing
- **Smart Notifications:** Intelligent push notifications with quiet hours
- **Team Collaboration:** Share tasks and collaborate with team members
- **Task Templates:** Save and reuse task configurations
- **Advanced Search:** Full-text search with multi-filter support
- **Batch Operations:** Bulk edit, delete, and organize tasks
- **Export/Import:** Export tasks to CSV/JSON and import from files
- **Analytics Dashboard:** View productivity metrics and statistics
- **Recurring Task Automation:** Automatic task generation for recurring patterns
- **Productivity Insights:** Learn from completion patterns and habits

### Analytics and Insights
- **Completion Statistics:** Track task completion rates and trends
- **Productivity Metrics:** Monitor productivity over time
- **Category Analytics:** Analyze tasks by category and priority
- **Time Tracking:** Track time spent on tasks
- **Completion Trends:** Visualize completion trends with charts
- **Most Productive Hours:** Identify your most productive times
- **Performance Reports:** Generate detailed productivity reports
- **Export Analytics:** Export analytics data for external analysis

## Project Structure

```
metodo/
├── app/                           # Expo Router app directory
│   ├── _layout.tsx               # Root layout with providers
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── index.tsx            # Home screen
│   │   ├── tasks.tsx            # Tasks list screen
│   │   ├── avatar.tsx           # Avatar creator screen
│   │   └── settings.tsx         # Settings screen
│   ├── task-detail.tsx          # Task detail and edit screen
│   ├── create-task.tsx          # Create new task screen
│   ├── theme-creator.tsx        # Custom theme creator
│   ├── dev-options.tsx          # Developer options
│   ├── templates.tsx            # Task templates management
│   ├── productivity-dashboard.tsx # Analytics dashboard
│   ├── image-showcase.tsx       # Image gallery
│   ├── collaboration.tsx        # Team collaboration screen
│   ├── onboarding.tsx           # Onboarding flow screen
│   ├── release-management.tsx   # Release management screen
│   ├── update-settings.tsx      # Update settings screen
│   ├── downloads.tsx            # Downloads screen
│   ├── team-management.tsx      # Team management screen
│   └── oauth/                   # OAuth callback handling
│       └── callback.tsx         # OAuth callback screen
├── components/                    # Reusable React components
│   ├── screen-container.tsx     # Safe area wrapper
│   ├── themed-view.tsx          # Theme-aware view
│   ├── haptic-tab.tsx           # Tab with haptic feedback
│   ├── template-card.tsx        # Template display card
│   ├── template-list.tsx        # Template list component
│   ├── image-gallery.tsx        # Image gallery component
│   ├── charts/                  # Chart components
│   │   ├── line-chart.tsx      # Line chart
│   │   ├── bar-chart.tsx       # Bar chart
│   │   ├── pie-chart.tsx       # Pie chart
│   │   └── stat-card.tsx       # Statistics card
│   └── ui/
│       ├── icon-symbol.tsx     # Icon mapping component
│       ├── collapsible.tsx     # Collapsible component
│       └── external-link.tsx   # External link component
├── lib/                          # Business logic and services
│   ├── task-context.tsx         # Task state management
│   ├── theme-provider.tsx       # Theme context provider
│   ├── utils.ts                 # Utility functions
│   ├── utils-extended.ts        # Extended utilities
│   ├── trpc.ts                  # tRPC client
│   ├── notification-service.ts  # Notification handling
│   ├── analytics-service.ts     # Analytics tracking
│   ├── analytics-data-service.ts # Analytics data calculations
│   ├── export-analytics-service.ts # Analytics export
│   ├── voice-task-service.ts    # Voice input processing
│   ├── smart-notifications-service.ts # Smart notifications
│   ├── team-collaboration-service.ts # Collaboration features
│   ├── task-template-service.ts # Task templates
│   ├── task-template-service-extended.ts # Extended templates
│   ├── advanced-search-service.ts # Advanced search
│   ├── batch-operations-service.ts # Batch operations
│   ├── export-import-service.ts # Export/import functionality
│   ├── offline-sync-queue.ts    # Offline sync management
│   ├── sync-utils.ts            # Sync utilities
│   ├── recurring-task-service.ts # Recurring tasks
│   ├── collaboration-service.ts # Collaboration service
│   ├── search-utils.ts          # Search utilities
│   ├── formatting-utils.ts      # Formatting utilities
│   ├── storage-utils.ts         # Storage utilities
│   ├── date-utils.ts            # Date utilities
│   ├── validation-utils.ts      # Validation utilities
│   ├── error-handler.ts         # Error handling
│   ├── app-config.ts            # App configuration
│   └── _core/                   # Core utilities
│       ├── theme.ts            # Theme system
│       ├── auth.ts             # Authentication
│       ├── api.ts              # API utilities
│       └── nativewind-pressable.ts # NativeWind fixes
├── hooks/                        # Custom React hooks
│   ├── use-colors.ts           # Theme colors hook
│   ├── use-color-scheme.ts     # Color scheme detection
│   ├── use-auth.ts             # Authentication hook
│   ├── use-search.ts           # Search functionality
│   ├── use-export-import.ts    # Export/import hook
│   ├── use-task-templates.ts   # Task templates hook
│   ├── use-team-collaboration.ts # Team collaboration hook
│   ├── use-analytics.ts        # Analytics hook
│   ├── use-auto-update.ts      # Auto update hook
│   ├── use-download-manager.ts # Download manager hook
│   └── use-image-management.ts # Image management hook
├── constants/                    # Application constants
│   ├── theme.ts                # Theme definitions
│   ├── themes-extended.ts      # 50+ theme definitions
│   ├── const.ts                # App constants
│   ├── oauth.ts                # OAuth configuration
│   └── images.ts               # Image constants
├── types/                        # TypeScript type definitions
│   └── index.ts                # Type definitions
├── config/                       # Configuration files
│   └── app-config.ts           # App configuration
├── docs/                         # Comprehensive documentation
│   ├── README.md               # Documentation index
│   ├── INDEX.md                # Documentation index
│   ├── DOCUMENTATION_INDEX.md  # Extended documentation index
│   ├── QUICK_REFERENCE.md      # Quick reference guide
│   ├── GLOSSARY.md             # Terminology glossary
│   ├── RESOURCES.md            # External resources
│   ├── ROADMAP.md              # Project roadmap
│   ├── BRANDING_AND_IMAGES.md  # Branding guidelines
│   ├── PRODUCTIVITY_DASHBOARD.md # Analytics documentation
│   ├── VOICE_TASK_CREATION.md  # Voice feature documentation
│   ├── SMART_NOTIFICATIONS.md  # Notifications documentation
│   ├── TEAM_COLLABORATION.md   # Collaboration documentation
│   ├── TASK_TEMPLATES.md       # Templates documentation
│   ├── ADVANCED_SEARCH_AND_BATCH_OPS.md # Search documentation
│   ├── OFFLINE_SYNC_SYSTEM.md  # Offline sync documentation
│   ├── DEBUGGING_AND_ERRORS.md # Debugging guide
│   ├── REPORT_ERROR.md         # Error reporting guide
│   ├── FEATURE_REQUEST.md      # Feature request guide
│   ├── COMMUNITY.md            # Community guidelines
│   ├── CONTRIBUTING.md         # Contributing guidelines
│   ├── SECURITY_AND_PRIVACY.md # Security documentation
│   ├── FAQ_AND_TROUBLESHOOTING.md # FAQ and troubleshooting
│   ├── ENVIRONMENT_VARIABLES.md # Environment configuration
│   ├── COMPLETE_FILE_STRUCTURE.md # File structure documentation
│   ├── requirements/
│   │   └── SYSTEM_REQUIREMENTS.md # System requirements
│   ├── how-to-run/
│   │   ├── DEVELOPMENT_SETUP.md # Development setup
│   │   ├── INSTALLATION_GUIDE.md # Installation guide
│   ├── make_executable-files/
│   │   └── BUILD_GUIDE.md      # Build guide
│   ├── technical/
│   │   ├── ARCHITECTURE.md     # Architecture documentation
│   │   ├── COMPONENTS.md       # Components reference
│   │   ├── COMPONENTS_SHOWCASE.md # Component showcase
│   │   ├── DATA_STORAGE.md     # Data storage documentation
│   │   ├── TYPES.md            # Type definitions documentation
│   │   ├── API_DOCUMENTATION.md # API reference
│   │   └── ADVANCED_SERVICES.md # Services documentation
│   ├── guides/
│   │   ├── GETTING_STARTED.md  # Getting started guide
│   │   ├── BEST_PRACTICES.md   # Best practices
│   │   └── MIGRATION_GUIDE.md  # Migration guide
│   ├── features/
│   │   ├── TASK_MANAGEMENT_DETAILED.md # Task management
│   │   ├── AVATAR_CREATOR_DETAILED.md # Avatar creator
│   │   ├── THEMES_DETAILED.md  # Themes documentation
│   │   └── DEVELOPER_OPTIONS_DETAILED.md # Developer options
│   ├── user-guides/
│   │   ├── TASK_CREATION_GUIDE.md # Task creation guide
│   │   ├── AVATAR_CREATOR_USER_GUIDE.md # Avatar guide
│   │   ├── THEMES_USER_GUIDE.md # Themes guide
│   │   ├── DEVELOPER_OPTIONS_GUIDE.md # Developer options guide
│   │   └── SETTINGS_GUIDE.md   # Settings guide
│   └── developer-guides/
│       ├── DEVELOPMENT_SETUP_GUIDE.md # Dev setup
│       ├── PROJECT_STRUCTURE.md # Project structure
│       ├── CODING_STANDARDS.md # Coding standards
│       ├── STATE_MANAGEMENT.md # State management
│       ├── TESTING_GUIDE.md    # Testing guide
│       ├── PERFORMANCE_OPTIMIZATION.md # Performance
│       ├── DEBUGGING_GUIDE.md  # Debugging guide
│       └── DEPLOYMENT_GUIDE.md # Deployment guide
│   ├── COMPREHENSIVE_AUDIT_REPORT.md # Comprehensive Audit Report
│   ├── FEATURE_VERIFICATION_REPORT.md # Feature Verification Report
│   ├── TYPE_SAFETY_AND_CODE_QUALITY_REPORT.md # Type Safety and Code Quality Report
│   ├── API_SERVICE_VERIFICATION_REPORT.md # API and Service Verification Report
│   ├── DATABASE_SCHEMA_VERIFICATION_REPORT.md # Database Schema and ORM Verification Report
│   ├── COMPONENT_IMPLEMENTATION_REVIEW_REPORT.md # Component Implementation Review Report
│   └── SECURITY_PERFORMANCE_ANALYSIS_REPORT.md # Security and Performance Analysis Report
├── assets/
│   ├── images/                 # App images and icons
│   │   ├── icon.png           # App icon
│   │   ├── splash-icon.png    # Splash screen icon
│   │   ├── favicon.png        # Web favicon
│   │   ├── android-icon-foreground.png # Android adaptive icon
│   │   ├── android-icon-background.png # Android background
│   │   └── android-icon-monochrome.png # Android monochrome
│   └── fonts/                  # Custom fonts (if any)
├── server/                      # Backend server (optional)
│   ├── _core/                   # Core server logic
│   ├── db.ts                    # Database connection
│   ├── routers.ts               # tRPC routers
│   └── storage.ts               # S3 storage integration
├── scripts/                     # Utility scripts
│   ├── generate_qr.mjs          # QR code generation
│   ├── load-env.js              # Environment variable loading
│   ├── reset-project.js         # Project reset script
│   ├── test-deployment.sh       # Deployment testing script
│   ├── test-github-actions.sh   # GitHub Actions testing script
│   ├── test-database-init.sh    # Database initialization testing script
│   ├── test-integration.sh      # Integration testing script
│   ├── monitor-production.sh    # Production monitoring script
│   └── test-disaster-recovery.sh # Disaster recovery testing script
├── .expo/                       # Expo configuration files
├── .github/                     # GitHub Actions workflows
├── .vscode/                     # VS Code settings
├── node_modules/                # Node.js dependencies
├── package.json                 # Project dependencies and scripts
├── pnpm-lock.yaml               # pnpm lock file
├── tailwind.config.js           # Tailwind CSS configuration
├── theme.config.js              # Theme configuration
├── tsconfig.json                # TypeScript configuration
└── vitest.config.ts             # Vitest configuration
```

## Installation

To install and run MeTodo locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SanskarYadav/MeTodo.git
    cd MeTodo
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your environment variables. A `.env.example` file is provided for reference.

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```

    This will start both the Metro bundler for the Expo app and the Node.js backend server.

5.  **Open the app:**
    -   **iOS/Android:** Scan the QR code displayed in your terminal with the Expo Go app.
    -   **Web:** Open your browser to the URL provided in the terminal (usually `http://localhost:8081`).

## Getting Started

Once the application is running, you can:

-   **Edit the home screen:** `app/(tabs)/index.tsx` is your app's main entry point.
-   **Customize theme:** Update tokens in `theme.config.js` and app details in `app.config.ts`.
-   **Add new screens:** Use `ScreenContainer` component for proper SafeArea handling.
-   **Add tab icons:** Map icons in `icon-symbol.tsx` BEFORE using in tabs.

For more detailed instructions, refer to the [DEVELOPMENT_SETUP.md](./docs/how-to-run/DEVELOPMENT_SETUP.md) and [INSTALLATION_GUIDE.md](./docs/how-to-run/INSTALLATION_GUIDE.md).

## Architecture

MeTodo follows a modular and scalable architecture, leveraging the power of React Native, Expo, and TypeScript. Key architectural principles include:

-   **Client-Server Separation:** Clear distinction between the mobile client and the optional Node.js backend server.
-   **Offline-First Design:** Prioritizes local data storage and synchronization for a seamless user experience even without an internet connection.
-   **Component-Based UI:** Reusable and modular UI components for rapid development and consistency.
-   **Type-Safe Development:** Extensive use of TypeScript for compile-time error checking and improved code quality.
-   **Scalable Backend:** Optional Node.js backend with tRPC, Drizzle ORM, and S3 storage for advanced features like user authentication, real-time collaboration, and data synchronization.

For a deep dive into the architecture, refer to the [ARCHITECTURE.md](./docs/technical/ARCHITECTURE.md).

## Features in Detail

For detailed documentation on each feature, please refer to the following guides:

-   [Task Management Detailed](./docs/features/TASK_MANAGEMENT_DETAILED.md)
-   [Avatar Creator Detailed](./docs/features/AVATAR_CREATOR_DETAILED.md)
-   [Themes Detailed](./docs/features/THEMES_DETAILED.md)
-   [Developer Options Detailed](./docs/features/DEVELOPER_OPTIONS_DETAILED.md)
-   [Voice Task Creation](./docs/VOICE_TASK_CREATION.md)
-   [Smart Notifications](./docs/SMART_NOTIFICATIONS.md)
-   [Team Collaboration](./docs/TEAM_COLLABORATION.md)
-   [Task Templates](./docs/TASK_TEMPLATES.md)
-   [Advanced Search and Batch Operations](./docs/ADVANCED_SEARCH_AND_BATCH_OPS.md)
-   [Offline Sync System](./docs/OFFLINE_SYNC_SYSTEM.md)
-   [Productivity Dashboard](./docs/PRODUCTIVITY_DASHBOARD.md)

## Themes

MeTodo offers extensive theming capabilities. Learn more about:

-   [Theme Definitions](./constants/theme.ts)
-   [Extended Themes (50+ themes)](./constants/themes-extended.ts)
-   [Custom Theme Creator](./app/theme-creator.tsx)

## Developer Options

Access powerful debugging and monitoring tools. Refer to the [DEVELOPER_OPTIONS_DETAILED.md](./docs/features/DEVELOPER_OPTIONS_DETAILED.md) for more information.

## Services and Utilities

MeTodo leverages a variety of services and utility functions to provide its rich feature set. Detailed documentation can be found in:

-   [Advanced Services](./docs/technical/ADVANCED_SERVICES.md)
-   [API Documentation](./docs/technical/API_DOCUMENTATION.md)
-   [State Management](./docs/developer-guides/STATE_MANAGEMENT.md)

## Documentation

This project is extensively documented. Here's an index of all available documentation:

-   [Documentation Index](./docs/DOCUMENTATION_INDEX.md)
-   [Quick Reference Guide](./docs/QUICK_REFERENCE.md)
-   [Glossary](./docs/GLOSSARY.md)
-   [Resources](./docs/RESOURCES.md)
-   [Roadmap](./docs/ROADMAP.md)
-   [Branding Guidelines](./docs/BRANDING_AND_IMAGES.md)
-   [Debugging and Errors](./docs/DEBUGGING_AND_ERRORS.md)
-   [FAQ and Troubleshooting](./docs/FAQ_AND_TROUBLESHOOTING.md)
-   [Environment Variables](./docs/ENVIRONMENT_VARIABLES.md)
-   [Complete File Structure](./docs/COMPLETE_FILE_STRUCTURE.md)
-   [System Requirements](./docs/requirements/SYSTEM_REQUIREMENTS.md)
-   [Development Setup Guide](./docs/how-to-run/DEVELOPMENT_SETUP.md)
-   [Installation Guide](./docs/how-to-run/INSTALLATION_GUIDE.md)
-   [Build Guide](./docs/make_executable-files/BUILD_GUIDE.md)
-   [Architecture Documentation](./docs/technical/ARCHITECTURE.md)
-   [Components Reference](./docs/technical/COMPONENTS.md)
-   [Components Showcase](./docs/technical/COMPONENTS_SHOWCASE.md)
-   [Data Storage Documentation](./docs/technical/DATA_STORAGE.md)
-   [Type Definitions Documentation](./docs/technical/TYPES.md)
-   [Getting Started Guide](./docs/guides/GETTING_STARTED.md)
-   [Best Practices](./docs/guides/BEST_PRACTICES.md)
-   [Migration Guide](./docs/guides/MIGRATION_GUIDE.md)
-   [User Guides](./docs/user-guides/SETTINGS_GUIDE.md)
-   [Developer Guides](./docs/developer-guides/DEPLOYMENT_GUIDE.md)

## Comprehensive Audit Report

For a detailed analysis of the entire project's code quality, feature implementation, and overall status, refer to the [COMPREHENSIVE_AUDIT_REPORT.md](./docs/COMPREHENSIVE_AUDIT_REPORT.md).

## Feature Verification Report

For a detailed report on the verification and testing of all 100+ features, refer to the [FEATURE_VERIFICATION_REPORT.md](./docs/FEATURE_VERIFICATION_REPORT.md).

## Type Safety and Code Quality Report

For an in-depth analysis of the project's type safety and code quality, refer to the [TYPE_SAFETY_AND_CODE_QUALITY_REPORT.md](./docs/TYPE_SAFETY_AND_CODE_QUALITY_REPORT.md).

## API and Service Verification Report

For a detailed verification of all API endpoints and internal service implementations, refer to the [API_SERVICE_VERIFICATION_REPORT.md](./docs/API_SERVICE_VERIFICATION_REPORT.md).

## Database Schema and ORM Verification Report

For a comprehensive verification of the database schema and its Object-Relational Mapping (ORM), refer to the [DATABASE_SCHEMA_VERIFICATION_REPORT.md](./docs/DATABASE_SCHEMA_VERIFICATION_REPORT.md).

## Component Implementation Review Report

For a detailed review of all screen and UI components, refer to the [COMPONENT_IMPLEMENTATION_REVIEW_REPORT.md](./docs/COMPONENT_IMPLEMENTATION_REVIEW_REPORT.md).

## Security and Performance Analysis Report

For a comprehensive analysis of the security posture and performance characteristics, refer to the [SECURITY_PERFORMANCE_ANALYSIS_REPORT.md](./docs/SECURITY_PERFORMANCE_ANALYSIS_REPORT.md).

## Contributing

We welcome contributions to MeTodo! Please see the [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
