"use client";

import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Plans: React.FC = () => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const meals = ["Breakfast", "Lunch", "Dinner"];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Meal Plans
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-1">
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium px-2">Apr 6 - Apr 12</span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight size={20} />
            </button>
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
            Generate Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day} className="space-y-3 sm:space-y-4">
            <h3 className="text-left sm:text-center font-bold text-gray-700 text-xs sm:text-sm uppercase tracking-wider border-b border-gray-100 sm:border-0 pb-1 sm:pb-0">
              {day}
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {meals.map((meal) => (
                <div
                  key={meal}
                  className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm min-h-[80px] sm:min-h-[100px] hover:border-orange-200 transition-colors cursor-pointer"
                >
                  <p className="text-[10px] font-bold text-orange-500 uppercase mb-1">
                    {meal}
                  </p>
                  <p className="text-xs text-gray-400 italic">
                    No meal planned
                  </p>
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
