import {
    FETCH_CATEGORIES_REQUEST,
    FETCH_CATEGORIES_SUCCESS,
    FETCH_CATEGORIES_FAILURE,
    CREATE_CATEGORY_REQUEST,
    CREATE_CATEGORY_SUCCESS,
    CREATE_CATEGORY_FAILURE
  } from '../constants/actionTypes';
  
  const initialState = {
    categories: [],
    isLoading: false,
    error: null
  };
  
  export default function categoryReducer(state = initialState, action) {
    switch (action.type) {
      case FETCH_CATEGORIES_REQUEST:
      case CREATE_CATEGORY_REQUEST:
        return {
          ...state,
          isLoading: true,
          error: null
        };
  
      case FETCH_CATEGORIES_SUCCESS:
        return {
          ...state,
          isLoading: false,
          categories: action.payload,
          error: null
        };
  
      case CREATE_CATEGORY_SUCCESS:
        return {
          ...state,
          isLoading: false,
          categories: [action.payload, ...state.categories],
          error: null
        };
  
      case FETCH_CATEGORIES_FAILURE:
      case CREATE_CATEGORY_FAILURE:
        return {
          ...state,
          isLoading: false,
          error: action.payload
        };
  
      default:
        return state;
    }
  }