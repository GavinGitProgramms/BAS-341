import { useUser, useAppointments } from '../hooks'
import ScheduleImg from '../images/Schedule.png' // Placeholder image for qualifications card
import AppointmentImg from '../images/Appointment.png' // Placeholder image for qualifications card
import Layout from '../layout/Layout'
import { UserType } from '../types' // Import UserType enum
import CreateAppointmentForm from '../components/CreateAppointmentForm'
import AppointmentsTable from '../components/AppointmentsTable'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Schedule() {
  const { user } = useUser()
  const [show, setShow] = useState(true)
  const navigate = useNavigate()
  const { appointments, createAppointment } = useAppointments()

  const appointmentsTitle =
    user && user.type === UserType.SERVICE_PROVIDER
      ? 'Create an Appointment'
      : 'Book an Appointment'

  const bookedAppointments = appointments.filter(
    (appointment) => appointment.user?.username === user?.username,
  )

  const unbookedAppointments = appointments.filter(
    (appointment) => !appointment.user,
  )

  function handleRowClick(appointmentId: string) {
    navigate(`/appointment/${appointmentId}`)
  }

  return (
    <Layout>
      <div className="container p-6 mx-auto">
        <div className="flex flex-col items-center -mx-2">
          <div className="w-full md:w-2/3 px-2 mb-4">
            <div className="card bg-base-200  shadow-xl h-auto">
              <figure className="h-48 overflow-hidden">
                <img
                  src={ScheduleImg}
                  alt="Schedule"
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Your Schedule</h2>
                {/* For regular users, show a table of appointments that they have booked */}
                <AppointmentsTable
                  onClick={handleRowClick}
                  appointments={
                    user?.type === UserType.REGULAR
                      ? bookedAppointments
                      : appointments
                  }
                />
              </div>
            </div>
          </div>
          
          {user && user.type === UserType.ADMIN ? (<></>) : (
            <div className="w-full md:w-2/3 px-2 mb-4">
            <div className="card bg-base-200 shadow-xl h-auto">
              <figure className="h-48 overflow-hidden">
                <img
                  src={AppointmentImg}
                  alt="Appointment"
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{appointmentsTitle}</h2>
                {user && user.type === UserType.SERVICE_PROVIDER ? (
                  <CreateAppointmentForm onSubmit={createAppointment} />
                ) : (
                  // For regular users, show a table of appointments that haven't been booked yet
                    <AppointmentsTable
                      onClick={handleRowClick}
                      appointments={unbookedAppointments}
                    />
                )}
              </div>
            </div>
          </div>
          )}
          
        </div>
      </div>
    </Layout>
  )
}
