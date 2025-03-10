import {
    PLACE_ORDER_REQUEST,
    PLACE_ORDER_SUCCESS,
    PLACE_ORDER_FAILURE
  } from '../constants/actionTypes';
  
  export const placeOrder = (orderData) => {
    return async (dispatch) => {
      dispatch({ type: PLACE_ORDER_REQUEST });
      
      try {
        // In a real app, you would make an API call here
        // const response = await api.createOrder(orderData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate an order ID and current date for the mock order
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        const orderDate = new Date().toISOString();
        
        // Create the order object with status "Processing"
        const order = {
          id: orderId,
          date: orderDate,
          status: 'Processing',
          ...orderData,
        };
        
        dispatch({ 
          type: PLACE_ORDER_SUCCESS, 
          payload: order 
        });
        
        return { success: true, orderId };
      } catch (error) {
        dispatch({ 
          type: PLACE_ORDER_FAILURE, 
          payload: error.message || 'Failed to place order' 
        });
        
        return { success: false, error: error.message };
      }
    };
  };