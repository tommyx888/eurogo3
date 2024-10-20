import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdxwgpksdklwndybmgvc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkeHdncGtzZGtsd25keWJtZ3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwNjg1MTAsImV4cCI6MjA0MzY0NDUxMH0.Orb_zAtH7p92OfCRY4czb6GPwfQ1reUvU1KauX-2RtU';

export const supabase = createClient(supabaseUrl, supabaseKey);

export function useSupabaseClient() {
  return supabase;
}
