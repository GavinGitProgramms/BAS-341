import { useContext, useEffect, useState } from 'react'
import api from '../api'
import { UserContext, UserContextType } from '../providers/UserProvider'
import {
  EventType,
  SearchResults,
  SearchUsersDto,
  UserDto,
  UserType,
} from '../types'
import { errorNotification, successNotification } from '../utils'
import { useEvents } from './event.hooks'

const SEARCH_USERS_URL = '/auth/user/search'
const ENABLE_USER_URL = '/auth/user/enable'
const DISABLE_USER_URL = '/auth/user/disable'
const GET_USER_URL = '/auth/user'

/**
 * Custom hook that returns the user context.
 *
 * @returns The user context.
 */
export function useUser(): UserContextType {
  const context = useContext<UserContextType>(UserContext)
  return context
}

/**
 * Custom hook for managing user administration functionality.
 *
 * Requires the user to be authenticated and have an admin user type.
 */
export function useUserAdmin() {
  const { publish } = useEvents()
  const { isAuthenticated, user } = useUser()
  if (!user || user.type !== UserType.ADMIN) {
    throw new Error('invalid user type')
  }

  /**
   * Retrieves user information for the specified username.
   *
   * @param username - The username of the user to retrieve.
   * @returns A promise that resolves to a UserDto object representing the user.
   * @throws Error if the user is not authenticated or if an unexpected error occurs.
   */
  async function getUser(username: string): Promise<UserDto> {
    if (!isAuthenticated) {
      throw new Error('not authenticated')
    }

    const response = await api.get(`${GET_USER_URL}/${username}`)
    if (response.status === 200) {
      return response.data
    }

    throw new Error('an unexpected error occurred')
  }

  /**
   * Enables a user with the specified username.
   *
   * @param username - The username of the user to enable.
   * @returns A promise that resolves to the enabled user.
   * @throws An error if the user is not authenticated or if an unexpected error occurs.
   */
  async function enableUser(username: string): Promise<UserDto> {
    if (!isAuthenticated) {
      throw new Error('not authenticated')
    }

    const response = await api.put(`${ENABLE_USER_URL}/${username}`)
    if (response.status === 200) {
      publish(EventType.USER_ENABLED)
      successNotification('User enabled successfully')
      return response.data
    } else {
      errorNotification('Failed to enable user')
    }

    throw new Error('an unexpected error occurred')
  }

  /**
   * Disables a user by their username.
   *
   * @param username - The username of the user to disable.
   * @returns A promise that resolves to a UserDto object representing the disabled user.
   * @throws An error if the user is not authenticated or if an unexpected error occurs.
   */
  async function disableUser(username: string): Promise<UserDto> {
    if (!isAuthenticated) {
      throw new Error('not authenticated')
    }

    const response = await api.put(`${DISABLE_USER_URL}/${username}`)
    if (response.status === 200) {
      publish(EventType.USER_DISABLED)
      successNotification('User disabled successfully')
      return response.data
    } else {
      errorNotification('Failed to disable user')
    }

    throw new Error('an unexpected error occurred')
  }

  return {
    getUser,
    enableUser,
    disableUser,
  }
}

/**
 * Custom hook for searching users.
 *
 * @param initialSearchParams - Optional initial search parameters.
 * @returns An object containing the search results, search parameters, and a function to update the search parameters.
 */
export function useUsersSearch(initialSearchParams?: Partial<SearchUsersDto>) {
  const { isAuthenticated, user } = useUser()
  if (!user || user.type !== UserType.ADMIN) {
    throw new Error('invalid user type')
  }

  const { subscribe, unsubscribe } = useEvents()

  const [users, setUsers] = useState<SearchResults<UserDto>>({
    total: 0,
    results: [],
  })

  const [searchParams, setSearchParams] = useState<SearchUsersDto>({
    page: 1,
    rowsPerPage: 5,
    sortField: 'username',
    sortDirection: 'desc',
    username: undefined,
    type: undefined,
    firstName: undefined,
    lastName: undefined,
    phoneNumber: undefined,
    email: undefined,
    enabled: true,
    ...(initialSearchParams || {}),
  })

  /**
   * Searches for users based on the provided search parameters.
   *
   * If the user is not authenticated, it sets the users to an empty array.
   * @param searchParams - The search parameters to filter the users.
   */
  async function searchUsers(searchParams?: SearchUsersDto) {
    if (!isAuthenticated) {
      setUsers({ total: 0, results: [] })
      return
    }

    try {
      // Constructing query string from searchParams
      const queryParams = new URLSearchParams()
      Object.entries(searchParams || {}).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })

      const response = await api.get(
        `${SEARCH_USERS_URL}?${queryParams.toString()}`,
      )

      if (response.status === 200) {
        setUsers(response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    function onEvent() {
      searchUsers(searchParams)
    }
    subscribe(EventType.USER_ENABLED, onEvent)
    subscribe(EventType.USER_DISABLED, onEvent)
    return () => {
      unsubscribe(EventType.USER_ENABLED, onEvent)
      unsubscribe(EventType.USER_DISABLED, onEvent)
    }
  }, [searchParams])

  useEffect(() => {
    if (!isAuthenticated) {
      setUsers({ total: 0, results: [] })
    } else {
      searchUsers(searchParams)
    }
  }, [isAuthenticated, searchParams])

  return {
    users,
    searchParams,
    setSearchParams,
  }
}
