import api from '../api'
import { useContext, useEffect, useState } from 'react'
import { UserContext, UserContextType } from '../providers/UserProvider'
import { SearchResults, SearchUsersDto, UserDto } from '../types'
import { useEvents } from './event.hooks'

const SEARCH_USERS_URL = '/auth/user/search'

export function useUser(): UserContextType {
  const context = useContext<UserContextType>(UserContext)
  return context
}

export function useUsersSearch(initialSearchParams?: Partial<SearchUsersDto>) {
  const { isAuthenticated } = useUser()
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
    ...(initialSearchParams || {}),
  })

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
    // function onEvent() {
    //   searchUsers(searchParams)
    // }
    // subscribe(EventType.APPOINTMENT_CREATED, onEvent)
    // subscribe(EventType.APPOINTMENT_BOOKED, onEvent)
    // subscribe(EventType.APPOINTMENT_CANCELED, onEvent)
    // subscribe(EventType.APPOINTMENT_UPDATED, onEvent)
    // return () => {
    //   unsubscribe(EventType.APPOINTMENT_CREATED, onEvent)
    //   unsubscribe(EventType.APPOINTMENT_BOOKED, onEvent)
    //   unsubscribe(EventType.APPOINTMENT_CANCELED, onEvent)
    //   unsubscribe(EventType.APPOINTMENT_UPDATED, onEvent)
    // }
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
