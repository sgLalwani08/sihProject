#!/bin/bash

# FitForm Pro Setup Script
echo "🚀 Setting up FitForm Pro..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Setup backend environment
echo "🐍 Setting up backend environment..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt

cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start backend: cd backend && source venv/bin/activate && python3 app.py"
echo "2. Start frontend: npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "🎉 Happy coding!"
