import { useRef, useState, useEffect, SetStateAction } from 'react'
import axios from './api/axios'
import { Appointment, User } from './types/entity.types'
import { AppointmentDisplayID } from './components/AppointmentDisplayID'

const USER_URL = '/auth/user'
const APPOINT_URL = '/appointment/all'
const BOOK_URL = '/appointment/book'

const BookAppointment = () => {
  const [user, setUser] = useState<User>()
  const [appointments, setAppointment] = useState<Appointment[]>()
  const [appID, setAppID] = useState('')

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

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const response = await axios.post(BOOK_URL, JSON.stringify({ id: appID }))
      setAppID('')
    } catch (error) {}
  }

  return (
    <>
      <div>
        Available Appointments
        <br />
        Beauty:
        <br />
        {appointments?.map((appointment) => {
          if (appointment.type === 'BEAUTY') {
            return (
              <AppointmentDisplayID
                id={appointment.id}
                type={appointment.type}
                provider={appointment.provider}
                description={appointment.description}
                start_time={appointment.start_time}
                end_time={appointment.end_time}
              />
            )
          } else {
            return null
          }
        })}
        <br />
        Fitness:
        <br />
        {appointments?.map((appointment) => {
          if (appointment.type === 'FITNESS') {
            return (
              <AppointmentDisplayID
                id={appointment.id}
                type={appointment.type}
                provider={appointment.provider}
                description={appointment.description}
                start_time={appointment.start_time}
                end_time={appointment.end_time}
              />
            )
          } else {
            return null
          }
        })}
        <br />
        Medical:
        <br />
        {appointments?.map((appointment) => {
          if (appointment.type === 'MEDICAL') {
            return (
              <AppointmentDisplayID
                id={appointment.id}
                type={appointment.type}
                provider={appointment.provider}
                description={appointment.description}
                start_time={appointment.start_time}
                end_time={appointment.end_time}
              />
            )
          } else {
            return null
          }
        })}
        <br />
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="appointmentid">Appointment ID:</label>
        <input
          type="text"
          id="appointmentid"
          autoComplete="off"
          onChange={(e) => setAppID(e.target.value)}
        />
        <button>Book</button>
      </form>
      <br />
      <span className="line">
        <a href="/userhomepage">Home</a>
      </span>
    </>
  )
}

export default BookAppointment
