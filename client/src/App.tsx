import React from 'react'
import './App.css'
import Login from './Login'
import RegisterUser from './RegisterUser'
import RegisterService from './RegisterService'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registeruser" element={<RegisterUser />} />
        <Route path="/registerservice" element={<RegisterService />} />
      </Routes>
    </>
  )
}

export default App
