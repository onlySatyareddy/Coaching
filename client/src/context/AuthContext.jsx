import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false,
}

const authReducer = (state, action) => {
  console.log('AuthReducer Action:', action.type, action.payload)
  
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
      }
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      console.log('AuthReducer LOGIN_SUCCESS, new state:', {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      })
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOAD_USER_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await authAPI.getMe()
          dispatch({
            type: 'LOAD_USER_SUCCESS',
            payload: { user: response.data.user }
          })
        } catch (error) {
          console.error('Failed to load user:', error)
          localStorage.removeItem('token')
          dispatch({ type: 'LOAD_USER_FAILURE' })
        }
      }
    }

    loadUser()
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await authAPI.login(credentials)
      
      console.log('AuthContext Login Response:', response)
      console.log('Response data:', response.data)
      console.log('Response data user:', response.data.user)
      
      // Store token
      localStorage.setItem('token', response.data.data.accessToken)
      
      // Create payload with user data
      const payload = {
        user: response.data.data.user,
        token: response.data.data.accessToken,
      }
      
      console.log('About to dispatch LOGIN_SUCCESS with payload:', payload)
      
      // Dispatch login success
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: payload
      })
      
      // Verify state after dispatch (this will run after state update)
      setTimeout(() => {
        console.log('State after login dispatch - checking current state...')
      }, 100)
      
      toast.success('Login successful!')
      return response.data
    } catch (error) {
      console.error('AuthContext Login Error:', error)
      dispatch({ type: 'LOGIN_FAILURE' })
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'REGISTER_START' })
      const response = await authAPI.register(userData)
      
      localStorage.setItem('token', response.data.data.accessToken)
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: response.data.data.user,
          token: response.data.data.accessToken,
        }
      })
      
      toast.success('Registration successful!')
      return response.data
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE' })
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      dispatch({ type: 'LOGOUT' })
      toast.success('Logged out successfully')
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
