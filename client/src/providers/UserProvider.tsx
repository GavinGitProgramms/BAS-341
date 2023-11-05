import { createContext, useEffect, useState } from 'react'
import api from '../api/axios'
import { User } from '../types/entity.types'

const LOGIN_URL = '/auth/login'
const LOGOUT_URL = '/auth/logout'

export type UserLoginDetails = { username: string; password: string }

export type UserContextType = {
  loading: boolean
  isAuthenticated: boolean
  user: User | null
  login: (userDetails: UserLoginDetails) => Promise<void>
  logout: () => Promise<void>
}

export type UserProviderProps = {
  children: React.ReactNode
}

function defaultUserContext(): UserContextType {
  return {
    loading: true,
    isAuthenticated: false,
    user: null,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
  }
}

export const UserContext = createContext<UserContextType>(defaultUserContext())

export default function UserProvider({ children }: UserProviderProps) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get('/auth/user')
        setIsAuthenticated(true)
        setUser(response.data)
      } catch (error) {
        setIsAuthenticated(false)
        setUser(null)
      }

      setLoading(false)
    }

    fetchUser()
  }, [])

  async function login({ username, password }: UserLoginDetails) {
    try {
      const response = await api.post(
        LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      )

      if (response.status === 200) {
        setIsAuthenticated(true)
        setUser(response.data)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (err) {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  async function logout() {
    try {
      const response = await api.get(LOGOUT_URL, {
        headers: {},
        withCredentials: true,
      })

      if (response.status === 200) {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const contextValue: UserContextType = {
    loading,
    isAuthenticated,
    user,
    login,
    logout,
  }

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}
