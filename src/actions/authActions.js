import { 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGIN_FAILURE,
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SIGNUP_FAILURE,
    LOGOUT
  } from '../constants/actionTypes';
  
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
  
  // Async thunk for login
  export const login = (email, password) => async (dispatch) => {
    dispatch(loginRequest());
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch('your-api-endpoint/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      
      // For now, we'll simulate API call with static credentials
      if (email === 'test@example.com' && password === 'password123') {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = {
          name: 'John Doe',
          email: 'test@example.com',
          image: 'https://randomuser.me/api/portraits/men/32.jpg'
        };
        
        dispatch(loginSuccess(userData));
        return { success: true };
      } else {
        dispatch(loginFailure('Invalid email or password'));
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error) {
      dispatch(loginFailure(error.message || 'Something went wrong'));
      return { success: false, message: error.message || 'Something went wrong' };
    }
  };
  
  // Async thunk for signup
  export const signup = (name, email, password) => async (dispatch) => {
    dispatch(signupRequest());
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch('your-api-endpoint/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password })
      // });
      // const data = await response.json();
      
      // For now, we'll simulate API call
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        name,
        email,
        image: 'https://randomuser.me/api/portraits/men/32.jpg'
      };
      
      dispatch(signupSuccess(userData));
      return { success: true };
    } catch (error) {
      dispatch(signupFailure(error.message || 'Something went wrong'));
      return { success: false, message: error.message || 'Something went wrong' };
    }
  };