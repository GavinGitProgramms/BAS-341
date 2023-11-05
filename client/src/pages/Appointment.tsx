import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUser, useAppointments } from '../hooks'
import Layout from '../layout/Layout'
import { Appointment as AppointmentType, UserType } from '../types'
import { toTitleCase } from '../utils'

export default function Appointment() {
  const { user } = useUser()
  const { appointmentId } = useParams()

  const { getAppointment, bookAppointment, unbookAppointment } =
    useAppointments()

  const [appointment, setAppointment] = useState<AppointmentType | null>(null)

  useEffect(() => {
    if (appointmentId) {
      getAppointment(appointmentId).then(setAppointment)
    }
  }, [appointmentId])

  function handleBookAppointment() {
    if (appointment) {
      bookAppointment({ id: appointment.id })
    }
  }

  function handleUnbookAppointment() {
    if (appointment) {
      unbookAppointment({ id: appointment.id })
    }
  }

  console.log(appointment)

  const isProviderView = user?.type === UserType.SERVICE_PROVIDER

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {appointment ? (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-6">Appointment Details</h2>
              <div className="space-y-4">
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
                    <ul>
                      {(appointment.provider?.qualifications || []).map(
                        (qual) => (
                          <li key={qual.id}>{qual.description}</li>
                        ),
                      )}
                    </ul>
                  </>
                )}
                <p>
                  <strong>Status:</strong>{' '}
                  {appointment.user ? 'Booked' : 'Available'}
                </p>
              </div>
              {!isProviderView && (
                <div className="card-actions justify-end">
                  {appointment.user ? (
                    <button
                      onClick={handleUnbookAppointment}
                      className="btn btn-error"
                    >
                      Unbook Appointment
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
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </Layout>
  )
}
