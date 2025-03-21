import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE
} from '../constants/actionTypes';

const initialState = {
  products: [],
  isLoading: false,
  error: null
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
    case CREATE_PRODUCT_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        products: action.payload,
        error: null
      };

    case CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        products: [action.payload, ...state.products],
        error: null
      };

    case FETCH_PRODUCTS_FAILURE:
    case CREATE_PRODUCT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    default:
      return state;
  }
}