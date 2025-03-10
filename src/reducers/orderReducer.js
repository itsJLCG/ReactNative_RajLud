import {
    PLACE_ORDER_REQUEST,
    PLACE_ORDER_SUCCESS,
    PLACE_ORDER_FAILURE
  } from '../constants/actionTypes';
  
  const initialState = {
    orders: [],
    loading: false,
    error: null
  };
  
  export default function orderReducer(state = initialState, action) {
    switch (action.type) {
      case PLACE_ORDER_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
        
      case PLACE_ORDER_SUCCESS:
        return {
          ...state,
          loading: false,
          orders: [action.payload, ...state.orders]
        };
        
      case PLACE_ORDER_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
        
      default:
        return state;
    }
  }