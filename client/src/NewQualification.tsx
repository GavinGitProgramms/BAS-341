import { useRef, useState, useEffect, SetStateAction } from 'react'
import axios from './api/axios'
import { Appointment, User } from './types/entity.types'

const USER_URL = '/auth/user'
const QUAL_URL = '/provider/qualification'

const NewQualification = () => {
  const [qualification, setQualification] = useState('')
  const [user, setUser] = useState<User>()

  useEffect(() => {
    try {
      axios
        .get<User>(USER_URL)
        .then((res: { data: SetStateAction<User | undefined> }) =>
          setUser(res.data),
        )
    } catch (error) {}
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        QUAL_URL,
        JSON.stringify({ description: qualification }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      )
      setQualification('')
    } catch (error) {}
  }

  return (
    <>
      <h1>Create Qualification</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="qualification">Qualification:</label>
        <input
          type="text"
          id="qualification"
          autoComplete="off"
          onChange={(e) => setQualification(e.target.value)}
        />
        <button>Add</button>
      </form>
      <br />
      <span className="line">
        <a href="/servicepage">Home</a>
      </span>
    </>
  )
}

export default NewQualification
