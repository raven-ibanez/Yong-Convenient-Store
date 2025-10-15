/*
  # Add NCCC Categories
  
  This migration adds all 37 product categories from NCCC
  to the categories table.
*/

-- Insert all NCCC categories
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('automotive-care', 'Automotive Care', '🚗', 1, true),
  ('babies-toys-hobbies', 'Babies, Toys & Hobbies', '🧸', 2, true),
  ('baby-kids-essentials', 'Baby and Kids Essentials', '👶', 3, true),
  ('bags-luggage', 'Bags & Luggage', '🎒', 4, true),
  ('beverages', 'Beverages', '🥤', 5, true),
  ('breads-spreads-oats-cereals', 'Breads, Spreads, Oats and Cereals', '🍞', 6, true),
  ('childrens-wear', 'Children''s Wear', '👕', 7, true),
  ('cigarettes', 'Cigarettes', '🚬', 8, true),
  ('cosmetics-fragrances', 'Cosmetics & Fragrances', '💄', 9, true),
  ('electronic-gadgets-tools', 'Electronic Gadgets & Tools', '📱', 10, true),
  ('fabrics-sew-essentials', 'Fabrics & Sew Essentials', '🧵', 11, true),
  ('gift-rewards', 'Gift & Rewards', '🎁', 12, true),
  ('grains-fresh-chilled-frozen', 'Grains, Fresh, Chilled and Frozen', '🌾', 13, true),
  ('home-living', 'Home & Living', '🏠', 14, true),
  ('home-electrical-appliance', 'Home Electrical Appliance', '🔌', 15, true),
  ('home-improvement-construction', 'Home Improvement & Construction', '🔨', 16, true),
  ('household-essentials', 'Household Essentials', '🧴', 17, true),
  ('jewelry-luxury-watches', 'Jewelry & Luxury Watches', '💍', 18, true),
  ('ladies-fashion', 'Ladie''s Fashion', '👗', 19, true),
  ('loading-station', 'Loading Station', '⛽', 20, true),
  ('medical-supplies-devices', 'Medical Supplies & Devices', '🩺', 21, true),
  ('medicines-health-care-products', 'Medicines & Health Care Products', '💊', 22, true),
  ('mens-fashion', 'Men''s Fashion', '👔', 23, true),
  ('milk', 'Milk', '🥛', 24, true),
  ('outdoor-living', 'Outdoor Living', '🏕️', 25, true),
  ('pantry-staples-cooking-essentials', 'Pantry Staples and Cooking Essentials', '🥘', 26, true),
  ('personal-care', 'Personal Care', '🧼', 27, true),
  ('ready-to-eat', 'Ready-to-Eat', '🍱', 28, true),
  ('safety-equipment', 'Safety Equipment', '🦺', 29, true),
  ('school-office-options', 'School & Office Options', '📝', 30, true),
  ('snacks', 'Snacks', '🍿', 31, true),
  ('sports-lifestyle', 'Sports & Lifestyle', '⚽', 32, true),
  ('tv-home-entertainment-devices', 'TV & Home Entertainment Devices', '📺', 33, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active,
  updated_at = now();

-- Update existing categories if they exist
UPDATE categories SET 
  name = 'Hot Coffee',
  icon = '☕',
  sort_order = 34,
  active = true,
  updated_at = now()
WHERE id = 'hot-coffee';

UPDATE categories SET 
  name = 'Iced Coffee',
  icon = '🧊',
  sort_order = 35,
  active = true,
  updated_at = now()
WHERE id = 'iced-coffee';

UPDATE categories SET 
  name = 'Non-Coffee',
  icon = '🫖',
  sort_order = 36,
  active = true,
  updated_at = now()
WHERE id = 'non-coffee';

UPDATE categories SET 
  name = 'Food & Pastries',
  icon = '🥐',
  sort_order = 37,
  active = true,
  updated_at = now()
WHERE id = 'food';

