import { Route, Routes } from 'react-router'
import './App.css'
import BookAppointment from './BookAppointment'
import NewAppointment from './NewAppointment'
import NewQualification from './NewQualification'
import RegisterService from './RegisterService'
import RegisterUser from './RegisterUser'
import Servicepage from './Servicepage'
import Userpage from './Userpage'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import UserProvider from './providers/UserProvider'
import { useUser } from './hooks'

export default function App() {
  return (
    <UserProvider>
      <AppRoutes />
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/userhomepage" element={<Userpage />} />
      <Route path="/userhomepage/bookapp" element={<BookAppointment />} />
      <Route path="/servicepage" element={<Servicepage />} />
      <Route path="/servicepage/newslot" element={<NewAppointment />} />
      <Route
        path="/servicepage/qualifications"
        element={<NewQualification />}
      />
    </Routes>
  )
}
