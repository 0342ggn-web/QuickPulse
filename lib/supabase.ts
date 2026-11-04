import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ucxmcjgeygjbitiagqkz.supabase.co'
const supabaseAnonKey = 'sb_publishable_NEJymdUajrkNj6cFjJC6MA_SRXvaNhS'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)