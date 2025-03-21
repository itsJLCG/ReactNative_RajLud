import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SIGNUP_FAILURE,
    LOGOUT
  } from '../constants/actionTypes';
  
  const initialState = {
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
    error: null
  };
  
  export default function authReducer(state = initialState, action) {
    switch (action.type) {
      case LOGIN_REQUEST:
      case SIGNUP_REQUEST:
        return {
          ...state,
          isLoading: true,
          error: null
        };
      
      case LOGIN_SUCCESS:
      case SIGNUP_SUCCESS:
        return {
          ...state,
          user: action.payload.user,
          token: action.payload.token, // Make sure token is included
          isAuthenticated: true,
          isLoading: false,
          error: null
        };
      
      case LOGIN_FAILURE:
      case SIGNUP_FAILURE:
        return {
          ...state,
          isLoading: false,
          error: action.payload,
          isAuthenticated: false
        };
      
      case LOGOUT:
        return {
          ...initialState
        };
      
      default:
        return state;
    }
  }