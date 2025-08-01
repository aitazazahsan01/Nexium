'use client';

import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { Recipe } from './MainApp';
import { motion, AnimatePresence } from 'framer-motion';

interface RecipeFormProps {
  session: Session | null;
  onRecipeGenerated: (recipe: Recipe) => void;
}

export default function RecipeForm({ session, onRecipeGenerated }: RecipeFormProps) {
  const [ingredients, setIngredients] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError("Please sign in to generate recipes.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, dietaryRestrictions })
      });
      if (!response.ok) throw new Error(`AI service failed: ${response.statusText}`);
      const rawResponse = await response.json();
      const recipeString = rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!recipeString) throw new Error("Could not find recipe in AI response.");
      const aiResponse = JSON.parse(recipeString);
      const { title, recipe: recipe_text } = aiResponse;
      if (!title || !recipe_text) throw new Error("AI response missing title or recipe text.");

      const newRecipe: Omit<Recipe, 'id' | 'created_at'> = { title, recipe_text, ingredients, user_id: session.user.id };
      const { data, error: insertError } = await supabase.from('recipes').insert(newRecipe).select().single();
      if (insertError) throw insertError;
      onRecipeGenerated(data);
      setIngredients('');
      setDietaryRestrictions('');
    } catch (error: any) {
      setError(`Failed to generate recipe: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative glass-card p-8 rounded-2xl shadow-xl mb-12 border-2 border-white/20">
      <button
        onClick={() => setShowInstructions(!showInstructions)}
        className="absolute top-4 right-4 h-10 w-10 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center font-bold text-xl hover:bg-purple-300 transition-colors"
      >
        ?
      </button>
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-indigo-100 text-indigo-800 rounded-lg"
          >
            <h4 className="font-bold">How it works:</h4>
            <p className="text-sm">1. Enter the ingredients you have on hand.</p>
            <p className="text-sm">2. Add any dietary needs like "vegan" or "gluten-free".</p>
            <p className="text-sm">3. The AI will invent a custom recipe just for you!</p>
          </motion.div>
        )}
      </AnimatePresence>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="ingredients" className="block text-lg font-bold text-gray-700 mb-2">What ingredients do you have?</label>
          <input id="ingredients" type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="e.g., chicken breast, tomatoes, rice" required className="w-full px-4 py-3 text-gray-700 bg-white/80 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" />
        </div>
        <div>
          <label htmlFor="dietary" className="block text-lg font-bold text-gray-700 mb-2">Any dietary restrictions?</label>
          <input id="dietary" type="text" value={dietaryRestrictions} onChange={(e) => setDietaryRestrictions(e.target.value)} placeholder="e.g., vegan, gluten-free, low-carb" className="w-full px-4 py-3 text-gray-700 bg-white/80 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" />
        </div>
        <button type="submit" disabled={loading || !session} className="w-full py-4 px-4 text-white font-bold rounded-lg btn-primary text-xl">
          {loading ? 'Conjuring a masterpiece...' : 'Generate Recipe'}
        </button>
        {error && <p className="text-center text-sm text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}
