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
import UserProvider from './providers/UserContext'

export default function App() {
  return (
    <UserProvider>
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
        <Route path="/registeruser" element={<RegisterUser />} />
        <Route path="/registerservice" element={<RegisterService />} />
        <Route path="/userhomepage" element={<Userpage />} />
        <Route path="/userhomepage/bookapp" element={<BookAppointment />} />
        <Route path="/servicepage" element={<Servicepage />} />
        <Route path="/servicepage/newslot" element={<NewAppointment />} />
        <Route
          path="/servicepage/qualifications"
          element={<NewQualification />}
        />
      </Routes>
    </UserProvider>
  )
}
