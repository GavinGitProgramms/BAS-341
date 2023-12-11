import { Route, Routes } from 'react-router'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import { useUser } from './hooks'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Schedule from './pages/Schedule'
import Users from './pages/Users'
import UserProvider from './providers/UserProvider'
import Appointment from './pages/Appointment'
import EventProvider from './providers/EventProvider'
import { UserType } from './types'

export default function App() {
  return (
    <UserProvider>
      <EventProvider>
        <AppRoutes />
      </EventProvider>
    </UserProvider>
  )
}

function AppRoutes() {
  const { loading } = useUser()
  if (loading) {
    // TODO: create a better loading screen
    return <div></div>
  }

  // Each protected route requires the user to be logged in. If they are not
  // they are redirected to the /login page.
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <Schedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute userType={UserType.ADMIN}>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointment/:appointmentId"
        element={
          <ProtectedRoute>
            <Appointment />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}
