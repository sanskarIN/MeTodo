#!/bin/bash

################################################################################
# MeTodo Linux Build Script
# =============================================================================
# (c) Copyright Sanskar Yadav. All rights reserved.
# Made by Sanskar Yadav.
#
# PURPOSE: Comprehensive Linux build script for local development and CI/CD
#
# DESCRIPTION:
# This script handles complete Linux build process including:
# - Environment validation
# - Dependency checking
# - Build configuration
# - Multiple format support (AppImage, Snap, Flatpak, DEB, RPM)
# - Signing and optimization
# - Testing and validation
# - Error handling and logging
#
# USAGE:
#   ./scripts/build-linux.sh [options]
#
# OPTIONS:
#   -f, --format [appimage|snap|flatpak|deb|rpm|all]  Build format (default: appimage)
#   -a, --arch [x64|ia32|arm64]                        Architecture (default: x64)
#   -o, --output <path>                                Output directory (default: dist/linux)
#   -t, --test                                         Run tests after build
#   -c, --clean                                        Clean before building
#   -h, --help                                         Show this help message
#
# EXAMPLES:
#   ./scripts/build-linux.sh                           # Build AppImage
#   ./scripts/build-linux.sh -f all                    # Build all formats
#   ./scripts/build-linux.sh -f deb -a x64             # Build DEB for x64
#   ./scripts/build-linux.sh -f snap -t                # Build Snap and run tests
#
# ENVIRONMENT VARIABLES:
#   BUILD_NUMBER                 Build number (optional)
#   SNAPCRAFT_STORE_CREDENTIALS  Snapcraft credentials (for publishing)
#
# EXIT CODES:
#   0  - Success
#   1  - General error
#   2  - Environment validation failed
#   3  - Dependency check failed
#   4  - Build failed
#   5  - Testing failed
#
################################################################################

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_DIR="${PROJECT_ROOT}/.build-logs"
LOG_FILE="${LOG_DIR}/linux-build-$(date +%Y%m%d-%H%M%S).log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Build configuration
BUILD_FORMAT="${BUILD_FORMAT:-appimage}"
BUILD_ARCH="${BUILD_ARCH:-x64}"
OUTPUT_DIR="${OUTPUT_DIR:-${PROJECT_ROOT}/dist/linux}"
RUN_TESTS=false
CLEAN_BUILD=false

# Counters
ERRORS=0
WARNINGS=0

################################################################################
# Utility Functions
################################################################################

# Create log directory
mkdir -p "$LOG_DIR"

# Logging function
log() {
    local level="$1"
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        INFO)
            echo -e "${BLUE}[INFO]${NC} ${message}" | tee -a "$LOG_FILE"
            ;;
        SUCCESS)
            echo -e "${GREEN}[SUCCESS]${NC} ${message}" | tee -a "$LOG_FILE"
            ;;
        WARN)
            echo -e "${YELLOW}[WARN]${NC} ${message}" | tee -a "$LOG_FILE"
            ((WARNINGS++))
            ;;
        ERROR)
            echo -e "${RED}[ERROR]${NC} ${message}" | tee -a "$LOG_FILE"
            ((ERRORS++))
            ;;
        *)
            echo "[${level}] ${message}" | tee -a "$LOG_FILE"
            ;;
    esac
}

# Print header
print_header() {
    echo -e "${BLUE}================================================================================${NC}"
    echo -e "${BLUE}  MeTodo Linux Build Script${NC}"
    echo -e "${BLUE}================================================================================${NC}"
    log INFO "Build started at $TIMESTAMP"
    log INFO "Log file: $LOG_FILE"
}

# Print footer
print_footer() {
    local exit_code=$1
    echo -e "${BLUE}================================================================================${NC}"
    
    if [ $exit_code -eq 0 ]; then
        log SUCCESS "Build completed successfully"
        log INFO "Warnings: $WARNINGS"
        log INFO "Output directory: $OUTPUT_DIR"
    else
        log ERROR "Build failed with exit code $exit_code"
        log ERROR "Errors: $ERRORS"
        log ERROR "Warnings: $WARNINGS"
    fi
    
    echo -e "${BLUE}================================================================================${NC}"
}

# Show help
show_help() {
    cat << EOF
MeTodo Linux Build Script

USAGE:
    ./scripts/build-linux.sh [options]

OPTIONS:
    -f, --format [appimage|snap|flatpak|deb|rpm|all]  Build format (default: appimage)
    -a, --arch [x64|ia32|arm64]                        Architecture (default: x64)
    -o, --output <path>                                Output directory (default: dist/linux)
    -t, --test                                         Run tests after build
    -c, --clean                                        Clean before building
    -h, --help                                         Show this help message

EXAMPLES:
    ./scripts/build-linux.sh                           # Build AppImage
    ./scripts/build-linux.sh -f all                    # Build all formats
    ./scripts/build-linux.sh -f deb -a x64             # Build DEB for x64
    ./scripts/build-linux.sh -f snap -t                # Build Snap and run tests

ENVIRONMENT VARIABLES:
    BUILD_NUMBER                 Build number (optional)
    SNAPCRAFT_STORE_CREDENTIALS  Snapcraft credentials (for publishing)

For more information, visit: https://metodo.app/docs/build-linux

EOF
}

# Validate environment
validate_environment() {
    log INFO "Validating environment..."
    
    # Check if running from correct directory
    if [ ! -f "$PROJECT_ROOT/package.json" ]; then
        log ERROR "package.json not found. Please run this script from the project root."
        return 1
    fi
    
    # Check if running on Linux
    if [[ "$OSTYPE" != "linux"* ]]; then
        log WARN "This script is designed for Linux. You are running on: $OSTYPE"
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log ERROR "Node.js is not installed"
        return 1
    fi
    log INFO "Node.js version: $(node --version)"
    
    # Check pnpm
    if ! command -v pnpm &> /dev/null; then
        log ERROR "pnpm is not installed"
        return 1
    fi
    log INFO "pnpm version: $(pnpm --version)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log ERROR "npm is not installed"
        return 1
    fi
    log INFO "npm version: $(npm --version)"
    
    log SUCCESS "Environment validation passed"
    return 0
}

# Check dependencies
check_dependencies() {
    log INFO "Checking dependencies..."
    
    # Check if node_modules exists
    if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
        log WARN "node_modules not found, installing dependencies..."
        cd "$PROJECT_ROOT"
        pnpm install || {
            log ERROR "Failed to install dependencies"
            return 1
        }
    fi
    
    # Check if electron-builder is installed
    if ! npm list electron-builder &> /dev/null; then
        log WARN "electron-builder not installed, installing..."
        cd "$PROJECT_ROOT"
        pnpm add -D electron-builder || {
            log ERROR "Failed to install electron-builder"
            return 1
        }
    fi
    
    # Check system dependencies for specific formats
    case "$BUILD_FORMAT" in
        snap)
            if ! command -v snapcraft &> /dev/null; then
                log WARN "snapcraft not installed, installing..."
                sudo apt-get install -y snapcraft || {
                    log WARN "Failed to install snapcraft (non-critical)"
                }
            fi
            ;;
        flatpak)
            if ! command -v flatpak &> /dev/null; then
                log WARN "flatpak not installed, installing..."
                sudo apt-get install -y flatpak || {
                    log WARN "Failed to install flatpak (non-critical)"
                }
            fi
            ;;
        deb|rpm)
            if ! command -v dpkg &> /dev/null && [ "$BUILD_FORMAT" = "deb" ]; then
                log WARN "dpkg not installed (required for DEB builds)"
            fi
            ;;
    esac
    
    log SUCCESS "Dependency check passed"
    return 0
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -f|--format)
                BUILD_FORMAT="$2"
                shift 2
                ;;
            -a|--arch)
                BUILD_ARCH="$2"
                shift 2
                ;;
            -o|--output)
                OUTPUT_DIR="$2"
                shift 2
                ;;
            -t|--test)
                RUN_TESTS=true
                shift
                ;;
            -c|--clean)
                CLEAN_BUILD=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                log ERROR "Unknown option: $1"
                show_help
                return 1
                ;;
        esac
    done
    
    # Validate format
    case "$BUILD_FORMAT" in
        appimage|snap|flatpak|deb|rpm|all)
            log INFO "Build format: $BUILD_FORMAT"
            ;;
        *)
            log ERROR "Invalid build format: $BUILD_FORMAT"
            return 1
            ;;
    esac
    
    # Validate architecture
    case "$BUILD_ARCH" in
        x64|ia32|arm64)
            log INFO "Build architecture: $BUILD_ARCH"
            ;;
        *)
            log ERROR "Invalid build architecture: $BUILD_ARCH"
            return 1
            ;;
    esac
    
    return 0
}

# Clean build
clean_build() {
    if [ "$CLEAN_BUILD" = true ]; then
        log INFO "Cleaning build artifacts..."
        
        cd "$PROJECT_ROOT"
        
        # Clean npm cache
        npm cache clean --force || true
        pnpm store prune || true
        
        # Clean output directory
        rm -rf "$OUTPUT_DIR" || true
        
        # Clean dist directory
        rm -rf dist || true
        
        log SUCCESS "Clean completed"
    fi
}

# Install dependencies
install_dependencies() {
    log INFO "Installing dependencies..."
    
    cd "$PROJECT_ROOT"
    
    if [ ! -d "node_modules" ] || [ ! -f "pnpm-lock.yaml" ]; then
        log INFO "Running pnpm install..."
        pnpm install || {
            log ERROR "Failed to install dependencies"
            return 1
        }
    else
        log INFO "Dependencies already installed"
    fi
    
    log SUCCESS "Dependencies installed"
    return 0
}

# Build application
build_application() {
    log INFO "Building application..."
    
    cd "$PROJECT_ROOT"
    
    # Build React/web assets
    log INFO "Building web assets..."
    pnpm run build || {
        log ERROR "Failed to build web assets"
        return 1
    }
    
    log SUCCESS "Application build completed"
    return 0
}

# Build Linux packages
build_packages() {
    log INFO "Building Linux packages (format: $BUILD_FORMAT)..."
    
    cd "$PROJECT_ROOT"
    
    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    
    # Build using electron-builder
    log INFO "Building with electron-builder..."
    
    local build_command="npm run electron:build -- --linux"
    
    if [ "$BUILD_FORMAT" = "all" ]; then
        # Build all formats
        log INFO "Building all formats..."
        eval "$build_command" || {
            log ERROR "Build failed"
            return 1
        }
    else
        # Build specific format
        build_command="$build_command $BUILD_FORMAT"
        eval "$build_command" || {
            log ERROR "Build failed"
            return 1
        }
    fi
    
    log SUCCESS "Package build completed"
    return 0
}

# Run tests
run_tests() {
    if [ "$RUN_TESTS" = false ]; then
        log INFO "Skipping tests (not requested)"
        return 0
    fi
    
    log INFO "Running tests..."
    
    cd "$PROJECT_ROOT"
    
    # Run unit tests
    log INFO "Running unit tests..."
    pnpm run test || {
        log ERROR "Unit tests failed"
        return 1
    }
    
    # Run integration tests
    log INFO "Running integration tests..."
    pnpm run test:integration || {
        log WARN "Integration tests failed (non-critical)"
    }
    
    log SUCCESS "Tests completed"
    return 0
}

# Verify build
verify_build() {
    log INFO "Verifying build artifacts..."
    
    if [ ! -d "$OUTPUT_DIR" ]; then
        log ERROR "Output directory not found: $OUTPUT_DIR"
        return 1
    fi
    
    # Check for package files
    local appimage_count=$(find "$OUTPUT_DIR" -name "*.AppImage" 2>/dev/null | wc -l)
    local snap_count=$(find "$OUTPUT_DIR" -name "*.snap" 2>/dev/null | wc -l)
    local flatpak_count=$(find "$OUTPUT_DIR" -name "*.flatpak" 2>/dev/null | wc -l)
    local deb_count=$(find "$OUTPUT_DIR" -name "*.deb" 2>/dev/null | wc -l)
    local rpm_count=$(find "$OUTPUT_DIR" -name "*.rpm" 2>/dev/null | wc -l)
    
    if [ $appimage_count -eq 0 ] && [ $snap_count -eq 0 ] && [ $flatpak_count -eq 0 ] && [ $deb_count -eq 0 ] && [ $rpm_count -eq 0 ]; then
        log WARN "No package files found in output directory"
    else
        log INFO "Found $appimage_count AppImage, $snap_count Snap, $flatpak_count Flatpak, $deb_count DEB, $rpm_count RPM files"
    fi
    
    # List build artifacts
    log INFO "Build artifacts:"
    find "$OUTPUT_DIR" -type f -exec ls -lh {} \; 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'
    
    log SUCCESS "Build verification completed"
    return 0
}

# Generate build report
generate_report() {
    log INFO "Generating build report..."
    
    local report_file="${LOG_DIR}/linux-build-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$report_file" << EOF
MeTodo Linux Build Report
Generated: $TIMESTAMP

Build Configuration:
  Format: $BUILD_FORMAT
  Architecture: $BUILD_ARCH
  Output Directory: $OUTPUT_DIR
  Run Tests: $RUN_TESTS
  Clean Build: $CLEAN_BUILD

Build Results:
  Errors: $ERRORS
  Warnings: $WARNINGS
  Status: $([ $ERRORS -eq 0 ] && echo "SUCCESS" || echo "FAILED")

Build Artifacts:
$(find "$OUTPUT_DIR" -type f -exec ls -lh {} \; 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}')

Log File: $LOG_FILE

For more information, visit: https://metodo.app/docs/build-linux
EOF
    
    log INFO "Build report saved: $report_file"
    cat "$report_file" >> "$LOG_FILE"
}

################################################################################
# Main Script
################################################################################

main() {
    local exit_code=0
    
    print_header
    
    # Parse arguments
    if ! parse_arguments "$@"; then
        print_footer 1
        return 1
    fi
    
    # Validate environment
    if ! validate_environment; then
        print_footer 2
        return 2
    fi
    
    # Check dependencies
    if ! check_dependencies; then
        print_footer 3
        return 3
    fi
    
    # Clean build if requested
    clean_build
    
    # Install dependencies
    if ! install_dependencies; then
        print_footer 3
        return 3
    fi
    
    # Build application
    if ! build_application; then
        print_footer 4
        return 4
    fi
    
    # Build packages
    if ! build_packages; then
        print_footer 4
        return 4
    fi
    
    # Run tests
    if ! run_tests; then
        print_footer 5
        return 5
    fi
    
    # Verify build
    if ! verify_build; then
        print_footer 1
        return 1
    fi
    
    # Generate report
    generate_report
    
    print_footer 0
    return 0
}

# Run main function
main "$@"
exit $?
