// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://gmoqttcckgjxcrophegm.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_eTLh6IdiKQzUMkn2PJr6GA_9MxNZbt_';
const MERCHANT_ID = '1235407';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials are missing. Please add them to admin/js/supabase.js');
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for other scripts to use
window.supabaseClient = supabaseClient;

