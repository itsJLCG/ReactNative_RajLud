import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../reducers/productReducer';
import cartReducer from '../reducers/cartReducer';
import authReducer from '../reducers/authReducer';
import orderReducer from '../reducers/orderReducer';
import categoryReducer from '../reducers/categoryReducer';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
    orders: orderReducer,
    categories: categoryReducer,
  },
});