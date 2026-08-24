#!/bin/bash

################################################################################
# MeTodo Master Build Script
# =============================================================================
# (c) Copyright Sanskar Yadav. All rights reserved.
# Made by Sanskar Yadav.
#
# PURPOSE: Master build script that orchestrates builds for all platforms
#
# DESCRIPTION:
# This script coordinates building for multiple platforms:
# - Android (APK/AAB for Google Play Store)
# - Windows (.exe, .msi, .appx installers)
# - Linux (AppImage, Snap, Flatpak, DEB, RPM)
# - iOS (preparation for future)
# - macOS (preparation for future)
#
# USAGE:
#   ./scripts/build-all.sh [options]
#
# OPTIONS:
#   -p, --platform [android|windows|linux|all]  Platform to build (default: all)
#   -o, --output <path>                         Output directory (default: dist)
#   -t, --test                                  Run tests after build
#   -c, --clean                                 Clean before building
#   -r, --report                                Generate build report
#   -h, --help                                  Show this help message
#
# EXAMPLES:
#   ./scripts/build-all.sh                      # Build for all platforms
#   ./scripts/build-all.sh -p android           # Build Android only
#   ./scripts/build-all.sh -p windows -t        # Build Windows and run tests
#   ./scripts/build-all.sh -c -r                # Clean, build all, generate report
#
# ENVIRONMENT VARIABLES:
#   BUILD_PARALLEL               Build platforms in parallel (default: false)
#   BUILD_NUMBER                 Build number (optional)
#
# EXIT CODES:
#   0  - Success
#   1  - General error
#   2  - Environment validation failed
#   3  - Build failed
#
################################################################################

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_DIR="${PROJECT_ROOT}/.build-logs"
LOG_FILE="${LOG_DIR}/build-all-$(date +%Y%m%d-%H%M%S).log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Build configuration
BUILD_PLATFORM="${BUILD_PLATFORM:-all}"
OUTPUT_DIR="${OUTPUT_DIR:-${PROJECT_ROOT}/dist}"
RUN_TESTS=false
CLEAN_BUILD=false
GENERATE_REPORT=false
BUILD_PARALLEL="${BUILD_PARALLEL:-false}"

# Build status tracking
declare -A BUILD_STATUS
declare -A BUILD_TIME
TOTAL_ERRORS=0
TOTAL_WARNINGS=0
TOTAL_START_TIME=$(date +%s)

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
    
    case "$level" in
        INFO)
            echo -e "${BLUE}[INFO]${NC} ${message}" | tee -a "$LOG_FILE"
            ;;
        SUCCESS)
            echo -e "${GREEN}[SUCCESS]${NC} ${message}" | tee -a "$LOG_FILE"
            ;;
        WARN)
            echo -e "${YELLOW}[WARN]${NC} ${message}" | tee -a "$LOG_FILE"
            ;;
        ERROR)
            echo -e "${RED}[ERROR]${NC} ${message}" | tee -a "$LOG_FILE"
            ;;
        HEADER)
            echo -e "${MAGENTA}${message}${NC}" | tee -a "$LOG_FILE"
            ;;
        *)
            echo "[${level}] ${message}" | tee -a "$LOG_FILE"
            ;;
    esac
}

# Print main header
print_header() {
    echo -e "${CYAN}================================================================================${NC}"
    echo -e "${CYAN}  MeTodo Master Build Script${NC}"
    echo -e "${CYAN}================================================================================${NC}"
    log INFO "Build started at $TIMESTAMP"
    log INFO "Log file: $LOG_FILE"
    log INFO "Platform: $BUILD_PLATFORM"
    log INFO "Output directory: $OUTPUT_DIR"
}

# Print footer
print_footer() {
    local exit_code=$1
    local total_end_time=$(date +%s)
    local total_duration=$((total_end_time - TOTAL_START_TIME))
    
    echo -e "${CYAN}================================================================================${NC}"
    
    if [ $exit_code -eq 0 ]; then
        log SUCCESS "All builds completed successfully"
    else
        log ERROR "Build failed with exit code $exit_code"
    fi
    
    log INFO "Total duration: ${total_duration}s"
    log INFO "Total errors: $TOTAL_ERRORS"
    log INFO "Total warnings: $TOTAL_WARNINGS"
    
    echo -e "${CYAN}================================================================================${NC}"
}

# Show help
show_help() {
    cat << EOF
MeTodo Master Build Script

USAGE:
    ./scripts/build-all.sh [options]

OPTIONS:
    -p, --platform [android|windows|linux|all]  Platform to build (default: all)
    -o, --output <path>                         Output directory (default: dist)
    -t, --test                                  Run tests after build
    -c, --clean                                 Clean before building
    -r, --report                                Generate build report
    -h, --help                                  Show this help message

EXAMPLES:
    ./scripts/build-all.sh                      # Build for all platforms
    ./scripts/build-all.sh -p android           # Build Android only
    ./scripts/build-all.sh -p windows -t        # Build Windows and run tests
    ./scripts/build-all.sh -c -r                # Clean, build all, generate report

ENVIRONMENT VARIABLES:
    BUILD_PARALLEL               Build platforms in parallel (default: false)
    BUILD_NUMBER                 Build number (optional)

For more information, visit: https://metodo.app/docs/build

EOF
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -p|--platform)
                BUILD_PLATFORM="$2"
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
            -r|--report)
                GENERATE_REPORT=true
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
    
    # Validate platform
    case "$BUILD_PLATFORM" in
        android|windows|linux|all)
            log INFO "Build platform: $BUILD_PLATFORM"
            ;;
        *)
            log ERROR "Invalid platform: $BUILD_PLATFORM"
            return 1
            ;;
    esac
    
    return 0
}

# Validate environment
validate_environment() {
    log INFO "Validating environment..."
    
    # Check if running from correct directory
    if [ ! -f "$PROJECT_ROOT/package.json" ]; then
        log ERROR "package.json not found. Please run this script from the project root."
        return 1
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
    
    log SUCCESS "Environment validation passed"
    return 0
}

# Build Android
build_android() {
    log HEADER "Building Android..."
    local start_time=$(date +%s)
    
    cd "$PROJECT_ROOT"
    
    if bash "$SCRIPT_DIR/build-android.sh" \
        -v release \
        -o "$OUTPUT_DIR/android" \
        $([ "$RUN_TESTS" = true ] && echo "-t" || echo ""); then
        
        BUILD_STATUS[android]="SUCCESS"
        local end_time=$(date +%s)
        BUILD_TIME[android]=$((end_time - start_time))
        log SUCCESS "Android build completed in ${BUILD_TIME[android]}s"
        return 0
    else
        BUILD_STATUS[android]="FAILED"
        log ERROR "Android build failed"
        ((TOTAL_ERRORS++))
        return 1
    fi
}

# Build Windows
build_windows() {
    log HEADER "Building Windows..."
    local start_time=$(date +%s)
    
    cd "$PROJECT_ROOT"
    
    if bash "$SCRIPT_DIR/build-windows.sh" \
        -t nsis \
        -o "$OUTPUT_DIR/windows" \
        $([ "$RUN_TESTS" = true ] && echo "-t" || echo ""); then
        
        BUILD_STATUS[windows]="SUCCESS"
        local end_time=$(date +%s)
        BUILD_TIME[windows]=$((end_time - start_time))
        log SUCCESS "Windows build completed in ${BUILD_TIME[windows]}s"
        return 0
    else
        BUILD_STATUS[windows]="FAILED"
        log ERROR "Windows build failed"
        ((TOTAL_ERRORS++))
        return 1
    fi
}

# Build Linux
build_linux() {
    log HEADER "Building Linux..."
    local start_time=$(date +%s)
    
    cd "$PROJECT_ROOT"
    
    if bash "$SCRIPT_DIR/build-linux.sh" \
        -f all \
        -o "$OUTPUT_DIR/linux" \
        $([ "$RUN_TESTS" = true ] && echo "-t" || echo ""); then
        
        BUILD_STATUS[linux]="SUCCESS"
        local end_time=$(date +%s)
        BUILD_TIME[linux]=$((end_time - start_time))
        log SUCCESS "Linux build completed in ${BUILD_TIME[linux]}s"
        return 0
    else
        BUILD_STATUS[linux]="FAILED"
        log ERROR "Linux build failed"
        ((TOTAL_ERRORS++))
        return 1
    fi
}

# Build all platforms
build_all_platforms() {
    if [ "$BUILD_PLATFORM" = "all" ] || [ "$BUILD_PLATFORM" = "android" ]; then
        if [ "$BUILD_PARALLEL" = true ]; then
            build_android &
        else
            build_android || true
        fi
    fi
    
    if [ "$BUILD_PLATFORM" = "all" ] || [ "$BUILD_PLATFORM" = "windows" ]; then
        if [ "$BUILD_PARALLEL" = true ]; then
            build_windows &
        else
            build_windows || true
        fi
    fi
    
    if [ "$BUILD_PLATFORM" = "all" ] || [ "$BUILD_PLATFORM" = "linux" ]; then
        if [ "$BUILD_PARALLEL" = true ]; then
            build_linux &
        else
            build_linux || true
        fi
    fi
    
    # Wait for all background jobs if running in parallel
    if [ "$BUILD_PARALLEL" = true ]; then
        wait
    fi
}

# Generate build report
generate_build_report() {
    if [ "$GENERATE_REPORT" = false ]; then
        return 0
    fi
    
    log INFO "Generating build report..."
    
    local report_file="${LOG_DIR}/build-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$report_file" << EOF
MeTodo Master Build Report
Generated: $TIMESTAMP

Build Configuration:
  Platform: $BUILD_PLATFORM
  Output Directory: $OUTPUT_DIR
  Run Tests: $RUN_TESTS
  Clean Build: $CLEAN_BUILD
  Parallel Build: $BUILD_PARALLEL

Build Results:
  Android: ${BUILD_STATUS[android]:-SKIPPED} (${BUILD_TIME[android]:-0}s)
  Windows: ${BUILD_STATUS[windows]:-SKIPPED} (${BUILD_TIME[windows]:-0}s)
  Linux: ${BUILD_STATUS[linux]:-SKIPPED} (${BUILD_TIME[linux]:-0}s)

Summary:
  Total Errors: $TOTAL_ERRORS
  Total Warnings: $TOTAL_WARNINGS

Build Artifacts:
$(find "$OUTPUT_DIR" -type f -exec ls -lh {} \; 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}')

Log File: $LOG_FILE

For more information, visit: https://metodo.app/docs/build
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
    
    # Clean if requested
    if [ "$CLEAN_BUILD" = true ]; then
        log INFO "Cleaning build artifacts..."
        rm -rf "$OUTPUT_DIR" || true
    fi
    
    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    
    # Build all platforms
    build_all_platforms
    
    # Generate report
    generate_build_report
    
    # Determine exit code
    if [ $TOTAL_ERRORS -gt 0 ]; then
        exit_code=3
    fi
    
    print_footer $exit_code
    return $exit_code
}

# Run main function
main "$@"
exit $?
