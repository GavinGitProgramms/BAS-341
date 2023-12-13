import { useEffect } from 'react'
import { useAppointmentsSearch, useUser } from '../hooks'
import { AppointmentType, SearchAppointmentsDto, UserType } from '../types'
import { toTitleCase } from '../utils'

export type AppointmentsTableProps = {
  initialSearchParams?: Partial<SearchAppointmentsDto>
  onClick?: (appointmentId: string) => void
  onFiltersChange?: (filters: SearchAppointmentsDto) => void
  hideCanceledFilter?: boolean
}

export default function AppointmentsTable({
  initialSearchParams,
  onClick,
  onFiltersChange,
  hideCanceledFilter = false,
}: AppointmentsTableProps) {
  const { user, isAdmin, isProvider } = useUser()
  const { appointments, searchParams, setSearchParams } =
    useAppointmentsSearch(initialSearchParams)

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(searchParams)
    }
  }, [searchParams])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setSearchParams({
      ...searchParams,
      page: 1,
      [e.target.name]: e.target.value,
    })
  }

  // Assuming the API now handles pagination
  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }))
  }

  // Render UI elements based on user type
  function renderSearchForm() {
    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStartTime = e.target.value
      setSearchParams({
        ...searchParams,
        page: 1,
        startTime: newStartTime,
        endTime:
          searchParams.endTime && newStartTime > searchParams.endTime
            ? ''
            : searchParams.endTime,
      })
    }

    return (
      <form className="my-4 grid grid-cols-2 gap-4">
        {user?.type === UserType.ADMIN && (
          <div className="form-control w-full">
            <label className="label" htmlFor="userId">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={searchParams.userId || ''}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
          </div>
        )}
        {(user?.type === UserType.ADMIN || user?.type === UserType.REGULAR) && (
          <div className="form-control w-full">
            <label className="label" htmlFor="providerId">
              <span className="label-text">Provider Username</span>
            </label>
            <input
              type="text"
              id="providerId"
              name="providerId"
              value={searchParams.providerId || ''}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
          </div>
        )}
        <div className="form-control w-full">
          <label className="label" htmlFor="type">
            <span className="label-text">Appointment Type</span>
          </label>
          <select
            id="type"
            name="type"
            value={searchParams.type || ''}
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            <option value="">Select Type</option>
            {Object.values(AppointmentType).map((type) => (
              <option key={type} value={type}>
                {toTitleCase(type)}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="description">
            <span className="label-text">Description</span>
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={searchParams.description || ''}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="startTime">
            <span className="label-text">Start Time After</span>
          </label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={searchParams.startTime || ''}
            onChange={handleStartTimeChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="endTime">
            <span className="label-text">End Time Before</span>
          </label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            min={searchParams.startTime || ''}
            value={searchParams.endTime || ''}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        {!hideCanceledFilter && (
          <div className="form-control w-full">
            <label className="label" htmlFor="canceled">
              <span className="label-text">Is Canceled</span>
            </label>
            <select
              id="canceled"
              name="canceled"
              value={
                searchParams.canceled !== undefined
                  ? String(searchParams.canceled)
                  : ''
              }
              onChange={handleInputChange}
              className="select select-bordered w-full"
            >
              {isAdmin && <option value="">Select a Value</option>}
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        )}
      </form>
    )
  }

  const onSortChange = (field: string) => {
    setSearchParams({
      ...searchParams,
      page: 1,
      sortField: field,
      sortDirection: searchParams.sortDirection === 'asc' ? 'desc' : 'asc',
    })
  }

  // A helper function to generate the header cell
  function renderHeaderCell(label: string, field: string) {
    return (
      <th
        className="px-6 py-3 cursor-pointer select-none"
        onClick={() => onSortChange(field)}
      >
        {label}{' '}
        {searchParams.sortField === field &&
          (searchParams.sortDirection === 'asc' ? '🔼' : '🔽')}
      </th>
    )
  }

  function handleRowClick(appointmentId: string) {
    return (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
      e.preventDefault()
      onClick?.(appointmentId)
    }
  }

  return (
    <>
      {renderSearchForm()}
      <div className="overflow-x-auto min-h-[500px]">
        <table className="table w-full">
          <thead>
            <tr className="select-none">
              {renderHeaderCell('Type', 'type')}
              {(user?.type === UserType.REGULAR ||
                user?.type === UserType.ADMIN) &&
                renderHeaderCell('Provider', 'provider')}
              {(user?.type === UserType.SERVICE_PROVIDER ||
                user?.type === UserType.ADMIN) &&
                renderHeaderCell('User', 'user')}
              {renderHeaderCell('Description', 'description')}
              {renderHeaderCell('Start Time', 'start_time')}
              {renderHeaderCell('End Time', 'end_time')}
              {isProvider && <th className="px-6 py-3 select-none">Booked</th>}
              {isAdmin && <th className="px-6 py-3 select-none">Canceled</th>}
            </tr>
          </thead>
          <tbody>
            {appointments.results.map((appointment) => (
              <tr
                key={appointment.id}
                className={onClick ? 'hover:bg-base-100 cursor-pointer' : ''}
                onClick={onClick && handleRowClick(appointment.id)}
              >
                <td className="px-6 py-4">{toTitleCase(appointment.type)}</td>
                {(user?.type === UserType.REGULAR ||
                  user?.type === UserType.ADMIN) && (
                  <td className="px-6 py-4">
                    {appointment.provider?.username}
                  </td>
                )}
                {(user?.type === UserType.SERVICE_PROVIDER ||
                  user?.type === UserType.ADMIN) && (
                  <td className="px-6 py-4">
                    {appointment.user?.username || 'N/a'}
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
                {isProvider && (
                  <td className="px-6 py-4">
                    {appointment.user ? 'Yes' : 'No'}
                  </td>
                )}
                {isAdmin && (
                  <td className="px-6 py-4">
                    {appointment.canceled ? 'Yes' : 'No'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(searchParams.page - 1)}
          disabled={appointments.total === 0 || searchParams.page === 1}
          className="px-4 py-2 text-sm btn btn-primary"
        >
          Previous
        </button>
        <span>
          Page {appointments.total ? searchParams.page : 0} of{' '}
          {Math.ceil(appointments.total / searchParams.rowsPerPage)}
        </span>
        <button
          onClick={() => handlePageChange(searchParams.page + 1)}
          disabled={
            appointments.total === 0 ||
            searchParams.page ===
              Math.ceil(appointments.total / searchParams.rowsPerPage)
          }
          className="px-4 py-2 text-sm btn btn-primary"
        >
          Next
        </button>
      </div>
    </>
  )
}
