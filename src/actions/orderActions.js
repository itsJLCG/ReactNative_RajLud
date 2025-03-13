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

  export const fetchOrders = () => {
    return async (dispatch) => {
      dispatch({ type: FETCH_ORDERS_REQUEST });
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const orders = [
          {
            id: 'ORD-12345',
            date: '2025-02-28',
            status: 'Delivered',
            total: 129.99,
            items: 3,
            trackingNumber: 'TRK928192819',
          },
          // ... add more mock orders
        ];
        
        dispatch({ 
          type: FETCH_ORDERS_SUCCESS, 
          payload: orders 
        });
      } catch (error) {
        dispatch({ 
          type: FETCH_ORDERS_FAILURE, 
          payload: error.message || 'Failed to fetch orders' 
        });
      }
    };
  };
  
  export const fetchOrderDetails = (orderId) => {
    return async (dispatch) => {
      dispatch({ type: FETCH_ORDER_DETAILS_REQUEST });
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for order details
        const orderDetails = {
          id: orderId,
          date: '2025-03-10',
          status: 'Processing',
          items: [
            {
              id: 1,
              name: 'Product 1',
              price: 29.99,
              quantity: 2,
              image: 'https://via.placeholder.com/150'
            }
          ],
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'United States'
          },
          paymentMethod: 'Credit Card •••• 4242',
          shippingMethod: 'Standard Shipping',
          subtotal: 59.98,
          shippingCost: 5.99,
          tax: 5.24,
          total: 71.21,
          trackingNumber: 'TRK123456789',
          trackingHistory: [
            {
              status: 'Order Placed',
              date: '2025-03-10',
              location: 'Online'
            }
          ]
        };
        
        dispatch({ 
          type: FETCH_ORDER_DETAILS_SUCCESS, 
          payload: orderDetails 
        });
      } catch (error) {
        dispatch({ 
          type: FETCH_ORDER_DETAILS_FAILURE, 
          payload: error.message || 'Failed to fetch order details' 
        });
      }
    };
  };