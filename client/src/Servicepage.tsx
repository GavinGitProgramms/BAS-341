import { useRef, useState, useEffect, SetStateAction } from 'react'
import axios from './api/axios'
import { Appointment, User } from './types/entity.types'
import { AppointmentDisplay } from './components/AppointmentDisplay'
import { Logout } from './components/Logout'

const USER_URL = '/auth/user'

const Servicepage = () => {
  const [user, setUser] = useState<User>()
  const [appointments, setAppointment] = useState<Appointment[]>()

  /*
  useEffect(() => {
    try {
      axios
        .get<User>(USER_URL)
        .then((res: { data: SetStateAction<User | undefined> }) =>
          setUser(res.data),
        )
    } catch (err) {}
  }, []) */

  const startNewAppointment = () => {}

  return (
    <>
      <div>Welcome, {user?.first_name}!</div>
      <p>
        Want to create a new appointment slot?
        <br />
        <span className="line">
          <a href="/servicepage/newslot">New Slot</a>
        </span>
      </p>
      <Logout />
    </>
  )
}

export default Servicepage
