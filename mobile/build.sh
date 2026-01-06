#!/bin/bash

# Gene Calculator Mobile Build Script
# Copies necessary files to www directory for Capacitor

echo "🔨 Building Gene Calculator Mobile..."

# Clean and create www directory
rm -rf www
mkdir -p www/js www/css

# Copy mobile-specific files
echo "📋 Copying mobile files..."
cp index.html www/
cp js/mobile-app.js www/js/
cp css/mobile.css www/css/

# Copy shared dependencies
echo "📦 Copying shared dependencies..."
cp -r ../js www/
cp -r ../css www/
cp -r ../calculators www/

echo "✅ Build complete! Files ready in www/"
