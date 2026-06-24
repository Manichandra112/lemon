// localStorage utility functions

export const getUsers = () => {
  try {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const saveUsers = (users) => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

export const getProducts = () => {
  try {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

export const saveProducts = (products) => {
  try {
    localStorage.setItem('products', JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

export const getOrders = () => {
  try {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

export const saveOrders = (orders) => {
  try {
    localStorage.setItem('orders', JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders:', error);
  }
};

export const getCart = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

export const saveCart = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export const getAuthUser = () => {
  try {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
};

export const saveAuthUser = (user) => {
  try {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }
  } catch (error) {
    console.error('Error saving auth user:', error);
  }
};
