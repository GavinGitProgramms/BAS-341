import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppointmentsTable from '../components/AppointmentsTable'
import CreateAppointmentForm from '../components/CreateAppointmentForm'
import { useAppointments, useUser } from '../hooks'
import AppointmentImg from '../images/Appointment.png' // Placeholder image for qualifications card
import ScheduleImg from '../images/Schedule.png' // Placeholder image for qualifications card
import Layout from '../layout/Layout'
import { UserType } from '../types' // Import UserType enum

export default function Schedule() {
  const { user } = useUser()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { createAppointment } = useAppointments()

  const appointmentsTitle =
    user && user.type === UserType.SERVICE_PROVIDER
      ? 'Create an Appointment'
      : 'Book an Appointment'

  const listTitle =
    user && user.type === UserType.ADMIN
      ? 'All Appointments'
      : 'Your Appointments'

  function handleRowClick(appointmentId: string) {
    navigate(`/appointment/${appointmentId}`)
  }

  useEffect(() => {
    if (sessionStorage.getItem('scrollToTopOnBack') === 'true') {
      // Scroll to the top
      window.scrollTo(0, 0)

      // Clear the flag
      sessionStorage.removeItem('scrollToTopOnBack')
    }
  }, [])

  return (
    <Layout>
      <div className="container p-6 mx-auto">
        <div className="flex flex-col items-center -mx-2">
          <div className="w-full xl:w-2/3 px-2 mb-4">
            <div className="card bg-base-200 shadow-xl h-auto">
              <figure className="h-48 overflow-hidden">
                <img
                  src={ScheduleImg}
                  alt="Schedule"
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{listTitle}</h2>
                {/* For regular users, show a table of appointments that they have booked */}
                <AppointmentsTable
                  onClick={handleRowClick}
                  filterRows={
                    user && user.type === UserType.REGULAR
                      ? (appointment) => Boolean(appointment.user)
                      : undefined
                  }
                />
              </div>
            </div>
          </div>

          {user && user.type === UserType.ADMIN ? (
            <></>
          ) : (
            <div className="w-full xl:w-2/3 px-2 mb-4">
              <div className="card bg-base-200 shadow-xl h-auto">
                <figure className="h-48 overflow-hidden">
                  <img
                    src={AppointmentImg}
                    alt="Appointment"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <div className="flex">
                    <h2 className="card-title w-1/3">{appointmentsTitle}</h2>
                  </div>
                  {user && user.type === UserType.SERVICE_PROVIDER ? (
                    <CreateAppointmentForm onSubmit={createAppointment} />
                  ) : (
                    // For regular users, show a table of appointments that haven't been booked yet
                    <AppointmentsTable
                      hideCanceledFilter
                      onClick={handleRowClick}
                      filterRows={(appointment) => !appointment.user}
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
