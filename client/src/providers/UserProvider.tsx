import { createContext, useEffect, useState } from 'react'
import api from '../api'
import { User } from '../types/entity.types'
import { CreateUserArgs, LoginArgs } from '../types'

const LOGIN_URL = '/auth/login'
const LOGOUT_URL = '/auth/logout'
const USER_URL = '/auth/user'
const REGISTER_URL = '/auth/register'

export type UserContextType = {
  loading: boolean
  isAuthenticated: boolean
  user: User | null
  errMsg: ''
  login: (args: LoginArgs) => Promise<void>
  logout: () => Promise<void>
  register: (args: CreateUserArgs) => Promise<void>
}

export type UserProviderProps = {
  children: React.ReactNode
}

function defaultUserContext(): UserContextType {
  return {
    loading: true,
    isAuthenticated: false,
    user: null,
    errMsg: '',
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    register: () => Promise.resolve(),
  }
}

export const UserContext = createContext<UserContextType>(defaultUserContext())

/**
 * Provides user authentication and user data to the application.
 */
export default function UserProvider({ children }: UserProviderProps) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  /**
   * Fetches user data from the API and updates the state accordingly.
   */
  async function fetchUser() {
    try {
      const response = await api.get(USER_URL)
      setIsAuthenticated(true)
      setUser(response.data)
    } catch (err) {
      console.error(err)
      setIsAuthenticated(false)
      setUser(null)
    }

    setLoading(false)
  }

  /**
   * Fetch user data on mount.
   */
  useEffect(() => {
    fetchUser()
  }, [])

  /**
   * Logs in the user with the provided username and password.
   */
  async function login({ username, password }: LoginArgs) {
    try {
      const response = await api.post(LOGIN_URL, { username, password })
      if (response.status === 200) {
        await fetchUser()
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error(err)
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  /**
   * Logs out the user by making a GET request to the logout URL.
   * Sets the user to null and isAuthenticated to false upon successful logout.
   */
  async function logout() {
    try {
      const response = await api.get(LOGOUT_URL)
      if (response.status === 200) {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Registers a new user.
   */
  async function register(args: CreateUserArgs) {
    try {
      const response = await api.post(REGISTER_URL, args)
      if (response.status === 200) {
        await fetchUser()
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error(err)
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const contextValue: UserContextType = {
    loading,
    isAuthenticated,
    user,
    errMsg: '',
    login,
    logout,
    register,
  }

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}
