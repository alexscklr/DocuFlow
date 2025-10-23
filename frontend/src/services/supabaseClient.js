import { createClient } from '@supabase/supabase-js'

// Use Vite environment variables. Put these in frontend/.env as VITE_SUPABASE_URL and VITE_SUPABASE_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cgalcevskactqftzxrwc.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Export the client so other modules can import { supabase } from './services/supabaseClient'
export const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase