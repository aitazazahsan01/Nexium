// app/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useInView, motion } from 'framer-motion'; // Import motion for animations
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Import Shadcn Select components

// Define the type for a single quote object
interface Quote {
  topic: string;
  quote: string;
}

// Quotes data directly embedded in the file
const quotesData: Quote[] = [
  { "topic": "inspiration", "quote": "The only way to do great work is to love what you do." },
  { "topic": "inspiration", "quote": "Believe you can and you're halfway there." },
  { "topic": "inspiration", "quote": "The future belongs to those who believe in the beauty of their dreams." },
  { "topic": "inspiration", "quote": "Success is not final, failure is not fatal: it is the courage to continue that counts." },
  { "topic": "inspiration", "quote": "The only place where success comes before work is in the dictionary." },
  { "topic": "inspiration", "quote": "Your most unhappy customers are your greatest source of learning." },
  { "topic": "life", "quote": "Life is what happens when you're busy making other plans." },
  { "topic": "life", "quote": "The unexamined life is not worth living." },
  { "topic": "life", "quote": "In the end, it's not the years in your life that count. It's the life in your years." },
  { "topic": "life", "quote": "The purpose of our lives is to be happy." },
  { "topic": "life", "quote": "You only live once, but if you do it right, once is enough." },
  { "topic": "life", "quote": "Many of life's failures are people who did not realize how close they were to success when they gave up." },
  { "topic": "technology", "quote": "Any sufficiently advanced technology is indistinguishable from magic." },
  { "topic": "technology", "quote": "The advance of technology is based on making it fit in so that you don't even notice it, so it's part of everyday life." },
  { "topic": "technology", "quote": "It has become appallingly obvious that our technology has exceeded our humanity." },
  { "topic": "technology", "quote": "The Internet is like a huge library, except all the books are on the floor." },
  { "topic": "technology", "quote": "The great myth of our time is that technology is communication." },
  { "topic": "happiness", "quote": "Happiness is not something ready made. It comes from your own actions." },
  { "topic": "happiness", "quote": "The greatest happiness you can have is knowing that you do not necessarily require happiness." },
  { "topic": "happiness", "quote": "For every minute you are angry you lose sixty seconds of happiness." },
  { "topic": "happiness", "quote": "The only joy in the world is to begin." },
  { "topic": "happiness", "quote": "Be happy for this moment. This moment is your life." },
  { "topic": "love", "quote": "Where there is love there is life." },
  { "topic": "love", "quote": "The best thing to hold onto in life is each other." },
  { "topic": "love", "quote": "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that." },
  { "topic": "friendship", "quote": "A true friend is someone who is there for you when he'd rather be anywhere else." },
  { "topic": "friendship", "quote": "Friendship is born at that moment when one person says to another: 'What! You too? I thought I was the only one.'" },
  { "topic": "wisdom", "quote": "The only true wisdom is in knowing you know nothing." },
  { "topic": "wisdom", "quote": "Knowing yourself is the beginning of all wisdom." },
  { "topic": "change", "quote": "The only constant in life is change." },
  { "topic": "change", "quote": "Be the change that you wish to see in the world." }
];

// Extract unique topics for the dropdown
const uniqueTopics = Array.from(new Set(quotesData.map(q => q.topic)))
  .sort()
  .map(topic => ({
    value: topic,
    label: topic.charAt(0).toUpperCase() + topic.slice(1) // Capitalize for display
  }));

// Define the schema for form validation using Zod
const formSchema = z.object({
  topic: z.string().min(1, { // Changed to min(1) as dropdown will always have a value
    message: 'Please select a topic.',
  }),
});


export default function HomePage() {
  // State to store the quotes generated after form submission
  const [generatedQuotes, setGeneratedQuotes] = useState<Quote[]>([]);

  // Ref for the form section to detect when it's in view for animation
  const formRef = useRef<HTMLElement>(null);
  // useInView hook from framer-motion to trigger animation when form is visible
  const isInView = useInView(formRef, { once: true, amount: 0.5 }); // Trigger when 50% of the form is visible

  // Initialize react-hook-form with Zod resolver for validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '', // Default value for the topic input
    },
  });

  // Function to handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    const topic = values.topic.toLowerCase(); // Convert input topic to lowercase for case-insensitive search

    // Filter quotes based on the selected topic
    const filteredQuotes = quotesData.filter((q) =>
      q.topic.toLowerCase() === topic // Exact match for dropdown selection
    );

    // Get 3 random quotes from the filtered list
    // 1. Shuffle the array to get random order
    const shuffled = filteredQuotes.sort(() => 0.5 - Math.random());
    // 2. Take the first 3 elements
    const selectedQuotes = shuffled.slice(0, 3);

    // Update the state with the selected quotes
    setGeneratedQuotes(selectedQuotes);
  }

  // Animation variants for personal info section
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger animation for children
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 font-inter text-gray-900">

      {/* Personal Info Section */}
      <motion.section
        className="text-center mb-16 md:mb-24 max-w-3xl p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-2xl border border-blue-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow-lg">
          Muhammad Aitazaz Ahsan
        </motion.h1>
        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-700 mb-2">
          Student at <span className="font-semibold text-indigo-600">NUST</span>
        </motion.p>
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 mb-2">
          <span className="font-medium text-purple-600">Nexium Remote Internship</span>
        </motion.p>
        <motion.p variants={itemVariants} className="text-md md:text-lg text-gray-500">
          Assignment 1
        </motion.p>
      </motion.section>

      {/* Welcome Section */}
      <section className="text-center mb-20 md:mb-32 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Inspire Your Day
        </h1>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
          Unlock a world of wisdom and motivation. Simply select a topic, and
          we ll deliver insightful quotes to brighten your moment.
        </p>
      </section>

      {/* Form Section */}
      <section
        ref={formRef} // Attach ref for scroll-based animation
        className={`w-full max-w-md bg-white p-8 rounded-lg shadow-xl transform transition-all duration-1000 ease-out ${
          isInView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0' // Animation classes
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          What Topic Are You Looking For?
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Topic</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {uniqueTopics.map((topic) => (
                        <SelectItem key={topic.value} value={topic.value}>
                          {topic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200 hover:scale-[1.02] active:scale-[0.98] transform"
            >
              Generate Quotes
            </Button>
          </form>
        </Form>
      </section>

      {/* Display Quotes Section */}
      {generatedQuotes.length > 0 && (
        <section className="mt-16 w-full max-w-2xl">
          <Separator className="my-8 bg-blue-300 h-1 rounded-full" />
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Your Quotes
          </h2>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-white shadow-lg">
            <div className="space-y-6">
              {generatedQuotes.map((q, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered animation for quotes
                >
                  <Card
                    className="bg-gray-50 border border-gray-200 shadow-sm transition-transform duration-300 hover:scale-[1.01] hover:shadow-md"
                  >
                    <CardHeader>
                      <CardTitle className="text-blue-700 text-lg">
                        Topic: {q.topic.charAt(0).toUpperCase() + q.topic.slice(1)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-800 text-xl italic leading-relaxed">
                        {q.quote}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </section>
      )}
    </div>
  );
}
