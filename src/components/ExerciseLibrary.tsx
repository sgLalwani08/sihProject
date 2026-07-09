import React from 'react';
import { Play, Clock, Target, TrendingUp, Star, Award, Zap, Brain, CheckCircle } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  targetMuscles: string[];
  description: string;
  keyPoints: string[];
}

interface ExerciseLibraryProps {
  onSelectExercise: (exercise: Exercise) => void;
  onNavigate: (page: string) => void;
}

export default function ExerciseLibrary({ onSelectExercise, onNavigate }: ExerciseLibraryProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const exercises: Exercise[] = [
    // Upper Body Exercises
    {
      id: 'push-up',
      name: 'Push-ups',
      category: 'Upper Body',
      difficulty: 'Beginner',
      duration: '3-5 minutes',
      targetMuscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
      description: 'A fundamental bodyweight exercise that builds upper body and core strength.',
      keyPoints: [
        'Keep body in straight line from head to heels',
        'Lower chest to nearly touch the ground',
        'Push up with controlled movement',
        'Keep core engaged throughout'
      ]
    },
    {
      id: 'pull-up',
      name: 'Pull-ups',
      category: 'Upper Body',
      difficulty: 'Intermediate',
      duration: '5-8 minutes',
      targetMuscles: ['Back', 'Biceps', 'Shoulders', 'Core'],
      description: 'Advanced upper body exercise that builds back and arm strength.',
      keyPoints: [
        'Hang from bar with overhand grip',
        'Pull body up until chin clears bar',
        'Lower with controlled movement',
        'Keep core engaged throughout'
      ]
    },
    {
      id: 'dips',
      name: 'Dips',
      category: 'Upper Body',
      difficulty: 'Intermediate',
      duration: '4-6 minutes',
      targetMuscles: ['Triceps', 'Chest', 'Shoulders'],
      description: 'Bodyweight exercise targeting triceps and chest muscles.',
      keyPoints: [
        'Support body on parallel bars',
        'Lower body until shoulders below elbows',
        'Push up to starting position',
        'Keep torso upright'
      ]
    },
    {
      id: 'burpees',
      name: 'Burpees',
      category: 'Upper Body',
      difficulty: 'Advanced',
      duration: '5-10 minutes',
      targetMuscles: ['Full Body', 'Cardio'],
      description: 'High-intensity full-body exercise combining squat, push-up, and jump.',
      keyPoints: [
        'Start standing, drop to squat',
        'Jump feet back to plank position',
        'Perform push-up, jump feet to squat',
        'Jump up with arms overhead'
      ]
    },

    // Lower Body Exercises
    {
      id: 'squat',
      name: 'Squats',
      category: 'Lower Body',
      difficulty: 'Beginner',
      duration: '4-6 minutes',
      targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
      description: 'Essential lower body exercise for building strength and mobility.',
      keyPoints: [
        'Feet shoulder-width apart',
        'Lower down as if sitting in a chair',
        'Keep knees aligned with toes',
        'Drive through heels to stand up'
      ]
    },
    {
      id: 'lunge',
      name: 'Lunges',
      category: 'Lower Body',
      difficulty: 'Beginner',
      duration: '5-7 minutes',
      targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
      description: 'Single-leg exercise that builds strength and improves balance.',
      keyPoints: [
        'Step forward into lunge position',
        'Lower back knee toward ground',
        'Push through front heel to return',
        'Keep torso upright'
      ]
    },
    {
      id: 'jump-squat',
      name: 'Jump Squats',
      category: 'Lower Body',
      difficulty: 'Intermediate',
      duration: '4-6 minutes',
      targetMuscles: ['Quadriceps', 'Glutes', 'Calves', 'Core'],
      description: 'Explosive squat variation that builds power and endurance.',
      keyPoints: [
        'Start in squat position',
        'Explode up with maximum force',
        'Land softly in squat position',
        'Absorb impact with bent knees'
      ]
    },
    {
      id: 'wall-sit',
      name: 'Wall Sit',
      category: 'Lower Body',
      difficulty: 'Beginner',
      duration: '2-4 minutes',
      targetMuscles: ['Quadriceps', 'Glutes', 'Core'],
      description: 'Isometric exercise that builds leg endurance and strength.',
      keyPoints: [
        'Back against wall, slide down to sitting position',
        'Knees at 90-degree angle',
        'Hold position for specified time',
        'Keep core engaged'
      ]
    },

    // Core Exercises
    {
      id: 'plank',
      name: 'Plank Hold',
      category: 'Core',
      difficulty: 'Beginner',
      duration: '2-3 minutes',
      targetMuscles: ['Core', 'Shoulders', 'Back', 'Glutes'],
      description: 'Isometric core exercise that builds stability and endurance.',
      keyPoints: [
        'Maintain straight line from head to heels',
        'Keep hips level and engaged',
        'Breathe steadily throughout hold',
        'Keep shoulders over elbows'
      ]
    },
    {
      id: 'crunch',
      name: 'Crunches',
      category: 'Core',
      difficulty: 'Beginner',
      duration: '3-5 minutes',
      targetMuscles: ['Abs', 'Core'],
      description: 'Classic abdominal exercise that targets the rectus abdominis.',
      keyPoints: [
        'Lie on back, knees bent',
        'Lift shoulders off ground',
        'Contract abs at the top',
        'Lower with control'
      ]
    },
    {
      id: 'mountain-climber',
      name: 'Mountain Climbers',
      category: 'Core',
      difficulty: 'Intermediate',
      duration: '4-6 minutes',
      targetMuscles: ['Core', 'Shoulders', 'Cardio'],
      description: 'Dynamic core exercise that combines strength and cardio.',
      keyPoints: [
        'Start in plank position',
        'Alternate bringing knees to chest',
        'Keep core tight throughout',
        'Maintain plank position'
      ]
    },
    {
      id: 'russian-twist',
      name: 'Russian Twists',
      category: 'Core',
      difficulty: 'Intermediate',
      duration: '3-5 minutes',
      targetMuscles: ['Obliques', 'Core'],
      description: 'Rotational core exercise that targets the obliques.',
      keyPoints: [
        'Sit with knees bent, lean back slightly',
        'Rotate torso side to side',
        'Keep core engaged',
        'Control the movement'
      ]
    },

    // Posture Exercises
    {
      id: 'proper-sitting',
      name: 'Proper Sitting Posture',
      category: 'Posture',
      difficulty: 'Beginner',
      duration: 'Continuous',
      targetMuscles: ['Back', 'Core', 'Neck', 'Shoulders'],
      description: 'Maintain proper posture while sitting to prevent back pain and improve focus.',
      keyPoints: [
        'Keep back straight and shoulders back',
        'Feet flat on the floor',
        'Screen at eye level',
        'Take regular breaks to stand and stretch'
      ]
    },
    {
      id: 'standing-posture',
      name: 'Standing Posture',
      category: 'Posture',
      difficulty: 'Beginner',
      duration: 'Continuous',
      targetMuscles: ['Back', 'Core', 'Legs'],
      description: 'Maintain proper standing posture to prevent back pain and improve alignment.',
      keyPoints: [
        'Stand tall with shoulders back',
        'Weight evenly distributed on both feet',
        'Keep head aligned with spine',
        'Engage core muscles'
      ]
    }
  ];

  const categories = ['all', 'Upper Body', 'Lower Body', 'Core', 'Posture'];

  const filteredExercises = selectedCategory === 'all' 
    ? exercises 
    : exercises.filter(exercise => exercise.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-orange-600 bg-orange-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleStartExercise = (exercise: Exercise) => {
    onSelectExercise(exercise);
    onNavigate('analyzer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full mb-8">
            <Brain className="w-5 h-5" />
            <span className="font-semibold">AI-Powered Exercise Library</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Exercise Library</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Choose from our comprehensive collection of exercises with real-time AI form analysis and personalized coaching
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl'
                  : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {category === 'all' ? 'All Exercises' : category}
            </button>
          ))}
        </div>

        {/* Exercise Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden card-hover border border-gray-100">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 px-8 py-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-3">{exercise.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                    <span className="text-blue-100 font-semibold text-lg">{exercise.category}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8">
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">{exercise.description}</p>

                {/* Stats */}
                <div className="flex items-center space-x-6 mb-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">{exercise.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">{exercise.targetMuscles.length} muscles</span>
                  </div>
                </div>

                {/* Target Muscles */}
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Target Muscles</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {exercise.targetMuscles.map((muscle, index) => (
                      <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full text-sm font-medium border border-blue-200">
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Points */}
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Form Checkpoints</span>
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {exercise.keyPoints.slice(0, 2).map((point, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleStartExercise(exercise)}
                  className="group w-full bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-green-600 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Start Exercise</span>
                  <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}