import React, { createContext, useState, useEffect } from 'react';
import { getProducts, saveProducts, getOrders, saveOrders } from '../utils/localStorage';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedProducts = getProducts();
    const savedOrders = getOrders();
    setProducts(savedProducts);
    setOrders(savedOrders);
  }, []);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    return newProduct;
  };

  const updateProduct = (productId, updatedData) => {
    const updatedProducts = products.map(p =>
      p.id === productId ? { ...p, ...updatedData } : p
    );
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };

  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Math.max(...orders.map(o => o.id), 0) + 1,
      date: new Date().toISOString(),
      status: 'pending'
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    const updatedOrders = orders.map(o =>
      o.id === orderId ? { ...o, status } : o
    );
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
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
