// app/api/recent/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 0; // Don't cache this route

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('summaries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5); // Get the 5 most recent summaries

    if (error) {
      throw new Error(`Supabase Error: ${error.message}`);
    }

    return NextResponse.json(data);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API Error fetching recent summaries:', error);
    return NextResponse.json({ error: 'Failed to fetch recent summaries.' }, { status: 500 });
  }
}