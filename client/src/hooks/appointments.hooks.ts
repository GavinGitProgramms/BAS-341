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
import { useEvents } from './event.hooks'
import { useUser } from './user.hooks'

const SEARCH_APPOINTMENTS_URL = '/appointment/search'
const GET_APPOINTMENT_URL = '/appointment'
const CREATE_APPOINTMENT_URL = '/appointment'
const BOOK_APPOINTMENT_URL = '/appointment/book'
const CANCEL_APPOINTMENT_URL = '/appointment/cancel'

export function useAppointmentsSearch(
  initialSearchParams?: Partial<SearchAppointmentsDto>,
) {
  const { isAuthenticated } = useUser()
  const { subscribe, unsubscribe } = useEvents()

  const [appointments, setAppointments] = useState<
    SearchResults<AppointmentDto>
  >({ total: 0, results: [] })

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
    canceled: false,
    unbookedOnly: false,
    ...(initialSearchParams || {}),
  })

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

export function useAppointments() {
  const { isAuthenticated, user } = useUser()
  const { publish } = useEvents()

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

  async function createAppointment(args: CreateAppointmentArgs) {
    if (!isAuthenticated || user?.type === UserType.REGULAR) {
      return
    }

    try {
      const response = await api.post(CREATE_APPOINTMENT_URL, args)

      // TODO: handle errors
      if (response.status === 200 || response.status === 201) {
        publish(EventType.APPOINTMENT_CREATED)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function bookAppointment(args: BookAppointmentArgs) {
    if (!isAuthenticated || user?.type !== UserType.REGULAR) {
      return
    }

    try {
      const response = await api.post(BOOK_APPOINTMENT_URL, args)

      // TODO: handle errors
      if (response.status === 200 || response.status === 201) {
        publish(EventType.APPOINTMENT_BOOKED)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function cancelAppointment(args: CancelAppointmentArgs) {
    if (!isAuthenticated) {
      return
    }

    try {
      const response = await api.post(CANCEL_APPOINTMENT_URL, args)

      // TODO: handle errors
      if (response.status === 200 || response.status === 201) {
        publish(EventType.APPOINTMENT_CANCELED)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    getAppointment,
    createAppointment,
    bookAppointment,
    cancelAppointment,
  }
}
