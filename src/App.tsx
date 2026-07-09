import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ExerciseLibrary from './components/ExerciseLibrary';
import YogaDashboard from './components/YogaDashboard';
import PostureAnalyzer from './components/PostureAnalyzer';
import Footer from './components/Footer';

interface Exercise {
  id: string;
  name: string;
  keyPoints: string[];
}

interface YogaPose {
  id: string;
  name: string;
  sanskritName: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  targetMuscles: string[];
  description: string;
  keyPoints: string[];
  benefits: string[];
  breathing: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | undefined>();
  const [selectedPose, setSelectedPose] = useState<YogaPose | undefined>();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleSelectPose = (pose: YogaPose) => {
    setSelectedPose(pose);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'exercises':
        return <ExerciseLibrary onSelectExercise={handleSelectExercise} onNavigate={handleNavigate} />;
      case 'yoga':
        return <YogaDashboard onSelectPose={handleSelectPose} onNavigate={handleNavigate} />;
      case 'analyzer':
        return <PostureAnalyzer selectedExercise={selectedExercise} selectedPose={selectedPose} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      {renderCurrentPage()}
      <Footer />
    </div>
  );
}

export default App;