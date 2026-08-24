# Environment Variables Configuration

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## Overview

This document describes all environment variables used in the MeTodo application. Environment variables allow you to configure the app behavior without modifying code.

## File Location

Environment variables are defined in `.env` file at the project root. For development, you can copy `.env.example` to `.env` and update values.

## Environment Variables

### App Environment

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NODE_ENV` | string | `development` | Node environment (development, production, test) |
| `REACT_APP_ENV` | string | `development` | React app environment |

### API Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `REACT_APP_API_URL` | string | `http://localhost:3000` | Backend API base URL |
| `REACT_APP_API_TIMEOUT` | number | `30000` | API request timeout in milliseconds |

### Feature Flags

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `REACT_APP_ENABLE_NOTIFICATIONS` | boolean | `true` | Enable push notifications |
| `REACT_APP_ENABLE_ANALYTICS` | boolean | `true` | Enable analytics tracking |
| `REACT_APP_ENABLE_CLOUD_SYNC` | boolean | `false` | Enable cloud synchronization |
| `REACT_APP_ENABLE_USER_AUTH` | boolean | `false` | Enable user authentication |

### Analytics

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `REACT_APP_ANALYTICS_ENABLED` | boolean | `true` | Enable analytics |
| `REACT_APP_ANALYTICS_BATCH_SIZE` | number | `10` | Analytics batch size |

### Storage

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `REACT_APP_MAX_CACHE_SIZE` | number | `52428800` | Max cache size in bytes (50MB) |
| `REACT_APP_CACHE_EXPIRATION` | number | `86400000` | Cache expiration time in milliseconds (24 hours) |

### Notifications

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `REACT_APP_NOTIFICATION_ENABLED` | boolean | `true` | Enable notifications |
| `REACT_APP_NOTIFICATION_SOUND` | boolean | `true` | Enable notification sound |
| `REACT_APP_NOTIFICATION_VIBRATION` | boolean | `true` | Enable notification vibration |

### Theme

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `REACT_APP_DEFAULT_THEME` | string | `Default` | Default theme name |
| `REACT_APP_DEFAULT_COLOR_MODE` | string | `auto` | Default color mode (light, dark, auto) |

### Debug

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `REACT_APP_DEBUG_MODE` | boolean | `false` | Enable debug mode |
| `REACT_APP_DEBUG_LOGGING` | boolean | `false` | Enable debug logging |
| `REACT_APP_PERFORMANCE_MONITORING` | boolean | `false` | Enable performance monitoring |

### External Services

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | string | - | Firebase API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | string | - | Firebase auth domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | string | - | Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | string | - | Firebase storage bucket |

### Third-party APIs

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `REACT_APP_SENTRY_DSN` | string | - | Sentry error tracking DSN |
| `REACT_APP_MIXPANEL_TOKEN` | string | - | Mixpanel analytics token |
| `REACT_APP_AMPLITUDE_KEY` | string | - | Amplitude analytics key |

## Setting Environment Variables

### Development

1. Create `.env` file in project root:
```bash
cp .env.example .env
```

2. Update values in `.env`:
```env
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENABLE_NOTIFICATIONS=true
```

3. Restart development server:
```bash
npm run dev
```

### Production

For production builds, set environment variables before building:

```bash
# Using environment variables
REACT_APP_ENV=production npm run build

# Or export before building
export REACT_APP_ENV=production
export REACT_APP_API_URL=https://api.metodo.app
npm run build
```

### Docker

When using Docker, pass environment variables:

```bash
docker run -e REACT_APP_API_URL=https://api.metodo.app metodo:latest
```

## Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use `.env.example`** - Provide template with default values
3. **Document all variables** - Keep this file updated
4. **Use meaningful names** - Prefix with `REACT_APP_` for client-side variables
5. **Validate on startup** - Check required variables are set
6. **Use defaults** - Provide sensible defaults in code
7. **Separate by environment** - Use `.env.development`, `.env.production`

## Validation

MeTodo validates environment variables on startup. Required variables:

- `REACT_APP_API_URL` - Backend API URL

Optional variables use defaults if not provided.

## Troubleshooting

### Variables not loading

1. Check `.env` file exists in project root
2. Verify variable names are correct
3. Restart development server
4. Check for typos in variable names

### Changes not taking effect

1. Restart development server
2. Clear browser cache
3. Check `.env` file is in correct location
4. Verify variable is used in code

### Production variables not working

1. Set variables before build: `export VAR=value && npm run build`
2. Check Docker environment variables
3. Verify variable names in production code
4. Check CI/CD pipeline configuration

## Examples

### Development Setup

```env
NODE_ENV=development
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_DEBUG_MODE=true
REACT_APP_DEBUG_LOGGING=true
```

### Production Setup

```env
NODE_ENV=production
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.metodo.app
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_CLOUD_SYNC=true
REACT_APP_DEBUG_MODE=false
REACT_APP_DEBUG_LOGGING=false
REACT_APP_FIREBASE_API_KEY=your_firebase_key
REACT_APP_SENTRY_DSN=your_sentry_dsn
```

### Testing Setup

```env
NODE_ENV=test
REACT_APP_ENV=test
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENABLE_NOTIFICATIONS=false
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_DEBUG_MODE=true
```

## Support

For questions or issues with environment variables:

**Email:** supportramsandesh@gmail.com

**GitHub:** https://github.com/Sanskar-in/MeTodo

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
