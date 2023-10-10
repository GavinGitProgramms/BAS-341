import { useRef, useState, useEffect } from 'react'
import axios from './api/axios'
import { Appointment, User } from './types/entity.types'
import { AppointmentDisplay } from './components/AppointmentDisplay'

const USER_URL = '/auth/user'
const APPOINT_URL = '/appointment'

const Userpage = () => {
  const [user, setUser] = useState<User>()
  const [appointments, setAppointment] = useState<Appointment[]>()

  useEffect(() => {
    try {
      axios.get<User>(USER_URL).then((res) => setUser(res.data))
      axios
        .get<Appointment[]>(APPOINT_URL)
        .then((res) => setAppointment(res.data))
    } catch (err) {}
  }, [])

  return (
    <>
      <div>Welcome, {user?.first_name}</div>
      <div>
        Appointments:
        {appointments?.map((appointment) => {
          return (
            <AppointmentDisplay
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

export default Userpage
