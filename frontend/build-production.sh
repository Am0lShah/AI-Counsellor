#!/bin/bash
# Build script for production deployment

echo "Building for production with API URL: https://assign-ai-backend.onrender.com/api"

# Set production environment
export NODE_ENV=production
export NEXT_PUBLIC_API_URL=https://assign-ai-backend.onrender.com/api

# Install dependencies
npm install

# Build the application
npm run build

echo "Build completed! Deploy the 'out' folder to Netlify."