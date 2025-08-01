'use client';

import { Recipe } from './MainApp';
import { motion } from 'framer-motion';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeDetailModal({ recipe, onClose }: RecipeDetailModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-gray-800">{recipe.title}</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          <strong className="text-gray-700">Original Ingredients:</strong> {recipe.ingredients}
        </p>
        <div className="prose max-w-none whitespace-pre-wrap text-gray-700">
          {recipe.recipe_text}
        </div>
      </motion.div>
    </motion.div>
  );
}
