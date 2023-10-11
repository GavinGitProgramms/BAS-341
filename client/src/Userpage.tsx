import { useRef, useState, useEffect, SetStateAction } from 'react'
import axios from './api/axios'
import { Appointment, User } from './types/entity.types'
import { AppointmentDisplay } from './components/AppointmentDisplay'
import { Logout } from './components/Logout'

const USER_URL = '/auth/user'
const APPOINT_URL = '/appointment'

const Userpage = () => {
  const [user, setUser] = useState<User>()
  const [appointments, setAppointment] = useState<Appointment[]>([])

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
      <p>
        <br />
        <span className="line">
          <a href="/userhomepage/bookapp">Book New Appointment</a>
        </span>
      </p>
      <Logout />
    </>
  )
}

export default Userpage
