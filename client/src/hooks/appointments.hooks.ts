import { useEffect, useState } from 'react'
import api from '../api'
import {
  Appointment,
  BookAppointmentArgs,
  CancelAppointmentArgs,
  CreateAppointmentArgs,
  UserType,
} from '../types'
import { useUser } from './user.hooks'

const ALL_APPOINTMENTS_URL = '/appointment/all'
const GET_APPOINTMENT_URL = '/appointment'
const CREATE_APPOINTMENT_URL = '/appointment'
const BOOK_APPOINTMENT_URL = '/appointment/book'
const CANCEL_APPOINTMENT_URL = '/appointment/cancel'

export function useAppointments() {
  const { isAuthenticated, user } = useUser()

  const [appointments, setAppointments] = useState<Appointment[]>([])

  async function getAppointment(
    appointmentId: string,
  ): Promise<Appointment | null> {
    if (!isAuthenticated) {
      return null
    }

    try {
      const response = await api.get(`${GET_APPOINTMENT_URL}/${appointmentId}`)
      if (response.status === 200) {
        setAppointments(response.data.appointments)
        return response.data.appointment
      } else {
        return null
      }
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async function searchAppointments() {
    if (!isAuthenticated) {
      return
    }

    try {
      const response = await api.get(ALL_APPOINTMENTS_URL)

      // TODO: handle errors
      if (response.status === 200) {
        setAppointments(response.data.appointments)
      }
    } catch (err) {
      console.error(err)
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
        await searchAppointments()
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
        await searchAppointments()
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
        await searchAppointments()
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setAppointments([])
    } else {
      searchAppointments()
    }
  }, [isAuthenticated])

  return {
    appointments,
    getAppointment,
    searchAppointments,
    createAppointment,
    bookAppointment,
    cancelAppointment,
  }
}
