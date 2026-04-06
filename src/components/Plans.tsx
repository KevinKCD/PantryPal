import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Plans: React.FC = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = ['Breakfast', 'Lunch', 'Dinner'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Meal Plans</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1">
            <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={20} /></button>
            <span className="text-sm font-medium px-2">Apr 6 - Apr 12</span>
            <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20} /></button>
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Generate Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day} className="space-y-4">
            <h3 className="text-center font-bold text-gray-700 text-sm uppercase tracking-wider">{day}</h3>
            <div className="space-y-3">
              {meals.map((meal) => (
                <div key={meal} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm min-h-[100px] hover:border-orange-200 transition-colors cursor-pointer">
                  <p className="text-[10px] font-bold text-orange-500 uppercase mb-1">{meal}</p>
                  <p className="text-xs text-gray-400 italic">No meal planned</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Plans;
