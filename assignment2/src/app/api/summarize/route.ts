// app/api/summarize/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import clientPromise from '@/lib/mongodb';
import { generateFrequencySummary } from '@/lib/summarizer'; // <-- IMPORT NEW SUMMARIZER
import { translate } from '@vitalets/google-translate-api'; // <-- IMPORT NEW TRANSLATOR

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Scrape the blog content
    const { data: html } = await axios.get(url, {
      headers: { // Add headers to mimic a browser
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(html);
    
    // Improved text extraction
    $('script, style, noscript').remove();
    let fullText = '';
    $('p').each((_, element) => {
      fullText += $(element).text() + '\n';
    });

    if (!fullText || fullText.trim().length < 200) { // Check if we got enough text
      fullText = $('body').text(); // Fallback to grabbing all text from the body
    }

    if (!fullText) {
      return NextResponse.json({ error: 'Could not extract text from the URL.' }, { status: 400 });
    }

    // 2. Generate a much better summary
    const summary_en = generateFrequencySummary(fullText, 3); // <-- USE THE NEW FUNCTION

    if (!summary_en) {
        return NextResponse.json({ error: 'Failed to generate a summary from the content.' }, { status: 500 });
    }
    
    // 3. Translate using the professional service
    const { text: summary_ur } = await translate(summary_en, { to: 'ur' }); // <-- USE THE NEW TRANSLATOR

    // 4. Save to databases
    const mongoClient = await clientPromise;
    const db = mongoClient.db(process.env.MONGODB_DB_NAME);
    await db.collection('full_texts').insertOne({
      url,
      fullText,
      createdAt: new Date(),
    });

    const { error: supabaseError } = await supabase
      .from('summaries')
      .insert([{ url, summary_en, summary_ur }]);

    if (supabaseError) {
      // We still return the summary to the user even if DB save fails
      console.error(`Supabase Error: ${supabaseError.message}`);
    }

    // 5. Return the high-quality result
    return NextResponse.json({ summary_en, summary_ur });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API Error:', error);
    let errorMessage = 'Failed to process the request.';
    if (error.message.includes('403')) {
        errorMessage = 'Could not access the URL. The website may be blocking scrapers.';
    } else if (error.name === 'TooManyRequestsError') {
        errorMessage = 'Translation service is temporarily unavailable. Please try again later.';
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}