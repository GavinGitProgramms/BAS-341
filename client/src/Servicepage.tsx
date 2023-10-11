import { useRef, useState, useEffect, SetStateAction } from 'react'
import axios from './api/axios'
import { Appointment, User } from './types/entity.types'
import { AppointmentDisplay } from './components/AppointmentDisplay'
import { Logout } from './components/Logout'
import { QualificationDisplay } from './components/QualificationDisplay'

const USER_URL = '/auth/user'
const APPOINT_URL = '/appointment'

const Servicepage = () => {
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
      <div>Welcome, {user?.first_name}!</div>
      <div>
        Qualifications:
        {user?.qualifications.map((qualification) => {
          return <QualificationDisplay qualification={qualification} />
        })}
      </div>
      <div>
        Current Appointments:
        {appointments?.map((appointment) => {
          return (
            <AppointmentDisplay
              type={appointment.type}
              provider={appointment.provider}
              description={appointment.description}
              start_time={appointment.start_time}
              end_time={appointment.end_time}
            />
          )
        })}
      </div>

      <p>
        Want to create a new appointment slot?
        <br />
        <span className="line">
          <a href="/servicepage/newslot">New Slot</a>
        </span>
      </p>

      <p>
        Want to add qualifications?
        <br />
        <span className="line">
          <a href="/servicepage/qualifications">New Qualification</a>
        </span>
      </p>
      <Logout />
    </>
  )
}

export default Servicepage
