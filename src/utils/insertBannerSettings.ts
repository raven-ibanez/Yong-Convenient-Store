import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertBannerSettings() {
  try {
    console.log('Inserting banner toggle settings...');
    
    const bannerSettings = [
      {
        id: 'banner_pickup_enabled',
        value: 'true',
        type: 'boolean',
        description: 'Enable/disable pickup promotional banner'
      },
      {
        id: 'banner_delivery_enabled',
        value: 'true',
        type: 'boolean',
        description: 'Enable/disable delivery schedule banner'
      },
      {
        id: 'banner_payday_enabled',
        value: 'true',
        type: 'boolean',
        description: 'Enable/disable payday specials banner'
      }
    ];

    for (const setting of bannerSettings) {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert(setting, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error inserting ${setting.id}:`, error);
      } else {
        console.log(`Successfully inserted/updated ${setting.id}`);
      }
    }
    
    console.log('Banner settings insertion completed!');
  } catch (error) {
    console.error('Error inserting banner settings:', error);
  }
}

// Run the function
insertBannerSettings();
