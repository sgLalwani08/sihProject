import React from 'react';
import { Play, Target, Mic, TrendingUp, Zap, Brain, CheckCircle, ArrowRight, Leaf } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Analysis",
      description: "Advanced computer vision and machine learning algorithms provide real-time posture analysis",
      highlight: "AI-Powered"
    },
    {
      icon: <Mic className="w-8 h-8 text-green-500" />,
      title: "Voice Coaching",
      description: "Personal AI trainer provides instant audio feedback and corrections to perfect your form",
      highlight: "Real-time Feedback"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
      title: "Smart Progress",
      description: "Comprehensive analytics track your improvement with detailed insights and personalized recommendations",
      highlight: "Data-Driven"
    }
  ];


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-800 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-green-400/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400/20 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold">Powered by Advanced AI</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              Perfect Your Form with
              <span className="block gradient-text text-6xl md:text-7xl">
                AI-Powered Coaching
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience the future of fitness with real-time posture analysis, voice-guided corrections, and personalized AI coaching - completely free for everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={() => onNavigate('analyzer')}
                className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center space-x-3"
              >
                <Play className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span>Start Live Analysis</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => onNavigate('exercises')}
                className="glass-effect text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Target className="w-6 h-6" />
                <span>Browse Exercises</span>
              </button>
              
              <button
                onClick={() => onNavigate('yoga')}
                className="glass-effect text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Leaf className="w-6 h-6" />
                <span>Practice Yoga</span>
              </button>
            </div>
            
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Revolutionary Fitness Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Combine cutting-edge AI with professional fitness expertise for the ultimate training experience that adapts to your unique needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 card-hover">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 w-fit mb-8 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {feature.highlight}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        {/* Animated elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-8">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-semibold text-white">100% Free for Everyone</span>
            </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Ready to Transform Your Workouts?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of fitness with AI-powered posture analysis and real-time coaching - completely free for everyone
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => onNavigate('analyzer')}
              className="group bg-white text-blue-600 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-3"
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Start Analysis</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="text-white/80 text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completely free</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>No registration required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}