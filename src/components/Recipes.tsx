"use client";

import React from "react";
import { motion } from "motion/react";
import { Search, Plus } from "lucide-react";
import { Recipe } from "@/types";

const Recipes: React.FC = () => {
  const recipes: Recipe[] = [
    {
      id: 1,
      title: "Classic Margherita Pizza",
      time: "45 min",
      difficulty: "Easy",
      image: "https://picsum.photos/seed/pizza/400/300",
    },
    {
      id: 2,
      title: "Creamy Mushroom Risotto",
      time: "35 min",
      difficulty: "Medium",
      image: "https://picsum.photos/seed/risotto/400/300",
    },
    {
      id: 3,
      title: "Honey Glazed Salmon",
      time: "20 min",
      difficulty: "Easy",
      image: "https://picsum.photos/seed/salmon/400/300",
    },
    {
      id: 4,
      title: "Thai Green Curry",
      time: "40 min",
      difficulty: "Medium",
      image: "https://picsum.photos/seed/curry/400/300",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Recipes
        </h2>
        <button className="w-full sm:w-auto bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-700 transition-colors">
          <Plus size={20} />
          <span>Add Recipe</span>
        </button>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search recipes..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="h-40 overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{recipe.title}</h3>
              <div className="flex items-center text-xs text-gray-500 space-x-3">
                <span>{recipe.time}</span>
                <span>•</span>
                <span>{recipe.difficulty}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Recipes;
