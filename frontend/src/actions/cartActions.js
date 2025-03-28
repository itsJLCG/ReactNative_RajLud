import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from '../constants/actionTypes';

export const addToCart = (product, quantity = 1) => {
  // Make sure product has quantity property
  const productWithQuantity = {
    ...product,
    quantity: product.quantity || quantity
  };
  
  return {
    type: ADD_TO_CART,
    payload: productWithQuantity,
  };
};

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

export const clearCart = () => {
  return {
    type: CLEAR_CART
  };
};