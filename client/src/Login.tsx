import React from 'react'
import { useRef, useState, useEffect, SetStateAction } from 'react'
import axios from './api/axios'
import { Appointment, User, UserType } from './types/entity.types'
import { types } from 'util'

const USER_URL = '/auth/user'
const LOGIN_URL = '/auth/login'

const Login = () => {
  const userRef: any = useRef()
  const errRef: any = useRef()

  const [user, setUser] = useState('')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [profile, setProfile] = useState<User>()
  const [type, setType] = useState<UserType>()
  const [anchor, setAnchor] = useState('')

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const checkType = async (e: UserType | undefined) => {
      console.log(type)
      if (type === 'SERVICE_PROVIDER') {
        setAnchor('/servicepage')
      } else {
        setAnchor('/userhomepage')
      }
    }

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      )
      console.log(response)
      setUser('')
      setPwd('')
      setSuccess(true)
      try {
        axios.get<User>(USER_URL).then((res) => setType(res.data.type))
      } catch (error) {
        console.log('error here')
      }
    } catch (err) {
      setErrMsg('Invalid Credentials')
    }
  }

  return (
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href={anchor}>Go to Home</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? 'errmsg' : 'offscreen'}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            ></input>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            ></input>
            <button>Sign In</button>
          </form>
          <p>
            Need an Account?
            <br />
            <span className="line">
              <a href="/registeruser">Sign Up</a>
            </span>
          </p>
          <p>
            Want to register a Service?
            <br />
            <span className="line">
              <a href="/registerservice">Sign Up</a>
            </span>
          </p>
        </section>
      )}
    </>
  )
}

export default Login
