import { useRef, useState, useEffect, SetStateAction } from 'react'
import axios from './api/axios'
import { Appointment, User } from './types/entity.types'
import { AppointmentDisplayID } from './components/AppointmentDisplayID'

const USER_URL = '/auth/user'
const APPOINT_URL = '/appointment/all'

const BookAppointment = () => {
  const [user, setUser] = useState<User>()
  const [appointments, setAppointment] = useState<Appointment[]>()

  useEffect(() => {
    try {
      axios
        .get<User>(USER_URL)
        .then((res: { data: SetStateAction<User | undefined> }) =>
          setUser(res.data),
        )
      axios
        .get<{ appointments: Appointment[] }>(APPOINT_URL)
        .then((res) => setAppointment(res.data?.appointments || []))
    } catch (err) {}
  }, [])

  return (
    <>
      <div>
        Available Appointments
        {appointments?.map((appointment) => {
          return (
            <AppointmentDisplayID
              id={appointment.id}
              type={appointment.type}
              provider={appointment.provider}
              start_time={appointment.start_time}
              end_time={appointment.end_time}
            />
          )
        })}
      </div>
    </>
  )
}

export default BookAppointment
