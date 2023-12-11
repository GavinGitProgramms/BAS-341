import { useUsersSearch, useUser } from '../hooks'
import { UserType, SearchUsersDto } from '../types'
import { toTitleCase } from '../utils'

export type UsersTableProps = {
  initialSearchParams?: Partial<SearchUsersDto>
  onClick?: (userId: string) => void
}

export default function UsersTable({
  initialSearchParams,
  onClick,
}: UsersTableProps) {
  const { user } = useUser()
  const { users, searchParams, setSearchParams } =
    useUsersSearch(initialSearchParams)

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
    return (
      <form className="my-4 grid grid-cols-2 gap-4">
        {user?.type === UserType.ADMIN && (
          <div className="form-control w-full">
            <label className="label" htmlFor="username">
              <span className="label-text">User</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={searchParams.username || ''}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
          </div>
        )}
        <div className="form-control w-full">
          <label className="label" htmlFor="type">
            <span className="label-text">User Type</span>
          </label>
          <select
            id="type"
            name="type"
            value={searchParams.type || ''}
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            <option value="">Select Type</option>
            <option value={UserType.REGULAR}>
              {toTitleCase(UserType.REGULAR)}
            </option>
            <option value={UserType.SERVICE_PROVIDER}>
              {toTitleCase(UserType.SERVICE_PROVIDER)}
            </option>
          </select>
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="firstName">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={searchParams.firstName || ''}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="lastName">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={searchParams.lastName || ''}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="phoneNumber">
            <span className="label-text">Phone Number</span>
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={searchParams.phoneNumber || ''}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={searchParams.email || ''}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="enabled">
            <span className="label-text">Enabled</span>
          </label>
          <select
            id="enabled"
            name="enabled"
            value={
              searchParams.enabled !== undefined
                ? String(searchParams.enabled)
                : ''
            }
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
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

  function handleRowClick(userId: string) {
    return (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
      e.preventDefault()
      onClick?.(userId)
    }
  }

  return (
    <>
      {renderSearchForm()}
      <div className="overflow-x-auto min-h-[500px]">
        <table className="table w-full">
          <thead>
            <tr className="select-none">
              {renderHeaderCell('Username', 'username')}
              {renderHeaderCell('Type', 'type')}
              {renderHeaderCell('First Name', 'first_name')}
              {renderHeaderCell('Last Name', 'last_name')}
              {renderHeaderCell('Phone Number', 'phone_number')}
              {renderHeaderCell('Email', 'email')}
            </tr>
          </thead>
          <tbody>
            {users.results.map((user) => (
              <tr
                key={user.username}
                className={onClick ? 'hover:bg-base-100 cursor-pointer' : ''}
                onClick={onClick && handleRowClick(user.username)}
              >
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">{toTitleCase(user.type)}</td>
                <td className="px-6 py-4 text-ellipsis overflow-hidden">
                  {user.first_name}
                </td>
                <td className="px-6 py-4 text-ellipsis overflow-hidden">
                  {user.last_name}
                </td>
                <td className="px-6 py-4 text-ellipsis overflow-hidden">
                  {user.phone_number}
                </td>
                <td className="px-6 py-4 text-ellipsis overflow-hidden">
                  {user.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(searchParams.page - 1)}
          disabled={searchParams.page === 1}
          className="px-4 py-2 text-sm btn btn-primary"
        >
          Previous
        </button>
        <span>
          Page {users.total ? searchParams.page : 0} of{' '}
          {Math.ceil(users.total / searchParams.rowsPerPage)}
        </span>
        <button
          onClick={() => handlePageChange(searchParams.page + 1)}
          disabled={
            searchParams.page ===
            Math.ceil(users.total / searchParams.rowsPerPage)
          }
          className="px-4 py-2 text-sm btn btn-primary"
        >
          Next
        </button>
      </div>
    </>
  )
}
