import { useEffect, useState } from 'react'
import api from '../api'
import {
  Appointment,
  AppointmentDto,
  BookAppointmentArgs,
  CancelAppointmentArgs,
  CreateAppointmentArgs,
  EventType,
  SearchAppointmentsDto,
  SearchResults,
  UserType,
} from '../types'
import { errorNotification, successNotification } from '../utils'
import { useEvents } from './event.hooks'
import { useUser } from './user.hooks'

const SEARCH_APPOINTMENTS_URL = '/appointment/search'
const GET_APPOINTMENT_URL = '/appointment'
const CREATE_APPOINTMENT_URL = '/appointment'
const BOOK_APPOINTMENT_URL = '/appointment/book'
const CANCEL_APPOINTMENT_URL = '/appointment/cancel'

/**
 * Custom hook for searching appointments.
 *
 * @param initialSearchParams - The initial search parameters for filtering appointments (optional).
 * @returns An object containing the search results, search parameters, and a function to update the search parameters.
 */
export function useAppointmentsSearch(
  initialSearchParams?: Partial<SearchAppointmentsDto>,
) {
  const { isAuthenticated, user } = useUser()
  const { subscribe, unsubscribe } = useEvents()

  const [appointments, setAppointments] = useState<
    SearchResults<AppointmentDto>
  >({ total: 0, results: [] })

  const isAdmin = isAuthenticated && user?.type === UserType.ADMIN

  const [searchParams, setSearchParams] = useState<SearchAppointmentsDto>({
    page: 1,
    rowsPerPage: 5,
    sortField: 'start_time',
    sortDirection: 'asc',
    userId: undefined,
    providerId: undefined,
    type: undefined,
    description: undefined,
    startTime: undefined,
    endTime: undefined,
    canceled: isAdmin ? undefined : false,
    unbookedOnly: false,
    ...(initialSearchParams || {}),
  })

  /**
   * Searches for appointments based on the provided search parameters.
   *
   * If the user is not authenticated, it sets the appointments to an empty state.
   *
   * @param searchParams - The search parameters for filtering appointments (optional).
   */
  async function searchAppointments(searchParams?: SearchAppointmentsDto) {
    if (!isAuthenticated) {
      setAppointments({ total: 0, results: [] })
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
        `${SEARCH_APPOINTMENTS_URL}?${queryParams.toString()}`,
      )

      if (response.status === 200) {
        setAppointments(response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    function onEvent() {
      searchAppointments(searchParams)
    }

    subscribe(EventType.APPOINTMENT_CREATED, onEvent)
    subscribe(EventType.APPOINTMENT_BOOKED, onEvent)
    subscribe(EventType.APPOINTMENT_CANCELED, onEvent)
    subscribe(EventType.APPOINTMENT_UPDATED, onEvent)

    return () => {
      unsubscribe(EventType.APPOINTMENT_CREATED, onEvent)
      unsubscribe(EventType.APPOINTMENT_BOOKED, onEvent)
      unsubscribe(EventType.APPOINTMENT_CANCELED, onEvent)
      unsubscribe(EventType.APPOINTMENT_UPDATED, onEvent)
    }
  }, [searchParams])

  useEffect(() => {
    if (!isAuthenticated) {
      setAppointments({ total: 0, results: [] })
    } else {
      searchAppointments(searchParams)
    }
  }, [isAuthenticated, searchParams])

  return {
    appointments,
    searchParams,
    setSearchParams,
  }
}

/**
 * Custom hook for managing appointments.
 *
 * Provides functions for retrieving, creating, booking, and canceling appointments.
 */
export function useAppointments() {
  const { publish } = useEvents()
  const { isAuthenticated, user } = useUser()

  /**
   * Retrieves an appointment by its ID.
   *
   * @param appointmentId - The ID of the appointment to retrieve.
   * @returns A Promise that resolves to the retrieved appointment, or null if the user is not authenticated or an error occurs.
   */
  async function getAppointment(
    appointmentId: string,
  ): Promise<Appointment | null> {
    if (!isAuthenticated) {
      return null
    }

    try {
      const response = await api.get(`${GET_APPOINTMENT_URL}/${appointmentId}`)
      if (response.status === 200) {
        return response.data.appointment
      } else {
        return null
      }
    } catch (err) {
      console.error(err)
      return null
    }
  }

  /**
   * Creates a new appointment.
   *
   * @param args - The arguments for creating the appointment.
   */
  async function createAppointment(args: CreateAppointmentArgs) {
    if (!isAuthenticated || user?.type === UserType.REGULAR) {
      return
    }

    try {
      const response = await api.post(CREATE_APPOINTMENT_URL, args)
      if (response.status === 200 || response.status === 201) {
        publish(EventType.APPOINTMENT_CREATED)
        successNotification('Appointment created successfully')
      } else {
        errorNotification('Failed to create appointment')
      }
    } catch (err) {
      console.error(err)
      errorNotification('Failed to create appointment')
    }
  }

  /**
   * Books an appointment.
   *
   * @param args - The arguments for booking the appointment.
   */
  async function bookAppointment(args: BookAppointmentArgs) {
    if (!isAuthenticated || user?.type !== UserType.REGULAR) {
      return
    }

    try {
      const response = await api.post(BOOK_APPOINTMENT_URL, args)
      if (response.status === 200 || response.status === 201) {
        publish(EventType.APPOINTMENT_BOOKED)
        successNotification('Appointment booked successfully')
      } else {
        errorNotification('Failed to book appointment')
      }
    } catch (err) {
      console.error(err)
      errorNotification('Failed to book appointment')
    }
  }

  /**
   * Cancels an appointment.
   *
   * @param args - The arguments for canceling the appointment.
   */
  async function cancelAppointment(args: CancelAppointmentArgs) {
    if (!isAuthenticated) {
      return
    }

    try {
      const response = await api.post(CANCEL_APPOINTMENT_URL, args)
      if (response.status === 200 || response.status === 201) {
        publish(EventType.APPOINTMENT_CANCELED)
        successNotification('Appointment canceled successfully')
      } else {
        errorNotification('Failed to cancel appointment')
      }
    } catch (err) {
      console.error(err)
      errorNotification('Failed to cancel appointment')
    }
  }

  return {
    getAppointment,
    createAppointment,
    bookAppointment,
    cancelAppointment,
  }
}
