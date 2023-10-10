import React from 'react'
import './App.css'
import Login from './Login'
import RegisterUser from './RegisterUser'
import RegisterService from './RegisterService'
import { Route, Routes } from 'react-router'
import './types/entity.types'
import Userpage from './Userpage'
import Servicepage from './Servicepage'
import NewAppointment from './NewAppointment'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registeruser" element={<RegisterUser />} />
        <Route path="/registerservice" element={<RegisterService />} />
        <Route path="/userhomepage" element={<Userpage />} />
        <Route path="/servicepage" element={<Servicepage />} />
        <Route path="/servicepage/newslot" element={<NewAppointment />} />
      </Routes>
    </>
  )
}

export default App
