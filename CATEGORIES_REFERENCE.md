# NCCC Categories Reference

This document lists all 37 product categories added to the database.

## Category List

| ID | Name | Icon | Sort Order |
|----|------|------|------------|
| automotive-care | Automotive Care | 🚗 | 1 |
| babies-toys-hobbies | Babies, Toys & Hobbies | 🧸 | 2 |
| baby-kids-essentials | Baby and Kids Essentials | 👶 | 3 |
| bags-luggage | Bags & Luggage | 🎒 | 4 |
| beverages | Beverages | 🥤 | 5 |
| breads-spreads-oats-cereals | Breads, Spreads, Oats and Cereals | 🍞 | 6 |
| childrens-wear | Children's Wear | 👕 | 7 |
| cigarettes | Cigarettes | 🚬 | 8 |
| cosmetics-fragrances | Cosmetics & Fragrances | 💄 | 9 |
| electronic-gadgets-tools | Electronic Gadgets & Tools | 📱 | 10 |
| fabrics-sew-essentials | Fabrics & Sew Essentials | 🧵 | 11 |
| gift-rewards | Gift & Rewards | 🎁 | 12 |
| grains-fresh-chilled-frozen | Grains, Fresh, Chilled and Frozen | 🌾 | 13 |
| home-living | Home & Living | 🏠 | 14 |
| home-electrical-appliance | Home Electrical Appliance | 🔌 | 15 |
| home-improvement-construction | Home Improvement & Construction | 🔨 | 16 |
| household-essentials | Household Essentials | 🧴 | 17 |
| jewelry-luxury-watches | Jewelry & Luxury Watches | 💍 | 18 |
| ladies-fashion | Ladie's Fashion | 👗 | 19 |
| loading-station | Loading Station | ⛽ | 20 |
| medical-supplies-devices | Medical Supplies & Devices | 🩺 | 21 |
| medicines-health-care-products | Medicines & Health Care Products | 💊 | 22 |
| mens-fashion | Men's Fashion | 👔 | 23 |
| milk | Milk | 🥛 | 24 |
| outdoor-living | Outdoor Living | 🏕️ | 25 |
| pantry-staples-cooking-essentials | Pantry Staples and Cooking Essentials | 🥘 | 26 |
| personal-care | Personal Care | 🧼 | 27 |
| ready-to-eat | Ready-to-Eat | 🍱 | 28 |
| safety-equipment | Safety Equipment | 🦺 | 29 |
| school-office-options | School & Office Options | 📝 | 30 |
| snacks | Snacks | 🍿 | 31 |
| sports-lifestyle | Sports & Lifestyle | ⚽ | 32 |
| tv-home-entertainment-devices | TV & Home Entertainment Devices | 📺 | 33 |

## Original Categories (Preserved)

| ID | Name | Icon | Sort Order |
|----|------|------|------------|
| hot-coffee | Hot Coffee | ☕ | 34 |
| iced-coffee | Iced Coffee | 🧊 | 35 |
| non-coffee | Non-Coffee | 🫖 | 36 |
| food | Food & Pastries | 🥐 | 37 |

## How to Apply the Migration

### Option 1: Using Supabase CLI (Recommended)

```bash
# Make sure you're in the project directory
cd "C:\Users\Raven\Documents\WebNegosyo Websites\template-web-1-7"

# Apply the migration
npx supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/20250102000000_add_nccc_categories.sql`
4. Paste and run the SQL

### Option 3: Direct SQL Execution

```bash
# Connect to your database and run:
psql -h <your-host> -U <your-user> -d <your-database> -f supabase/migrations/20250102000000_add_nccc_categories.sql
```

## Notes

- All categories are set to `active = true` by default
- The migration uses `ON CONFLICT DO UPDATE` to handle existing categories
- Original categories (hot-coffee, iced-coffee, etc.) are preserved and updated
- Each category has a unique emoji icon for visual identification
- Sort order determines the display sequence in the UI

## Testing the Migration

After applying the migration, you can verify the categories in your database:

```sql
-- Check all categories
SELECT id, name, icon, sort_order, active 
FROM categories 
ORDER BY sort_order;

-- Count categories
SELECT COUNT(*) as total_categories FROM categories WHERE active = true;
```

Expected result: 37 new categories + 4 original = **41 total categories**

