import * as SQLite from 'expo-sqlite';

// For expo-sqlite v15+, we use the async API
export const getDatabase = async () => {
  try {
    // Open database connection
    const db = await SQLite.openDatabaseAsync('cart.db');
    return db;
  } catch (error) {
    console.error('Failed to open database', error);
    throw error;
  }
};

// Initialize the database
export const initDatabase = async () => {
  try {
    const db = await getDatabase();
    
    // Create cart_items table if it doesn't exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        title TEXT NOT NULL, 
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        image TEXT,
        user_id TEXT,
        UNIQUE(product_id, user_id)
      );
    `);
    
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error };
  }
};

// Get all cart items
export const getCartItems = async (userId) => {
    try {
      const db = await getDatabase();
      const result = await db.getAllAsync(`
        SELECT * FROM cart_items WHERE user_id = ?;
      `, [userId || 'guest']);
      
      return result.map(item => ({
        _id: item.product_id, // Cart item ID for removal operations
        id: item.product_id,  // Product ID
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        product: item.product_id // Adding this for consistency
      }));
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  };

// Add item to cart
export const addCartItem = async (product, quantity = 1, userId) => {
  try {
    const db = await getDatabase();
    
    // Check if the item already exists
    const existingItems = await db.getAllAsync(`
      SELECT * FROM cart_items WHERE product_id = ? AND user_id = ?;
    `, [product._id, userId || 'guest']);
    
    if (existingItems.length > 0) {
      // Item exists, update quantity
      const newQuantity = existingItems[0].quantity + quantity;
      await db.runAsync(`
        UPDATE cart_items SET quantity = ? WHERE product_id = ? AND user_id = ?;
      `, [newQuantity, product._id, userId || 'guest']);
    } else {
      // Item doesn't exist, insert new item
      await db.runAsync(`
        INSERT INTO cart_items (product_id, title, price, quantity, image, user_id) 
        VALUES (?, ?, ?, ?, ?, ?);
      `, [
        product._id, 
        product.title || product.name, 
        product.price, 
        quantity, 
        product.image?.url || product.image, 
        userId || 'guest'
      ]);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return { success: false, error };
  }
};

// Remove item from cart
export const removeCartItem = async (productId, userId) => {
  try {
    const db = await getDatabase();
    await db.runAsync(`
      DELETE FROM cart_items WHERE product_id = ? AND user_id = ?;
    `, [productId, userId || 'guest']);
    
    return { success: true };
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return { success: false, error };
  }
};

// Update cart item quantity - renamed to avoid conflicts
export const updateCartItemQuantityInDb = async (productId, quantity, userId) => {
  try {
    const db = await getDatabase();
    await db.runAsync(`
      UPDATE cart_items SET quantity = ? WHERE product_id = ? AND user_id = ?;
    `, [quantity, productId, userId || 'guest']);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return { success: false, error };
  }
};

// Remove multiple items from cart
export const removeMultipleCartItems = async (productIds, userId) => {
  try {
    const db = await getDatabase();
    for (const productId of productIds) {
      await db.runAsync(`
        DELETE FROM cart_items WHERE product_id = ? AND user_id = ?;
      `, [productId, userId || 'guest']);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error removing multiple items from cart:', error);
    return { success: false, error };
  }
};

// Clear cart
export const clearCart = async (userId) => {
  try {
    const db = await getDatabase();
    await db.runAsync(`
      DELETE FROM cart_items WHERE user_id = ?;
    `, [userId || 'guest']);
    
    return { success: true };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, error };
  }
};