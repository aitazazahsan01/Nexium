// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Languages, AlertTriangle, ArrowDown, History } from 'lucide-react';

type SummaryResult = {
  summary_en: string;
  summary_ur: string;
};

type RecentSummary = {
  id: number;
  created_at: string;
  url: string;
  summary_en: string;
  summary_ur: string;
};

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSummaries, setRecentSummaries] = useState<RecentSummary[]>([]);

  // Fetch recent summaries on page load
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await fetch('/api/recent');
        if (!response.ok) return;
        const data: RecentSummary[] = await response.json();
        setRecentSummaries(data);
      } catch (e) {
        console.error("Could not fetch recent summaries");
      }
    };
    fetchRecent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a blog URL.');
      return;
    }
    setIsLoading(true);
    setSummary(null);
    setError(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong!');
      }

      const data: SummaryResult = await response.json();
      setSummary(data);
      
      // Refresh recent summaries list
      const recentResponse = await fetch('/api/recent');
      const recentData = await recentResponse.json();
      setRecentSummaries(recentData);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Animation variants for Framer Motion
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-y-auto">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center p-4 relative">
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-7xl font-bold tracking-tight">
            Muhammad Aitazaz Ahsan
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-4 text-xl sm:text-2xl text-cyan-400">
            Student of NUST
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <div className="inline-block bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/30">
              <p className="text-lg">Nexium Remote Internship - Assignment 2</p>
            </div>
          </motion.div>
        </motion.div>
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10"
        >
            <ArrowDown className="w-8 h-8 animate-bounce text-cyan-400" />
        </motion.div>
      </section>

      {/* Main Content Section */}
      <main className="w-full max-w-4xl mx-auto p-4 sm:p-8">
        
        {/* Summarizer Card */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Card className="shadow-2xl bg-gray-900/50 border-gray-700/50 backdrop-blur-md">
            <CardHeader className="text-center">
              <div className="flex justify-center items-center gap-3">
                  <Sparkles className="h-8 w-8 text-cyan-400" />
                  <CardTitle className="text-4xl font-bold">Blog Summarizer AI</CardTitle>
              </div>
              <CardDescription className="pt-2 text-gray-400">
                Paste any blog post URL to get a quick, intelligent summary.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="url"
                  placeholder="https://example.com/blog/my-post"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-grow bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold transition-all duration-300">
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : 'Generate Summary'}
                </Button>
              </form>
              <div className="mt-6 min-h-[150px]">
                <AnimatePresence>
                  {/* Result and Error Display Logic remains same but styled */}
                   {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-900/50 text-red-300 rounded-lg flex items-center gap-3 border border-red-500/50"
                    >
                      <AlertTriangle className="h-6 w-6"/>
                      <p>{error}</p>
                    </motion.div>
                  )}
                  {summary && (
                    <motion.div
                      key="summary"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }} className="space-y-4"
                    >
                      <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-700">
                        <h4 className="font-bold text-lg flex items-center gap-2"><Languages className="text-cyan-400"/> English Summary</h4>
                        <p className="mt-2 text-gray-300">{summary.summary_en}</p>
                      </div>
                      <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-700">
                        <h4 className="font-bold text-lg flex items-center gap-2"><Languages className="text-cyan-400"/> Urdu Summary</h4>
                        <p dir="rtl" className="mt-2 text-lg text-right font-urdu text-gray-200">{summary.summary_ur}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Recent Summaries Section */}
        {recentSummaries.length > 0 && (
          <motion.section
            className="mt-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
              <History className="text-cyan-400" />
              Recently Summarized
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {recentSummaries.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={item.id} className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm rounded-lg mb-2 px-4">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex flex-col sm:flex-row justify-between w-full pr-4">
                      <span className="font-semibold truncate max-w-[200px] sm:max-w-md">{item.url}</span>
                      <span className="text-sm text-gray-400 mt-1 sm:mt-0">
                        {new Date(item.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 space-y-4">
                    <div>
                      <h4 className="font-bold text-cyan-400">English:</h4>
                      <p className="text-sm text-gray-300">{item.summary_en}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-cyan-400">Urdu:</h4>
                      <p dir="rtl" className="text-right font-urdu text-gray-200">{item.summary_ur}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.section>
        )}
      </main>

      <footer className="text-center p-4 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Muhammad Aitazaz Ahsan. All Rights Reserved.
      </footer>
    </div>
  );
}