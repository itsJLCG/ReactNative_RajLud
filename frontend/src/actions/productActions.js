import { FETCH_PRODUCTS, FETCH_PRODUCTS_SUCCESS } from '../constants/actionTypes';

export const fetchProducts = () => async dispatch => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: data });
  } catch (error) {
    console.error(error);
  }
};