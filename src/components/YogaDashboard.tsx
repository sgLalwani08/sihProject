import React from 'react';
import { Play, Clock, Target, TrendingUp, Star, Award, Zap, Brain, CheckCircle, Heart, Leaf, Sun } from 'lucide-react';

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

interface YogaDashboardProps {
  onSelectPose: (pose: YogaPose) => void;
  onNavigate: (page: string) => void;
}

export default function YogaDashboard({ onSelectPose, onNavigate }: YogaDashboardProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const yogaPoses: YogaPose[] = [
    {
      id: 'mountain-pose',
      name: 'Mountain Pose',
      sanskritName: 'Tadasana',
      category: 'Standing',
      difficulty: 'Beginner',
      duration: '2-3 minutes',
      targetMuscles: ['Full Body', 'Posture', 'Balance'],
      description: 'Foundation pose that improves posture and body awareness.',
      keyPoints: [
        'Stand with feet together',
        'Arms at sides, palms facing forward',
        'Lift through the crown of the head',
        'Engage core and breathe deeply'
      ],
      benefits: [
        'Improves posture and alignment',
        'Strengthens core muscles',
        'Enhances body awareness',
        'Reduces stress and anxiety'
      ],
      breathing: 'Deep, steady breathing through the nose'
    },
    {
      id: 'downward-dog',
      name: 'Downward Dog',
      sanskritName: 'Adho Mukha Svanasana',
      category: 'Inverted',
      difficulty: 'Beginner',
      duration: '3-5 minutes',
      targetMuscles: ['Shoulders', 'Hamstrings', 'Calves', 'Core'],
      description: 'Inverted pose that stretches the entire body and builds strength.',
      keyPoints: [
        'Start on hands and knees',
        'Tuck toes and lift hips up',
        'Straighten legs, form inverted V',
        'Keep spine long and breathe'
      ],
      benefits: [
        'Stretches entire body',
        'Strengthens arms and shoulders',
        'Improves circulation',
        'Calms the mind'
      ],
      breathing: 'Long, steady breaths while holding the pose'
    },
    {
      id: 'warrior-1',
      name: 'Warrior I',
      sanskritName: 'Virabhadrasana I',
      category: 'Standing',
      difficulty: 'Beginner',
      duration: '3-5 minutes',
      targetMuscles: ['Legs', 'Hips', 'Shoulders', 'Core'],
      description: 'Powerful standing pose that builds strength and focus.',
      keyPoints: [
        'Step one foot forward into lunge',
        'Back foot at 45-degree angle',
        'Arms reach up overhead',
        'Keep front knee over ankle'
      ],
      benefits: [
        'Strengthens legs and core',
        'Improves balance and focus',
        'Opens chest and shoulders',
        'Builds mental resilience'
      ],
      breathing: 'Strong, steady breathing to maintain the pose'
    },
    {
      id: 'warrior-2',
      name: 'Warrior II',
      sanskritName: 'Virabhadrasana II',
      category: 'Standing',
      difficulty: 'Beginner',
      duration: '3-5 minutes',
      targetMuscles: ['Legs', 'Hips', 'Shoulders', 'Core'],
      description: 'Side-facing warrior pose that builds endurance and concentration.',
      keyPoints: [
        'Step feet wide apart',
        'Turn front foot forward, back foot parallel',
        'Bend front knee, arms extend to sides',
        'Gaze over front fingertips'
      ],
      benefits: [
        'Builds leg strength and endurance',
        'Improves concentration',
        'Opens hips and chest',
        'Enhances stability'
      ],
      breathing: 'Deep, focused breathing'
    },
    {
      id: 'tree-pose',
      name: 'Tree Pose',
      sanskritName: 'Vrksasana',
      category: 'Balance',
      difficulty: 'Beginner',
      duration: '2-4 minutes',
      targetMuscles: ['Legs', 'Core', 'Balance'],
      description: 'Balancing pose that improves focus and stability.',
      keyPoints: [
        'Stand on one leg',
        'Place other foot on inner thigh',
        'Hands in prayer position',
        'Focus on a fixed point'
      ],
      benefits: [
        'Improves balance and stability',
        'Strengthens standing leg',
        'Enhances focus and concentration',
        'Builds mental clarity'
      ],
      breathing: 'Calm, steady breathing to maintain balance'
    },
    {
      id: 'child-pose',
      name: 'Child\'s Pose',
      sanskritName: 'Balasana',
      category: 'Restorative',
      difficulty: 'Beginner',
      duration: '3-5 minutes',
      targetMuscles: ['Back', 'Hips', 'Shoulders'],
      description: 'Restorative pose that calms the mind and stretches the back.',
      keyPoints: [
        'Kneel on the floor',
        'Sit back on heels',
        'Fold forward, arms extended',
        'Rest forehead on ground'
      ],
      benefits: [
        'Relieves stress and tension',
        'Stretches back and hips',
        'Calms the nervous system',
        'Promotes relaxation'
      ],
      breathing: 'Slow, deep breathing to relax'
    },
    {
      id: 'cobra-pose',
      name: 'Cobra Pose',
      sanskritName: 'Bhujangasana',
      category: 'Backbend',
      difficulty: 'Beginner',
      duration: '2-3 minutes',
      targetMuscles: ['Back', 'Chest', 'Shoulders'],
      description: 'Backbend that strengthens the spine and opens the chest.',
      keyPoints: [
        'Lie face down on mat',
        'Place hands under shoulders',
        'Press up, lifting chest',
        'Keep hips on ground'
      ],
      benefits: [
        'Strengthens spine and back',
        'Opens chest and shoulders',
        'Improves posture',
        'Relieves back pain'
      ],
      breathing: 'Inhale to lift, exhale to lower'
    },
    {
      id: 'bridge-pose',
      name: 'Bridge Pose',
      sanskritName: 'Setu Bandhasana',
      category: 'Backbend',
      difficulty: 'Beginner',
      duration: '3-5 minutes',
      targetMuscles: ['Glutes', 'Back', 'Core', 'Legs'],
      description: 'Backbend that strengthens the posterior chain and opens the chest.',
      keyPoints: [
        'Lie on back, knees bent',
        'Lift hips up off ground',
        'Keep knees over ankles',
        'Interlace fingers under body'
      ],
      benefits: [
        'Strengthens glutes and back',
        'Opens chest and shoulders',
        'Improves spinal flexibility',
        'Relieves stress'
      ],
      breathing: 'Deep breathing while holding the pose'
    },
    {
      id: 'triangle-pose',
      name: 'Triangle Pose',
      sanskritName: 'Trikonasana',
      category: 'Standing',
      difficulty: 'Intermediate',
      duration: '3-5 minutes',
      targetMuscles: ['Legs', 'Hips', 'Side Body', 'Core'],
      description: 'Standing pose that stretches the sides and improves flexibility.',
      keyPoints: [
        'Stand with feet wide apart',
        'Turn one foot out 90 degrees',
        'Reach down to shin or floor',
        'Other arm reaches up'
      ],
      benefits: [
        'Stretches sides and legs',
        'Improves flexibility',
        'Strengthens core',
        'Enhances balance'
      ],
      breathing: 'Steady breathing while in the pose'
    },
    {
      id: 'pigeon-pose',
      name: 'Pigeon Pose',
      sanskritName: 'Eka Pada Rajakapotasana',
      category: 'Hip Opener',
      difficulty: 'Intermediate',
      duration: '3-5 minutes',
      targetMuscles: ['Hips', 'Glutes', 'Back'],
      description: 'Hip-opening pose that releases tension and improves flexibility.',
      keyPoints: [
        'Start in downward dog',
        'Bring one knee forward',
        'Extend other leg back',
        'Lower to forearms for deeper stretch'
      ],
      benefits: [
        'Opens hips and releases tension',
        'Improves flexibility',
        'Relieves lower back pain',
        'Calms the mind'
      ],
      breathing: 'Deep, slow breathing to relax into the stretch'
    },
    {
      id: 'cat-cow-pose',
      name: 'Cat-Cow Pose',
      sanskritName: 'Marjaryasana-Bitilasana',
      category: 'Flow',
      difficulty: 'Beginner',
      duration: '2-3 minutes',
      targetMuscles: ['Spine', 'Core', 'Back'],
      description: 'Gentle flow that warms up the spine and improves flexibility.',
      keyPoints: [
        'Start on hands and knees',
        'Arch back and look up (cow)',
        'Round spine and look down (cat)',
        'Flow between poses smoothly'
      ],
      benefits: [
        'Warms up the spine',
        'Improves spinal flexibility',
        'Relieves back tension',
        'Prepares body for other poses'
      ],
      breathing: 'Inhale for cow, exhale for cat'
    },
    {
      id: 'corpse-pose',
      name: 'Corpse Pose',
      sanskritName: 'Savasana',
      category: 'Restorative',
      difficulty: 'Beginner',
      duration: '5-10 minutes',
      targetMuscles: ['Full Body', 'Mind'],
      description: 'Final relaxation pose that integrates the benefits of practice.',
      keyPoints: [
        'Lie flat on back',
        'Arms at sides, palms up',
        'Close eyes and relax completely',
        'Focus on breathing'
      ],
      benefits: [
        'Deep relaxation and stress relief',
        'Integrates practice benefits',
        'Calms the nervous system',
        'Promotes mindfulness'
      ],
      breathing: 'Natural, relaxed breathing'
    }
  ];

  const categories = ['all', 'Standing', 'Inverted', 'Balance', 'Restorative', 'Backbend', 'Hip Opener', 'Flow'];

  const filteredPoses = selectedCategory === 'all' 
    ? yogaPoses 
    : yogaPoses.filter(pose => pose.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-orange-600 bg-orange-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Standing': return <Target className="w-4 h-4" />;
      case 'Inverted': return <Zap className="w-4 h-4" />;
      case 'Balance': return <Star className="w-4 h-4" />;
      case 'Restorative': return <Heart className="w-4 h-4" />;
      case 'Backbend': return <TrendingUp className="w-4 h-4" />;
      case 'Hip Opener': return <Leaf className="w-4 h-4" />;
      case 'Flow': return <Sun className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const handleStartPose = (pose: YogaPose) => {
    onSelectPose(pose);
    onNavigate('analyzer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full mb-8">
            <Leaf className="w-5 h-5" />
            <span className="font-semibold">AI-Powered Yoga Practice</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Yoga Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover ancient wisdom through modern AI analysis. Practice traditional yoga poses with real-time form correction and personalized guidance.
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
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-xl'
                  : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {category === 'all' ? 'All Poses' : category}
            </button>
          ))}
        </div>

        {/* Yoga Pose Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPoses.map((pose) => (
            <div key={pose.id} className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden card-hover border border-gray-100">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-500 px-8 py-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">{pose.name}</h3>
                  <p className="text-green-100 text-lg font-medium mb-3">{pose.sanskritName}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getDifficultyColor(pose.difficulty)}`}>
                      {pose.difficulty}
                    </span>
                    <div className="flex items-center space-x-2 text-white">
                      {getCategoryIcon(pose.category)}
                      <span className="text-sm font-medium">{pose.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{pose.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Target className="w-4 h-4" />
                    <span className="text-sm font-medium">{pose.targetMuscles.length} areas</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">{pose.description}</p>

                {/* Benefits */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Benefits
                  </h4>
                  <ul className="space-y-1">
                    {pose.benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Breathing */}
                <div className="mb-6 p-4 bg-green-50 rounded-xl">
                  <h4 className="text-sm font-bold text-green-800 mb-2 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Breathing
                  </h4>
                  <p className="text-sm text-green-700">{pose.breathing}</p>
                </div>

                {/* Key Points */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Key Points</h4>
                  <ul className="space-y-1">
                    {pose.keyPoints.slice(0, 3).map((point, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleStartPose(pose)}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 group"
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Start Practice</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="w-6 h-6 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">AI Yoga Analysis</span>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              Each pose is analyzed in real-time using advanced computer vision to provide instant feedback on your alignment, breathing, and form. 
              Practice with confidence knowing our AI will guide you to perfect your yoga practice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
