import React from 'react';
import { Activity, Menu, X, Sparkles, Zap, Leaf } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'exercises', label: 'Exercises' },
    { id: 'yoga', label: 'Yoga' },
    { id: 'analyzer', label: 'AI Analysis' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 p-3 rounded-2xl shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold gradient-text">
                FitForm Pro
              </span>
              <span className="text-xs text-gray-500 font-medium">AI-Powered Coaching</span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative group ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
                }`}
              >
                {currentPage === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-20 animate-pulse-slow"></div>
                )}
                <div className="relative z-10 flex items-center space-x-2">
                  {item.id === 'yoga' && <Leaf className="w-4 h-4" />}
                  {item.id === 'analyzer' && <Zap className="w-4 h-4" />}
                  {item.id === 'progress' && <Sparkles className="w-4 h-4" />}
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-left transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}