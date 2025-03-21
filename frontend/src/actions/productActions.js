import { Platform } from 'react-native';
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE
} from '../constants/actionTypes';
import { API_URL_EMULATOR, API_URL_DEVICE } from '@env';

// Configure API URL based on platform and environment
const API_URL = __DEV__
  ? Platform.select({
    android: Platform.isEmulator ? API_URL_EMULATOR : API_URL_DEVICE,
    default: API_URL_DEVICE
  })
  : API_URL_DEVICE;

console.log('Using API URL:', API_URL); // Debug log to verify URL

// Fetch all products
export const fetchProducts = () => async (dispatch, getState) => {
  try {
    // Dispatch request action before fetching
    dispatch({ type: FETCH_PRODUCTS_REQUEST });

    // Get auth token from state
    const { auth } = getState();
    const token = auth?.token;

    const response = await fetch(`${API_URL}/api/products`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    const data = await response.json();
    console.log('Fetch products response:', data);

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    dispatch({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: data.products
    });

    return { success: true, products: data.products };
  } catch (error) {
    console.error('Fetch Products Error:', error);
    dispatch({
      type: FETCH_PRODUCTS_FAILURE,
      payload: error.message
    });
    return { success: false, message: error.message };
  }
};

// Create new product
export const createProduct = (productData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_PRODUCT_REQUEST });

    const { auth } = getState();
    const token = auth?.token;

    if (!token) {
      throw new Error('Authentication token not found');
    }

    console.log('Creating product with:', {
      url: `${API_URL}/api/products`,
      token,
      data: productData
    });

    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();
    console.log('Create product response:', data);

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    dispatch({
      type: CREATE_PRODUCT_SUCCESS,
      payload: data.product
    });

    return { success: true, product: data.product };
  } catch (error) {
    console.error('Create Product Error:', error);
    dispatch({
      type: CREATE_PRODUCT_FAILURE,
      payload: error.message
    });
    return { success: false, message: error.message };
  }
};

