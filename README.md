# FitForm Pro - AI-Powered Posture Analysis

A comprehensive fitness and yoga application with real-time AI posture analysis, exercise tracking, and personalized coaching.

## 🚀 Features

### 🤖 AI-Powered Analysis
- **Real-time Posture Analysis**: Advanced computer vision with MediaPipe
- **Exercise Form Correction**: Expert-level feedback for perfect form
- **Yoga Pose Guidance**: Traditional asanas with AI alignment assistance
- **Live Skeleton Overlay**: Real-time pose visualization

### 🏋️ Exercise Library
- **Upper Body**: Push-ups, Pull-ups, Dips, Burpees
- **Lower Body**: Squats, Lunges, Jump Squats, Wall Sit
- **Core**: Plank, Crunches, Mountain Climbers, Russian Twists
- **Posture**: Sitting and Standing posture correction

### 🧘 Yoga Dashboard
- **12 Traditional Asanas**: Mountain Pose, Downward Dog, Warrior Poses, Tree Pose, and more
- **Sanskrit Names**: Authentic yoga experience with traditional names
- **Breathing Guidance**: Mindfulness and relaxation cues
- **Pose Categories**: Standing, Inverted, Balance, Restorative, Backbend, Hip Opener, Flow

### 📊 Smart Tracking
- **Rep Counting**: Intelligent exercise repetition tracking
- **Form Scoring**: Real-time form analysis (0-100 scale)
- **Progress Metrics**: Reps, sets, duration, calories burned
- **Video Analysis**: Upload and analyze recorded sessions

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Canvas API** for video overlay

### Backend
- **Python Flask** web framework
- **MediaPipe** for pose estimation
- **OpenCV** for computer vision
- **NumPy** for mathematical operations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Installation

#### Quick Setup (Recommended)
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fitform-pro.git
   cd fitform-pro
   ```

2. **Run the setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

#### Manual Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fitform-pro.git
   cd fitform-pro
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   python3 app.py
   ```
   Backend will be available at `http://localhost:5001`

2. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## 📁 Project Structure

```
fitform-pro/
├── src/                        # Frontend React application
│   ├── components/
│   │   ├── Header.tsx          # Navigation component
│   │   ├── HomePage.tsx        # Landing page
│   │   ├── ExerciseLibrary.tsx # Exercise selection
│   │   ├── YogaDashboard.tsx   # Yoga pose selection
│   │   ├── PostureAnalyzer.tsx # Main analysis component
│   │   ├── ProgressTracking.tsx # Progress tracking component
│   │   ├── LoadingSpinner.tsx  # Loading component
│   │   └── Footer.tsx          # Footer component
│   ├── App.tsx                 # Main application
│   ├── main.tsx                # Application entry point
│   ├── index.css               # Global styles
│   └── vite-env.d.ts           # TypeScript declarations
├── backend/                    # Python Flask backend
│   ├── app.py                  # Flask server main file
│   ├── models.py               # Data models
│   ├── requirements.txt        # Python dependencies
│   ├── setup.sh               # Backend setup script
│   ├── env_example.txt        # Environment variables example
│   ├── services/              # AI and analysis services
│   │   ├── ai_coach.py        # AI coaching logic
│   │   ├── pose_analyzer.py   # Pose analysis algorithms
│   │   └── posture_corrector.py # Posture correction logic
│   └── utils/                 # Utility functions
│       ├── image_processor.py # Image processing utilities
│       └── video_processor.py # Video processing utilities
├── public/                     # Static assets
├── package.json               # Node.js dependencies
├── package-lock.json          # Dependency lock file
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── eslint.config.js           # ESLint configuration
├── setup.sh                   # Automated setup script
├── LICENSE                    # MIT License
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🎯 Usage

### Exercise Analysis
1. Navigate to **Exercises** from the homepage
2. Select your desired exercise
3. Click **Start Practice** to begin AI analysis
4. Follow the real-time feedback for perfect form

### Yoga Practice
1. Navigate to **Yoga** from the homepage
2. Choose from 12 traditional asanas
3. Click **Start Practice** for AI-guided alignment
4. Follow breathing cues and pose instructions

### Video Analysis
1. Go to **AI Analysis** section
2. Upload a video file
3. Choose analysis mode (Fast/Detailed)
4. Get comprehensive posture analysis

## 🔧 Configuration

### Backend Configuration
The backend runs on `http://localhost:5001` by default. You can modify the port in `backend/app.py`.

### Frontend Configuration
The frontend connects to the backend via the URL specified in `PostureAnalyzer.tsx`. Make sure both servers are running.

## 📊 AI Analysis Features

### Exercise Analysis
- **Form Scoring**: Expert-level criteria for each exercise
- **Rep Counting**: Smart detection of movement patterns
- **Real-time Feedback**: Instant corrections and guidance
- **Progress Tracking**: Comprehensive metrics and analytics

### Yoga Analysis
- **Alignment Detection**: Shoulder, hip, and spine alignment
- **Balance Assessment**: Single-leg pose stability
- **Flexibility Tracking**: Range of motion analysis
- **Breathing Integration**: Mindfulness and relaxation guidance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MediaPipe** for pose estimation technology
- **React** and **TypeScript** for the frontend framework
- **Flask** and **OpenCV** for backend processing
- **Tailwind CSS** for beautiful styling

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**FitForm Pro** - Transform your fitness journey with AI-powered analysis! 🚀💪
