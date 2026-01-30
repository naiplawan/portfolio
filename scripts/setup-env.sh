#!/bin/bash

# Blog CMS Environment Setup Script
# This script helps you configure your environment variables for Supabase

set -e

echo "========================================"
echo "  Blog CMS Environment Setup"
echo "========================================"
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists."
    echo "Do you want to overwrite it? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    echo "Backing up existing .env.local to .env.local.backup"
    cp .env.local .env.local.backup
fi

echo "Let's configure your Supabase environment."
echo ""
echo "You can find these values in your Supabase project:"
echo "  1. Go to https://supabase.com"
echo "  2. Select your project"
echo "  3. Go to Project Settings → API"
echo ""

# Prompt for Supabase URL
echo "Enter your Supabase Project URL:"
echo "  (e.g., https://xxxxx.supabase.co)"
read -r SUPABASE_URL

# Prompt for anon key
echo ""
echo "Enter your Supabase anon public key:"
read -r SUPABASE_ANON_KEY

# Prompt for service role key
echo ""
echo "Enter your Supabase service_role key:"
echo "  (Keep this secret!)"
read -r SUPABASE_SERVICE_ROLE_KEY

# Validate inputs
if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" || -z "$SUPABASE_SERVICE_ROLE_KEY" ]]; then
    echo ""
    echo "❌ Error: All fields are required!"
    exit 1
fi

# Create .env.local file
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
EOF

echo ""
echo "✅ .env.local created successfully!"
echo ""
echo "⚠️  IMPORTANT:"
echo "  1. .env.local is in .gitignore (won't be committed)"
echo "  2. Never commit .env.local to git"
echo "  3. Keep your service role key secret"
echo ""
echo "Next steps:"
echo "  1. Run database migration from DEPLOYMENT.md"
echo "  2. Run: npm run dev"
echo "  3. Visit: http://localhost:3000/blog/manage"
echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
