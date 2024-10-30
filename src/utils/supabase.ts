// import { createClient } from '@supabase/supabase-js';

/*
// Initialize Supabase client
export const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

// Fetch quotes from Supabase
export const fetchQuotes = async (limit: number = 20): Promise<Quote[]> => {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .limit(limit)
    .order('random()');

  if (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }

  return data || [];
};
*/