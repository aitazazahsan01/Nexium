'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';

export default function AuthComponent() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setMessage('Success! Check your email for the magic login link.');
    } catch (error: any) {
      setMessage(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center animated-gradient p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-6 glass-card rounded-2xl shadow-2xl"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">Welcome Back!</h2>
          <p className="mt-2 text-gray-200">Enter your email to receive a magic link.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-lg text-gray-700 bg-white border-2 border-transparent rounded-lg focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 px-4 text-lg font-bold rounded-lg btn-primary">
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        {message && <p className={`text-center font-semibold mt-4 ${message.includes('Success') ? 'text-green-300' : 'text-yellow-300'}`}>{message}</p>}
      </motion.div>
    </div>
  );
}
