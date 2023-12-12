import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser, useAppointments } from '../hooks'
import Layout from '../layout/Layout'
import { Appointment as AppointmentType, UserType } from '../types'
import { toTitleCase } from '../utils'
import BackButton from '../components/GoBack'

export default function Appointment() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { appointmentId } = useParams()

  const { getAppointment, bookAppointment, cancelAppointment } =
    useAppointments()

  const [appointment, setAppointment] = useState<AppointmentType | null>(null)

  useEffect(() => {
    if (appointmentId) {
      getAppointment(appointmentId).then(setAppointment)
    }
  }, [appointmentId])

  async function handleBookAppointment() {
    if (!appointment) {
      return
    }

    await bookAppointment({ id: appointment.id })
    navigate(-1)
  }

  async function handleCancelAppointment() {
    if (!appointment) {
      return
    }

    await cancelAppointment({ id: appointment.id })
    navigate(-1)
  }

  const isProviderView =
    user?.type === UserType.SERVICE_PROVIDER || user?.type === UserType.ADMIN

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {appointment ? (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div>
                <BackButton />
              </div>
              <div className="w-full border-t border-white my-4"></div>
              <h2 className="card-title">Appointment Details</h2>
              <div className="w-full border-t border-white my-4"></div>
              <div className="space-y-4 mb-6">
                <p>
                  <strong>Type:</strong> {toTitleCase(appointment.type)}
                </p>
                <p>
                  <strong>Description:</strong> {appointment.description}
                </p>
                <p>
                  <strong>Start Time:</strong>{' '}
                  {new Date(appointment.start_time).toLocaleString()}
                </p>
                <p>
                  <strong>End Time:</strong>{' '}
                  {new Date(appointment.end_time).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  {appointment.canceled
                    ? 'Canceled'
                    : appointment.user
                    ? 'Booked'
                    : 'Available'}
                </p>
                {!isProviderView && appointment.provider && (
                  <>
                    <p>
                      <strong>Provider:</strong>{' '}
                      {appointment.provider?.username}
                    </p>
                    {/* Display qualifications if available */}
                    <p>
                      <strong>Qualifications:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      {(appointment.provider?.qualifications || []).map(
                        (qual) => (
                          <li
                            key={qual.id}
                            className="text-base-content bg-base-100 rounded-md ml-4 p-2 hover:bg-base-200 transition-colors duration-300"
                          >
                            {qual.description}
                          </li>
                        ),
                      )}
                    </ul>
                  </>
                )}
              </div>
              {!isProviderView && !appointment.canceled && (
                <div className="card-actions justify-end">
                  {appointment.user ? (
                    <button
                      onClick={handleCancelAppointment}
                      className="btn btn-error"
                    >
                      Cancel Appointment
                    </button>
                  ) : (
                    <button
                      onClick={handleBookAppointment}
                      className="btn btn-primary"
                    >
                      Book Appointment
                    </button>
                  )}
                </div>
              )}
              {isProviderView && (
                <div className="card-actions justify-end">
                  {!appointment.canceled && (
                    <button
                      onClick={handleCancelAppointment}
                      className="btn btn-error"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </Layout>
  )
}
