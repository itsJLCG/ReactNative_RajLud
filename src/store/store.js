import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../reducers/productReducer';
import cartReducer from '../reducers/cartReducer';
import authReducer from '../reducers/authReducer';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});