'use client';

import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import AuthComponent from './AuthComponent';
import RecipeForm from './RecipeForm';
import RecipeDisplay from './RecipeDisplay';
import RecipeDetailModal from './RecipeDetailModal';
import { AnimatePresence } from 'framer-motion';

// Define the Recipe type for type safety
export interface Recipe {
  id?: number;
  created_at?: string;
  user_id: string;
  title: string;
  ingredients: string;
  recipe_text: string;
}

export default function MainApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchRecipes();
    } else {
      setRecipes([]);
    }
  }, [session]);

  const fetchRecipes = async () => {
    if (!session) return;
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRecipes(data || []);
    } catch (error: any) {
      setError(`Error fetching recipes: ${error.message}`);
    }
  };

  const addRecipeToList = (newRecipe: Recipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        )}
      </AnimatePresence>

      {!session ? (
        <AuthComponent />
      ) : (
        <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-8 gap-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
                AI Recipe Generator
              </h1>
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition"
              >
                Logout
              </button>
            </header>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert"><p>{error}</p></div>}

            <RecipeForm session={session} onRecipeGenerated={addRecipeToList} />

            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Saved Recipe Book</h2>
              {recipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recipes.map((recipe) => (
                    <RecipeDisplay key={recipe.id} recipe={recipe} onSelect={() => setSelectedRecipe(recipe)} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 glass-card p-8 rounded-lg shadow-lg">Your recipe book is empty. Generate a recipe to get started!</p>
              )}
            </div>
          </div>
        </main>
      )}
    </>
  );
}
