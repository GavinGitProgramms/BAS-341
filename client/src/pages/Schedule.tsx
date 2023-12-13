import queryString from 'query-string'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppointmentsTable from '../components/AppointmentsTable'
import CreateAppointmentForm from '../components/CreateAppointmentForm'
import { useAppointments, useUser } from '../hooks'
import AppointmentImg from '../images/Appointment.png'
import ScheduleImg from '../images/Schedule.png'
import Layout from '../layout/Layout'
import { SearchAppointmentsDto, UserType } from '../types'
import { getLocalDateStr } from '../utils'

export default function Schedule() {
  const { user, isAdmin, isProvider } = useUser()
  const navigate = useNavigate()
  const { createAppointment } = useAppointments()
  const [searchParams, setSearchParams] = useState<SearchAppointmentsDto>()

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

  function handleReportRedirect() {
    if (searchParams) {
      const query = queryString.stringify(searchParams)
      navigate(`/report?${query}`)
    }
  }

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
                <div className="flex justify-between">
                  <h2 className="card-title">{listTitle}</h2>
                  {isAdmin && (
                    <button
                      onClick={handleReportRedirect}
                      className="btn btn-primary"
                    >
                      Generate Report
                    </button>
                  )}
                </div>
                {/* For regular users, show a table of appointments that they have booked */}
                <AppointmentsTable
                  onClick={handleRowClick}
                  onFiltersChange={isAdmin ? setSearchParams : undefined}
                  initialSearchParams={
                    user && isAdmin
                      ? undefined
                      : { startTime: getLocalDateStr(new Date()), canceled: false }
                  }
                />
              </div>
            </div>
          </div>

          {user && isAdmin ? (
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
                  {user && isProvider ? (
                    <CreateAppointmentForm onSubmit={createAppointment} />
                  ) : (
                    // For regular users, show a table of appointments that haven't been booked yet
                    <AppointmentsTable
                      hideCanceledFilter
                      onClick={handleRowClick}
                      initialSearchParams={{
                        unbookedOnly: true,
                        canceled: false,
                        startTime: getLocalDateStr(new Date()),
                      }}
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
