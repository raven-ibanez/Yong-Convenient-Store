/*
  # Add Discount Pricing and Site Settings

  1. Menu Items Changes
    - Add `discount_price` (decimal, optional) - discounted price
    - Add `discount_start_date` (timestamp, optional) - when discount starts
    - Add `discount_end_date` (timestamp, optional) - when discount ends
    - Add `discount_active` (boolean) - whether discount is currently active

  2. New Tables
    - `site_settings`
      - `id` (text, primary key) - setting key
      - `value` (text) - setting value
      - `type` (text) - setting type (text, image, boolean, number)
      - `description` (text) - setting description
      - `updated_at` (timestamp)

  3. Security
    - Enable RLS on site_settings table
    - Add policies for public read access
    - Add policies for authenticated admin access
*/

-- Add discount pricing fields to menu_items table
DO $$
BEGIN
  -- Add discount_price column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menu_items' AND column_name = 'discount_price'
  ) THEN
    ALTER TABLE menu_items ADD COLUMN discount_price decimal(10,2);
  END IF;

  -- Add discount_start_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menu_items' AND column_name = 'discount_start_date'
  ) THEN
    ALTER TABLE menu_items ADD COLUMN discount_start_date timestamptz;
  END IF;

  -- Add discount_end_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menu_items' AND column_name = 'discount_end_date'
  ) THEN
    ALTER TABLE menu_items ADD COLUMN discount_end_date timestamptz;
  END IF;

  -- Add discount_active column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menu_items' AND column_name = 'discount_active'
  ) THEN
    ALTER TABLE menu_items ADD COLUMN discount_active boolean DEFAULT false;
  END IF;
END $$;

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id text PRIMARY KEY,
  value text NOT NULL,
  type text NOT NULL DEFAULT 'text',
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Anyone can read site settings" ON site_settings;
CREATE POLICY "Anyone can read site settings"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated admin access
DROP POLICY IF EXISTS "Authenticated users can manage site settings" ON site_settings;
CREATE POLICY "Authenticated users can manage site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger for site_settings
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default site settings
INSERT INTO site_settings (id, value, type, description) VALUES
  ('site_name', 'Yong Convenience Store', 'text', 'The name of the convenience store'),
  ('site_logo', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 'image', 'The logo image URL for the site'),
  ('site_description', 'Your one-stop convenience store for all your daily needs', 'text', 'Short description of the convenience store'),
  ('currency', 'PHP', 'text', 'Currency symbol for prices'),
  ('currency_code', 'PHP', 'text', 'Currency code for payments'),
  ('footer_address', '123 Main Street\nCity, Province 1234\nPhilippines', 'text', 'Physical address displayed in footer'),
  ('footer_phone', '+63 912 345 6789', 'text', 'Contact phone number displayed in footer'),
  ('footer_email', 'info@yongconvenience.com', 'text', 'Contact email address displayed in footer'),
  ('footer_business_hours', 'Mon - Sun: 6:00 AM - 10:00 PM\nOpen 7 days a week', 'text', 'Business hours displayed in footer'),
  ('promo_pickup_title', 'PICK-UP HIGHLIGHT', 'text', 'Title for pickup promotional banner'),
  ('promo_pickup_subtitle', 'GET P200 OFF WHEN YOU PICK UP YOUR ORDER!', 'text', 'Subtitle for pickup promotional banner'),
  ('promo_pickup_code', 'PICKUPSEPTEMBER', 'text', 'Promo code for pickup banner'),
  ('promo_pickup_dates', 'September 15 & 30', 'text', 'Promo dates for pickup banner'),
  ('promo_pickup_min_purchase', 'P1,500', 'text', 'Minimum purchase for pickup promo'),
  ('promo_delivery_title', 'Delivery Schedule', 'text', 'Title for delivery schedule banner'),
  ('promo_delivery_subtitle', 'Orders received before 11am Same Day Delivery', 'text', 'Subtitle for delivery schedule banner'),
  ('promo_payday_title', 'PAYDAY SPECIALS', 'text', 'Title for payday specials banner'),
  ('promo_payday_subtitle', 'FREE DELIVERY', 'text', 'Subtitle for payday specials banner'),
  ('promo_payday_code', 'SAHODNASEP', 'text', 'Promo code for payday banner'),
  ('promo_payday_dates', 'on September 15 and 30, 2025 with a min. spend of P3,000', 'text', 'Promo details for payday banner'),
  ('promo_payday_min_purchase', 'P3,000', 'text', 'Minimum purchase for payday promo'),
  -- Banner visibility toggles
  ('banner_pickup_enabled', 'true', 'boolean', 'Enable/disable pickup promotional banner'),
  ('banner_delivery_enabled', 'true', 'boolean', 'Enable/disable delivery schedule banner'),
  ('banner_payday_enabled', 'true', 'boolean', 'Enable/disable payday specials banner')
ON CONFLICT (id) DO NOTHING;

-- Create function to check if discount is active
CREATE OR REPLACE FUNCTION is_discount_active(
  discount_active boolean,
  discount_start_date timestamptz,
  discount_end_date timestamptz
)
RETURNS boolean AS $$
BEGIN
  -- If discount is not active, return false
  IF NOT discount_active THEN
    RETURN false;
  END IF;
  
  -- If no dates are set, return the discount_active value
  IF discount_start_date IS NULL AND discount_end_date IS NULL THEN
    RETURN discount_active;
  END IF;
  
  -- Check if current time is within the discount period
  RETURN (
    (discount_start_date IS NULL OR now() >= discount_start_date) AND
    (discount_end_date IS NULL OR now() <= discount_end_date)
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to get effective price (discounted or regular)
CREATE OR REPLACE FUNCTION get_effective_price(
  base_price decimal,
  discount_price decimal,
  discount_active boolean,
  discount_start_date timestamptz,
  discount_end_date timestamptz
)
RETURNS decimal AS $$
BEGIN
  -- If discount is active and within date range, return discount price
  IF is_discount_active(discount_active, discount_start_date, discount_end_date) AND discount_price IS NOT NULL THEN
    RETURN discount_price;
  END IF;
  
  -- Otherwise return base price
  RETURN base_price;
END;
$$ LANGUAGE plpgsql;

-- Add computed columns for effective pricing (if supported by your Supabase version)
-- Note: These are comments as computed columns might not be available in all Supabase versions
-- You can implement this logic in your application instead

-- Create index for better performance on discount queries
CREATE INDEX IF NOT EXISTS idx_menu_items_discount_active ON menu_items(discount_active);
CREATE INDEX IF NOT EXISTS idx_menu_items_discount_dates ON menu_items(discount_start_date, discount_end_date);
