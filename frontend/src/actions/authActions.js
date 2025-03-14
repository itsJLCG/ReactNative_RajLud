import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGOUT
} from '../constants/actionTypes';
import { Platform } from 'react-native';
import { API_URL_EMULATOR, API_URL_DEVICE } from '@env';

const BASE_URL = __DEV__
  ? Platform.select({
    android: Platform.isEmulator ? API_URL_EMULATOR : API_URL_DEVICE,
    default: API_URL_DEVICE
  })
  : API_URL_DEVICE;

// Login actions
export const loginRequest = () => ({
  type: LOGIN_REQUEST
});

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error
});

// Signup actions
export const signupRequest = () => ({
  type: SIGNUP_REQUEST
});

export const signupSuccess = (user) => ({
  type: SIGNUP_SUCCESS,
  payload: user
});

export const signupFailure = (error) => ({
  type: SIGNUP_FAILURE,
  payload: error
});

// Logout action
export const logout = () => ({
  type: LOGOUT
});

export const login = (email, password) => async (dispatch) => {
  dispatch(loginRequest());

  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      dispatch(loginSuccess(data.user));
      return { success: true };
    } else {
      dispatch(loginFailure(data.error));
      return { success: false, message: data.error };
    }
  } catch (error) {
    console.error('Login Error:', error);
    dispatch(loginFailure('Network error. Please try again.'));
    return { success: false, message: 'Network error. Please try again.' };
  }
};

// Async thunk for signup
export const signup = (signupData) => async (dispatch) => {
  dispatch(signupRequest());
  
  try {
    // Format the data properly
    const userData = {
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
      address: signupData.address,
      // Convert base64 image if exists
      image: signupData.imageBase64 ? signupData.imageBase64 : null
    };

    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (data.success) {
      dispatch(signupSuccess(data.user));
      return { success: true };
    } else {
      dispatch(signupFailure(data.error));
      return { success: false, message: data.error };
    }
  } catch (error) {
    console.error('Signup Error:', error);
    dispatch(signupFailure(error.message));
    return { success: false, message: error.message };
  }
};

export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

export const updateProfile = (userData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });

  try {
    const response = await fetch(`${BASE_URL}/api/auth/update-profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        // Add your auth token here if required
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (data.success) {
      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: data.user
      });
      return { success: true };
    } else {
      dispatch({
        type: UPDATE_PROFILE_FAILURE,
        payload: data.error
      });
      return { success: false, message: data.error };
    }
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAILURE,
      payload: error.message
    });
    return { success: false, message: error.message };
  }
};