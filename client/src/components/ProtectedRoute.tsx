import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../hooks'
import { UserType } from '../types'

export type ProtectedRouteProps = {
  children: JSX.Element
  userType?: UserType
}

export default function ProtectedRoute({
  children,
  userType,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useUser()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (userType && user?.type !== userType) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}
