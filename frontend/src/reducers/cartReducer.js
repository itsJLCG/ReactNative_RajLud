import { 
  ADD_TO_CART, 
  REMOVE_FROM_CART, 
  CLEAR_CART,
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE
} from '../constants/actionTypes';

const initialState = {
  items: [],
  loading: false,
  error: null
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case FETCH_CART_SUCCESS:
      // Transform backend cart items to frontend format
      return {
        ...state,
        loading: false,
        items: action.payload && action.payload.items ? 
          action.payload.items.map(item => ({
            _id: item._id, // Cart item ID for removal operations
            id: item.product._id, // Product ID
            title: item.product.name,
            price: item.product.price,
            image: item.product.image?.url,
            quantity: item.quantity,
            product: item.product._id
          })) : [],
        error: null
      };
      
    case FETCH_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case ADD_TO_CART:
      // Transform backend cart items after adding to cart
      return {
        ...state,
        loading: false,
        items: action.payload && action.payload.items ? 
          action.payload.items.map(item => ({
            _id: item._id,
            id: item.product._id,
            title: item.product.name,
            price: item.product.price,
            image: item.product.image?.url,
            quantity: item.quantity,
            product: item.product._id
          })) : [...state.items],
        error: null
      };

    case REMOVE_FROM_CART:
      // Transform backend cart items after removing from cart
      return {
        ...state,
        loading: false,
        items: action.payload && action.payload.items ? 
          action.payload.items.map(item => ({
            _id: item._id,
            id: item.product._id,
            title: item.product.name,
            price: item.product.price,
            image: item.product.image?.url,
            quantity: item.quantity,
            product: item.product._id
          })) : [],
        error: null
      };

    case CLEAR_CART:
      return {
        ...state,
        loading: false,
        items: [],
        error: null
      };

    default:
      return state;
  }
}