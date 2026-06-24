// Mock Products Data
export const mockProducts = [
  {
    id: 1,
    name: "Small Lemons Pack",
    type: "small",
    weight: "500g",
    price: 50,
    quantity: 15,
    lemonCount: "15-20 lemons",
    description: "Fresh and juicy small lemons, perfect for daily use in kitchen. Rich in Vitamin C and natural antioxidants.",
    image: "/small_lemons.png",
    nutritionInfo: {
      vitaminC: "53mg per 100g",
      fiber: "2.8g",
      calories: "29 per 100g"
    },
    reviews: [
      { user: "Priya K.", rating: 5, comment: "Fresh and perfect quality!" },
      { user: "Amit S.", rating: 4, comment: "Good value for money" }
    ]
  },
  {
    id: 2,
    name: "Medium Lemons Pack",
    type: "medium",
    weight: "1kg",
    price: 80,
    quantity: 12,
    lemonCount: "8-12 lemons",
    description: "Premium quality medium-sized lemons with excellent juice content. Best for making fresh lemonade and cooking.",
    image: "/medium_lemons.png",
    nutritionInfo: {
      vitaminC: "53mg per 100g",
      fiber: "2.8g",
      calories: "29 per 100g"
    },
    reviews: [
      { user: "Rahul M.", rating: 5, comment: "Best lemons I've bought!" },
      { user: "Sneha P.", rating: 5, comment: "Excellent juice content" }
    ]
  },
  {
    id: 3,
    name: "Large Lemons Pack",
    type: "large",
    weight: "1.5kg",
    price: 120,
    quantity: 8,
    lemonCount: "5-8 lemons",
    description: "Premium large lemons, ideal for bulk buyers and commercial use. High juice yield and excellent storage life.",
    image: "/large_lemons.png",
    nutritionInfo: {
      vitaminC: "53mg per 100g",
      fiber: "2.8g",
      calories: "29 per 100g"
    },
    reviews: [
      { user: "Hotel XYZ", rating: 5, comment: "Perfect for restaurant use" },
      { user: "Juice Shop", rating: 5, comment: "Best quality, consistent supply" }
    ]
  }
];

// Mock initial data for localStorage
export const initializeMockData = () => {
  const users = localStorage.getItem('users');
  const products = localStorage.getItem('products');
  const orders = localStorage.getItem('orders');

  if (!users) {
    const defaultUsers = [
      {
        id: 1,
        email: "customer@example.com",
        password: "customer123",
        role: "customer",
        name: "John Customer",
        phone: "9876543210",
        address: "123 Main St, City"
      },
      {
        id: 2,
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        name: "Admin User",
        phone: "9123456789",
        address: "Admin Office"
      }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  if (!products) {
    localStorage.setItem('products', JSON.stringify(mockProducts));
  }

  if (!orders) {
    localStorage.setItem('orders', JSON.stringify([]));
  }
};
