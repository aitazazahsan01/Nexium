'use client';

import { Recipe } from './MainApp';
import { motion } from 'framer-motion';

interface RecipeDisplayProps {
  recipe: Recipe;
  onSelect: () => void;
}

export default function RecipeDisplay({ recipe, onSelect }: RecipeDisplayProps) {
  return (
    <motion.div
      onClick={onSelect}
      className="glass-card p-6 rounded-2xl shadow-lg cursor-pointer h-full flex flex-col"
      whileHover={{ scale: 1.03, y: -5, boxShadow: "0px 10px 30px rgba(0,0,0,0.1)" }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.title}</h3>
      <p className="text-sm text-gray-600 mb-4 flex-grow">
        <strong className="text-gray-700">Based on:</strong> {recipe.ingredients}
      </p>
      <p className="text-xs text-gray-400 self-end">
        Created on: {new Date(recipe.created_at!).toLocaleDateString()}
      </p>
    </motion.div>
  );
}
