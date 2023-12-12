import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BackButton from '../components/GoBack'
import { useUserAdmin } from '../hooks'
import Layout from '../layout/Layout'
import { UserDto, UserType } from '../types'
import { toTitleCase } from '../utils'

export default function User() {
  const navigate = useNavigate()
  const { username } = useParams()
  const [user, setUser] = useState<UserDto | null>(null)
  const { getUser, enableUser, disableUser } = useUserAdmin()

  useEffect(() => {
    if (username) {
      try {
        getUser(username).then(setUser)
      } catch (err) {
        console.error(err)
        setUser(null)
      }
    }
  }, [username])

  async function handleEnableUser() {
    if (!username || !user) {
      return
    }

    await enableUser(username)
    navigate(-1)
  }

  async function handleDisableUser() {
    if (!username || !user) {
      return
    }

    await disableUser(username)
    navigate(-1)
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {user ? (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div>
                <BackButton />
              </div>
              <div className="w-full border-t border-white my-4"></div>
              <h2 className="card-title">User Details</h2>
              <div className="w-full border-t border-white my-4"></div>
              <div className="space-y-4 mb-6">
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Type:</strong> {toTitleCase(user.type)}
                </p>
                <p>
                  <strong>First Name:</strong> {user.first_name}
                </p>
                <p>
                  <strong>Last Name:</strong> {user.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone Number:</strong> {user.phone_number}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  {user.enabled ? 'Enabled' : 'Disabled'}
                </p>
                {user.type === UserType.SERVICE_PROVIDER && (
                  <>
                    {/* Display qualifications if available */}
                    <p>
                      <strong>Qualifications:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      {(user?.qualifications || []).map((qual) => (
                        <li
                          key={qual.id}
                          className="text-base-content bg-base-100 rounded-md ml-4 p-2 hover:bg-base-200 transition-colors duration-300"
                        >
                          {qual.description}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <div className="card-actions justify-end">
                {user.enabled ? (
                  <button onClick={handleDisableUser} className="btn btn-error">
                    Disable User
                  </button>
                ) : (
                  <button
                    onClick={handleEnableUser}
                    className="btn btn-primary"
                  >
                    Enable User
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </Layout>
  )
}
