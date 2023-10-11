import React from 'react'
import { useRef, useState, useEffect } from 'react'
import axios from './api/axios'
import './types/entity.types'

const APPOINT_URL = '/appointment'

const NewAppointment = () => {
  const [type, setType] = useState('')
  const [start_time, setStart] = useState('')
  const [end_time, setEnd] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        APPOINT_URL,
        JSON.stringify({ type, start_time, end_time }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      )
      console.log(response)
      setType('')
      setStart('')
      setEnd('')
    } catch (err) {}
  }

  return (
    <>
      <h1>New Appointment</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="type">Type(MEDICAL, FITNESS, BEAUTY):</label>
        <input
          type="text"
          id="type"
          autoComplete="off"
          onChange={(e) => setType(e.target.value)}
          value={type}
          required
        ></input>
        <br />
        <label htmlFor="start_time">Start Time(format):</label>
        <input
          type="text"
          id="start_time"
          onChange={(e) => setStart(e.target.value)}
          value={start_time}
          required
        ></input>
        <br />
        <label htmlFor="end_time">End Time(format):</label>
        <input
          type="text"
          id="end_time"
          onChange={(e) => setEnd(e.target.value)}
          value={end_time}
          required
        ></input>
        <br />
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          onChange={(e) => setEnd(e.target.value)}
          value={end_time}
          required
        ></input>
        <br />
        <button>Create</button>
      </form>
    </>
  )
}

export default NewAppointment
