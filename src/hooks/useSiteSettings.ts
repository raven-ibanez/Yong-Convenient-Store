import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SiteSettings, SiteSetting } from '../types';

export const useSiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSiteSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('id');

      if (error) throw error;

      // Transform the data into a more usable format
      const settings: SiteSettings = {
        site_name: data.find(s => s.id === 'site_name')?.value || 'Beracah Cafe',
        site_logo: data.find(s => s.id === 'site_logo')?.value || '',
        site_description: data.find(s => s.id === 'site_description')?.value || '',
        currency: data.find(s => s.id === 'currency')?.value || 'PHP',
        currency_code: data.find(s => s.id === 'currency_code')?.value || 'PHP',
        footer_address: data.find(s => s.id === 'footer_address')?.value || '123 Main Street\nCity, Province 1234\nPhilippines',
        footer_phone: data.find(s => s.id === 'footer_phone')?.value || '+63 912 345 6789',
        footer_email: data.find(s => s.id === 'footer_email')?.value || 'info@yongconvenience.com',
        footer_business_hours: data.find(s => s.id === 'footer_business_hours')?.value || 'Mon - Sun: 6:00 AM - 10:00 PM\nOpen 7 days a week',
        promo_pickup_title: data.find(s => s.id === 'promo_pickup_title')?.value || 'PICK-UP HIGHLIGHT',
        promo_pickup_subtitle: data.find(s => s.id === 'promo_pickup_subtitle')?.value || 'GET P200 OFF WHEN YOU PICK UP YOUR ORDER!',
        promo_pickup_code: data.find(s => s.id === 'promo_pickup_code')?.value || 'PICKUPSEPTEMBER',
        promo_pickup_dates: data.find(s => s.id === 'promo_pickup_dates')?.value || 'September 15 & 30',
        promo_pickup_min_purchase: data.find(s => s.id === 'promo_pickup_min_purchase')?.value || 'P1,500',
        promo_delivery_title: data.find(s => s.id === 'promo_delivery_title')?.value || 'Delivery Schedule',
        promo_delivery_subtitle: data.find(s => s.id === 'promo_delivery_subtitle')?.value || 'Orders received before 11am Same Day Delivery',
        promo_payday_title: data.find(s => s.id === 'promo_payday_title')?.value || 'PAYDAY SPECIALS',
        promo_payday_subtitle: data.find(s => s.id === 'promo_payday_subtitle')?.value || 'FREE DELIVERY',
        promo_payday_code: data.find(s => s.id === 'promo_payday_code')?.value || 'SAHODNASEP',
        promo_payday_dates: data.find(s => s.id === 'promo_payday_dates')?.value || 'on September 15 and 30, 2025 with a min. spend of P3,000',
        promo_payday_min_purchase: data.find(s => s.id === 'promo_payday_min_purchase')?.value || 'P3,000',
        // Banner visibility toggles (check if setting exists, default to true if not)
        banner_pickup_enabled: (() => {
          const setting = data.find(s => s.id === 'banner_pickup_enabled');
          return setting ? setting.value === 'true' : true;
        })(),
        banner_delivery_enabled: (() => {
          const setting = data.find(s => s.id === 'banner_delivery_enabled');
          return setting ? setting.value === 'true' : true;
        })(),
        banner_payday_enabled: (() => {
          const setting = data.find(s => s.id === 'banner_payday_enabled');
          return setting ? setting.value === 'true' : true;
        })(),
        // Pricing note (optional)
        pricing_note: data.find(s => s.id === 'pricing_note')?.value || 'Note: For the Wholesale Price and Bulk Order Price, Please contact the General Manager.'
      };

      setSiteSettings(settings);
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch site settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSiteSetting = async (id: string, value: string) => {
    try {
      setError(null);

      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('id', id);

      if (error) throw error;

      // Refresh the settings
      await fetchSiteSettings();
    } catch (err) {
      console.error('Error updating site setting:', err);
      setError(err instanceof Error ? err.message : 'Failed to update site setting');
      throw err;
    }
  };

  const insertBannerSettings = async () => {
    try {
      setError(null);
      console.log('Inserting banner settings...');

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
        },
        // Ensure pricing_note exists as well
        {
          id: 'pricing_note',
          value: 'Note: For the Wholesale Price and Bulk Order Price, Please contact the General Manager.',
          type: 'text',
          description: 'Informational pricing note displayed to customers'
        }
      ];

      for (const setting of bannerSettings) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(setting, { onConflict: 'id' });
        
        if (error) {
          console.error(`Error inserting ${setting.id}:`, error);
          throw new Error(`Failed to insert ${setting.id}: ${error.message}`);
        }
      }
      
      // Refresh the settings
      await fetchSiteSettings();
      console.log('Banner settings inserted successfully!');
    } catch (err) {
      console.error('Error inserting banner settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to insert banner settings');
      throw err;
    }
  };

  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    try {
      setError(null);

      const updatePromises = Object.entries(updates).map(([key, value]) => {
        // Convert boolean values to strings for database storage
        const stringValue = typeof value === 'boolean' ? value.toString() : value;
        return supabase
          .from('site_settings')
          .update({ value: stringValue })
          .eq('id', key);
      });

      const results = await Promise.all(updatePromises);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Update errors:', errors);
        throw new Error(`Some updates failed: ${errors.map(e => e.error?.message).join(', ')}`);
      }

      // Refresh the settings
      await fetchSiteSettings();
    } catch (err) {
      console.error('Error updating site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update site settings');
      throw err;
    }
  };

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  return {
    siteSettings,
    loading,
    error,
    updateSiteSetting,
    updateSiteSettings,
    insertBannerSettings,
    refetch: fetchSiteSettings
  };
};
