import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { categories as fallbackCategories } from '../data/menuData';

export interface Category {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCategories = (includeInactive: boolean = false) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('categories')
        .select('*');
      
      // Only filter by active status if includeInactive is false
      if (!includeInactive) {
        query = query.eq('active', true);
      }
      
      const { data, error: fetchError } = await query.order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;

      // If no categories found, use fallback data
      if (!data || data.length === 0) {
        console.log('No categories found in database, using fallback data');
        setCategories(fallbackCategories.map(cat => ({
          ...cat,
          sort_order: 0,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })));
      } else {
        setCategories(data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      
      // Fallback to sample data if database fetch fails
      console.log('Using fallback categories data');
      setCategories(fallbackCategories.map(cat => ({
        ...cat,
        sort_order: 0,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })));
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('categories')
        .insert({
          id: category.id,
          name: category.name,
          icon: category.icon,
          sort_order: category.sort_order,
          active: category.active
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchCategories();
      return data;
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { error: updateError } = await supabase
        .from('categories')
        .update({
          name: updates.name,
          icon: updates.icon,
          sort_order: updates.sort_order,
          active: updates.active
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      // Check if category has menu items
      const { data: menuItems, error: checkError } = await supabase
        .from('menu_items')
        .select('id')
        .eq('category', id)
        .limit(1);

      if (checkError) throw checkError;

      if (menuItems && menuItems.length > 0) {
        throw new Error('Cannot delete category that contains menu items. Please move or delete the items first.');
      }

      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  const reorderCategories = async (reorderedCategories: Category[]) => {
    try {
      const updates = reorderedCategories.map((cat, index) => ({
        id: cat.id,
        sort_order: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('categories')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
      }

      await fetchCategories();
    } catch (err) {
      console.error('Error reordering categories:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    refetch: fetchCategories
  };
};