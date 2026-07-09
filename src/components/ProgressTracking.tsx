import React from 'react';
import { TrendingUp, Calendar, Award, Target, Activity, BarChart3, Star, Zap, Brain, CheckCircle, Trophy } from 'lucide-react';

export default function ProgressTracking() {
  const weeklyData = [
    { day: 'Mon', score: 78, exercises: 12 },
    { day: 'Tue', score: 85, exercises: 15 },
    { day: 'Wed', score: 82, exercises: 10 },
    { day: 'Thu', score: 90, exercises: 18 },
    { day: 'Fri', score: 88, exercises: 14 },
    { day: 'Sat', score: 92, exercises: 20 },
    { day: 'Sun', score: 87, exercises: 16 },
  ];

  const achievements = [
    { title: 'Perfect Form', description: '10 exercises with 90+ score', icon: '🎯', completed: true },
    { title: 'Consistency King', description: '7 days straight training', icon: '👑', completed: true },
    { title: 'Form Master', description: '100 exercises completed', icon: '🏆', completed: false },
    { title: 'Voice Assistant Pro', description: 'Used voice coaching 50 times', icon: '🎤', completed: true },
  ];

  const exerciseStats = [
    { name: 'Push-ups', sessions: 15, avgScore: 88, improvement: '+12%' },
    { name: 'Squats', sessions: 12, avgScore: 92, improvement: '+8%' },
    { name: 'Planks', sessions: 10, avgScore: 85, improvement: '+15%' },
    { name: 'Lunges', sessions: 8, avgScore: 81, improvement: '+10%' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full mb-8">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">Progress Dashboard</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Your Progress</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Track your improvement, celebrate achievements, and see how AI coaching is transforming your fitness journey
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 card-hover">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">142</div>
            <div className="text-gray-600 font-semibold text-lg">Total Exercises</div>
            <div className="flex items-center space-x-2 mt-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-semibold">+23 this week</span>
            </div>
          </div>

          <div className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 card-hover">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">87%</div>
            <div className="text-gray-600 font-semibold text-lg">Average Score</div>
            <div className="flex items-center space-x-2 mt-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-semibold">+5% improvement</span>
            </div>
          </div>

          <div className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 card-hover">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-orange-600 text-3xl">🔥</div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">7</div>
            <div className="text-gray-600 font-semibold text-lg">Day Streak</div>
            <div className="flex items-center space-x-2 mt-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-orange-600 font-semibold">Keep it up!</span>
            </div>
          </div>

          <div className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 card-hover">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-purple-600 text-3xl">✨</div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">12</div>
            <div className="text-gray-600 font-semibold text-lg">Achievements</div>
            <div className="flex items-center space-x-2 mt-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-purple-600 font-semibold">3 new this week</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Weekly Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Weekly Performance</h2>
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Form Score</span>
                      <span className={`text-sm font-medium ${getScoreColor(day.score)}`}>{day.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${day.score >= 85 ? 'bg-green-500' : day.score >= 70 ? 'bg-orange-500' : 'bg-red-500'}`}
                        style={{ width: `${day.score}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{day.exercises}</div>
                    <div className="text-xs text-gray-500">exercises</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`p-4 rounded-xl border-2 ${achievement.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${achievement.completed ? 'text-green-800' : 'text-gray-700'}`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${achievement.completed ? 'text-green-600' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.completed && (
                      <div className="bg-green-600 text-white p-1 rounded-full">
                        <Award className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exercise Statistics */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exercise Statistics</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exerciseStats.map((exercise, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-3">{exercise.name}</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sessions</span>
                    <span className="font-medium">{exercise.sessions}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Score</span>
                    <span className={`font-medium ${getScoreColor(exercise.avgScore)}`}>
                      {exercise.avgScore}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Improvement</span>
                    <span className="font-medium text-green-600">{exercise.improvement}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}