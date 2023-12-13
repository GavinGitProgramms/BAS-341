import { Toaster } from 'react-hot-toast'
import { Link, useLocation } from 'react-router-dom'
import HelpButton from '../components/HelpButton'
import NotificationButton from '../components/NotificationButton'
import { useUser } from '../hooks'
import BASIcon from '../images/BAS.svg'
import { UserType } from '../types'

export type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { isAuthenticated, user, logout } = useUser()

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    logout()
  }

  return (
    <div className="drawer drawer-mobile">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen bg-base-100">
        {/* Navbar */}
        <div className="w-full navbar bg-base-300">
          <div
            className={`flex-none lg:hidden ${
              location.pathname === '/login' ||
              location.pathname === '/register'
                ? 'pointer-events-none'
                : ''
            }`}
          >
            <label htmlFor="main-drawer" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <Link
              to="/"
              className={`flex items-center text-lg font-bold select-none ${
                location.pathname === '/' || location.pathname === '/login'
                  ? 'pointer-events-none'
                  : ''
              }`}
            >
              <img src={BASIcon} alt="BAS Icon" className="w-10 h-10" />
              <span className="ml-2 align-middle">BAS</span>
            </Link>
          </div>

          {/* Notification Button - Always Visible */}
          {isAuthenticated && (
            <>
              <div className="flex-none mt-[0.1em] mr-6">
                <NotificationButton />
              </div>
              <div className="flex-none mr-3">
                <HelpButton />
              </div>
            </>
          )}

          <div className="flex-none hidden lg:block">
            {isAuthenticated ? (
              <div className="flex items-center">
                <ul className="menu menu-horizontal">
                  <li>
                    <Link to="/schedule" className="rounded-btn">
                      {user && user.type === UserType.ADMIN
                        ? 'Appointments'
                        : 'Schedule'}
                    </Link>
                  </li>
                  {user && user.type === UserType.ADMIN && (
                    <li>
                      <Link to="/users" className="rounded-btn">
                        Users
                      </Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="rounded-btn">
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <ul className="menu menu-horizontal">
                {/* Include other navbar links here for unauthenticated users */}
              </ul>
            )}
          </div>
        </div>

        {/* Content */}
        <main className="w-full">{children}</main>
      </div>

      {isAuthenticated && (
        <div className="drawer-side">
          <label htmlFor="main-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 overflow-y-auto w-80 bg-base-200">
            <li>
              <Link to="/schedule" className="rounded-btn">
                {user && user.type === UserType.ADMIN
                  ? 'Appointments'
                  : 'Schedule'}
              </Link>
            </li>
            {user && user.type === UserType.ADMIN && (
              <li>
                <Link to="/users" className="rounded-btn">
                  Users
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="rounded-btn">
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
      <Toaster />
    </div>
  )
}
