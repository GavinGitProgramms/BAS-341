import { useState, useMemo, useEffect } from 'react'
import { Appointment, UserType, SortOrder } from '../types'
import { useUser } from '../hooks'
import { toTitleCase } from '../utils'

export type AppointmentsTableProps = {
  appointments: Appointment[]
  onClick?: (appointmentId: string) => void
}

export default function AppointmentsTable({
  appointments,
  onClick,
}: AppointmentsTableProps) {
  const { user } = useUser()
  const isProviderView = user?.type === UserType.SERVICE_PROVIDER

  // States for sorting and pagination
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // A function to handle sorting
  const onSortChange = (field: string) => {
    setSortField(field)
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  // Sorting the appointments
  const sortedAppointments = useMemo(() => {
    if (!sortField) return appointments

    if (sortField === 'provider') {
      const sorted = [...appointments].sort((a, b) => {
        if (a.provider?.username < b.provider?.username)
          return sortOrder === 'asc' ? -1 : 1
        if (a.provider?.username > b.provider?.username)
          return sortOrder === 'asc' ? 1 : -1
        return 0
      })

      return sorted
    } else {
      const sorted = [...appointments].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1
        return 0
      })

      return sorted
    }
  }, [appointments, sortField, sortOrder])

  // Get the current page of appointments
  const currentAppointments = useMemo(() => {
    return paginate(sortedAppointments, currentPage, pageSize)
  }, [sortedAppointments, currentPage])

  // Pagination controls
  const totalPages = Math.ceil(appointments.length / pageSize)

  useEffect(() => {
    // Reset to the first page when appointments array changes
    setCurrentPage(1)
  }, [appointments.length])

  // A helper function to generate the header cell
  function renderHeaderCell(label: string, field: string) {
    return (
      <th
        className="px-6 py-3 cursor-pointer select-none"
        onClick={() => onSortChange(field)}
      >
        {label} {sortField === field && (sortOrder === 'asc' ? '🔼' : '🔽')}
      </th>
    )
  }

  function handleRowClick(appointmentId: number) {
    return (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
      e.preventDefault()
      onClick?.(appointmentId)
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="select-none">
              {renderHeaderCell('Type', 'type')}
              {(user?.type === UserType.REGULAR || user?.type === UserType.ADMIN) &&
                renderHeaderCell('Provider', 'provider')}
              {(user?.type === UserType.SERVICE_PROVIDER || user?.type === UserType.ADMIN) &&
                renderHeaderCell('User', 'user')}
              {renderHeaderCell('Description', 'description')}
              {renderHeaderCell('Start Time', 'start_time')}
              {renderHeaderCell('End Time', 'end_time')}
              {isProviderView && renderHeaderCell('Booked', 'isBooked')}
              {renderHeaderCell('Cancelled', 'canceled')}
            </tr>
          </thead>
          <tbody>
            {currentAppointments.map((appointment) => (
              <tr
                key={appointment.id}
                className={onClick ? 'hover:bg-base-100 cursor-pointer' : ''}
                onClick={onClick && handleRowClick(appointment.id)}
              >
                <td className="px-6 py-4">{toTitleCase(appointment.type)}</td>
                {(user?.type === UserType.REGULAR || user?.type === UserType.ADMIN) && (
                  <td className="px-6 py-4">
                    {appointment.provider?.username}
                  </td>
                )}
                {(user?.type === UserType.SERVICE_PROVIDER || user?.type === UserType.ADMIN) && (
                  <td className="px-6 py-4">
                    {appointment.user?.username}
                  </td>
                )}
                <td className="px-6 py-4 text-ellipsis overflow-hidden">
                  {appointment.description}
                </td>
                <td className="px-6 py-4">
                  {new Date(appointment.start_time).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(appointment.end_time).toLocaleString()}
                </td>
                {isProviderView && (
                  <td className="px-6 py-4">
                    {appointment.user ? 'Yes' : 'No'}
                  </td>
                )}
                <td className="px-6 py-4">
                  {appointment.canceled ? 'Yes' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1 || appointments.length === 0}
          className="px-4 py-2 text-sm btn btn-primary"
        >
          Previous
        </button>
        <span>
          Page {appointments.length === 0 ? 0 : currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || appointments.length === 0}
          className="px-4 py-2 text-sm text-sm btn btn-primary"
        >
          Next
        </button>
      </div>
    </>
  )
}

// A simple pagination helper function
function paginate(array: any[], pageNumber: number, pageSize: number) {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}
