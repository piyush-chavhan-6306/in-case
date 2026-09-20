import { createClient } from '@supabase/supabase-js';

// Resilient Supabase client with defaults to prevent browser white-screen crashes if env vars are delayed
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  'https://zvrozvsmggujrodnxstj.supabase.co';

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2cm96dnNtZ2d1anJvZG54c3RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MDUxMTQsImV4cCI6MjEwNTQ4MTExNH0.fwjDzsY97XCAQdEfBffNgcaF43U_4VFByYddZ-0XIBM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
