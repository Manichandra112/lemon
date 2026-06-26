import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { mockProducts } from '../utils/mockData';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Fetch products
        let { data: fetchedProducts, error: prodError } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });

        if (prodError) throw prodError;

        // Seed products if database is empty
        if (!fetchedProducts || fetchedProducts.length === 0) {
          const productsToSeed = mockProducts.map(({ id, ...rest }) => rest);
          
          const { data: seeded, error: seedError } = await supabase
            .from('products')
            .insert(productsToSeed)
            .select()
            .order('id', { ascending: true });

          if (seedError) {
            console.error('Seeding products failed:', seedError);
          } else {
            fetchedProducts = seeded;
          }
        }

        setProducts(fetchedProducts || []);

        // 2. Fetch orders
        const { data: fetchedOrders, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (orderError) throw orderError;
        setOrders(fetchedOrders || []);
      } catch (err) {
        console.error('Error loading initial data from Supabase:', err);
      }
    };

    loadData();
  }, []);

  const addProduct = async (product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      
      if (error) throw error;
      setProducts(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding product to Supabase:', error);
      throw error;
    }
  };

  const updateProduct = async (productId, updatedData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updatedData)
        .eq('id', productId)
        .select()
        .single();
      
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === productId ? data : p));
    } catch (error) {
      console.error('Error updating product in Supabase:', error);
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product from Supabase:', error);
      throw error;
    }
  };

  const addOrder = async (order) => {
    try {
      const newOrderPayload = {
        userId: order.userId,
        totalPrice: order.totalPrice,
        address: order.address,
        status: 'pending',
        items: order.items
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([newOrderPayload])
        .select()
        .single();

      if (error) throw error;
      setOrders(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding order to Supabase:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? data : o));
    } catch (error) {
      console.error('Error updating order status in Supabase:', error);
      throw error;
    }
  };

  const getUserOrders = (userId) => {
    return orders.filter(o => o.userId === userId);
  };

  const value = {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus,
    getUserOrders
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
