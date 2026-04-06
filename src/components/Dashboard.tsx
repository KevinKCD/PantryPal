'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header>
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, Chef!</h2>
        <p className="text-gray-500">Here's what's happening in your kitchen today.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pantry Items</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">42</p>
          <p className="text-xs text-green-600 mt-2">↑ 3 new this week</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Planned Meals</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">7</p>
          <p className="text-xs text-gray-500 mt-2">Next: Chicken Stir Fry</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Saved Recipes</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">128</p>
          <p className="text-xs text-orange-600 mt-2">Explore new ideas</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 py-2 border-b border-gray-50 last:border-0">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                🍳
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Added "Spicy Ramen" to lunch plans</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
