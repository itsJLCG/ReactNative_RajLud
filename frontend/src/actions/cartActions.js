import { Platform } from 'react-native';
import { 
  ADD_TO_CART, 
  REMOVE_FROM_CART, 
  CLEAR_CART, 
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE
} from '../constants/actionTypes';
import { API_URL_EMULATOR, API_URL_DEVICE } from '@env';

// Configure API URL based on platform and environment
const API_URL = __DEV__
  ? Platform.select({
    android: Platform.isEmulator ? API_URL_EMULATOR : API_URL_DEVICE,
    default: API_URL_DEVICE
  })
  : API_URL_DEVICE;

console.log('Using Cart API URL:', API_URL);

// Get cart
export const fetchCart = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_CART_REQUEST });
    
    const { auth } = getState();
    const token = auth?.token;

    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await fetch(`${API_URL}/api/cart`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('Fetch cart response:', data);
    
    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }
    
    dispatch({
      type: FETCH_CART_SUCCESS,
      payload: data.data
    });
    
    return { success: true };
  } catch (error) {
    console.error('Fetch Cart Error:', error);
    dispatch({
      type: FETCH_CART_FAILURE,
      payload: error.message
    });
    return { success: false, error: error.message };
  }
};

// Add to cart
export const addToCart = (product, quantity = 1) => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_CART_REQUEST });
    
    const { auth } = getState();
    const token = auth?.token;
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await fetch(`${API_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        productId: product._id || product.id, 
        quantity: quantity 
      }),
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('Add to cart response:', data);
    
    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }
    
    dispatch({
      type: ADD_TO_CART,
      payload: data.data
    });
    
    return { success: true };
  } catch (error) {
    console.error('Add to Cart Error:', error);
    dispatch({
      type: FETCH_CART_FAILURE,
      payload: error.message
    });
    return { success: false, error: error.message };
  }
};

// Remove from cart
export const removeFromCart = (itemId) => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_CART_REQUEST });
    
    const { auth } = getState();
    const token = auth?.token;
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await fetch(`${API_URL}/api/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('Remove from cart response:', data);
    
    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }
    
    dispatch({
      type: REMOVE_FROM_CART,
      payload: data.data
    });
    
    return { success: true };
  } catch (error) {
    console.error('Remove from Cart Error:', error);
    dispatch({
      type: FETCH_CART_FAILURE,
      payload: error.message
    });
    return { success: false, error: error.message };
  }
};

// Clear cart
export const clearCart = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_CART_REQUEST });
    
    const { auth } = getState();
    const token = auth?.token;
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await fetch(`${API_URL}/api/cart`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('Clear cart response:', data);
    
    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }
    
    dispatch({ type: CLEAR_CART });
    
    return { success: true };
  } catch (error) {
    console.error('Clear Cart Error:', error);
    dispatch({
      type: FETCH_CART_FAILURE,
      payload: error.message
    });
    return { success: false, error: error.message };
  }
};