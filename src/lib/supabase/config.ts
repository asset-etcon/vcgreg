const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

export const supabaseUrl = url;
export const supabaseAnonKey = anonKey;

export const isSupabaseConfigured =
  url.startsWith("http") && anonKey.length > 0;
