import { match } from 'assert'
import { useRef, useState, useEffect } from 'react'
import axios from './api/axios'
import './types/entity.types'

const REGISTER_URL = '/auth/register'

document.addEventListener('click', (e) => {
  const isDropdownButton = (e.target as Element).matches(
    '[data-dropdown-button]',
  )
})

const RegisterService = () => {
  const userRef: any = useRef()
  const errRef: any = useRef()

  const [username, setUser] = useState('')
  const [validName, setValidName] = useState(false)
  const [userFocus, setUserFocus] = useState(false)

  const [password, setPwd] = useState('')
  const [validPwd, setValidPwd] = useState(false)
  const [pwdFocus, setPwdFocus] = useState(false)

  const [matchPwd, setMatchPwd] = useState('')
  const [validMatch, setValidMatch] = useState(false)
  const [matchFocus, setMatchFocus] = useState(false)

  const [qualifications, setQualifications] = useState('')
  const [qualFocus, setQualFocus] = useState(false)

  const [first_name, setFirstname] = useState('')
  const [last_name, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phone_number, setPhonenum] = useState('')

  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    userRef.current.focus()
  }, [])

  /* Need to add validation to make sure the username isn't already used (onSubmit)
     Need to add username and password requirments  
  */

  useEffect(() => {
    const result = true
    setValidName(result)
  }, [username])

  useEffect(() => {
    const result = true
    setValidPwd(result)
    const match = password === matchPwd
    setValidMatch(match)
  }, [password, matchPwd])

  useEffect(() => {
    setErrMsg('')
  }, [username, password, matchPwd])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          username,
          type: 'SERVICE_PROVIDER',
          first_name,
          last_name,
          email,
          phone_number,
          password,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      )
      console.log(JSON.stringify(response))
      setUser('')
      setFirstname('')
      setLastname('')
      setEmail('')
      setPhonenum('')
      setPwd('')
      setSuccess(true)
    } catch (err) {}
  }

  return (
    <>
      {success ? (
        <section>
          <h1>Account Created!</h1>
          <br />
          <p>
            <a href={'/'}>Login</a>
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
          <h1>Register Service Provider Account</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              required
              aria-invalid={validName ? 'false' : 'true'}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              id="uidnote"
              className={
                userFocus && username && !validName
                  ? 'instructions'
                  : 'offscreen'
              }
            >
              Username requirments here!!!
            </p>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              required
              aria-invalid={validPwd ? 'false' : 'true'}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            ></input>
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}
            >
              Password requirments here!!!
            </p>
            <label htmlFor="confirm_pwd">Confirm Password:</label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatch ? 'false' : 'true'}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? 'instructions' : 'offscreen'
              }
            >
              Must match the frist password input field.
            </p>
            <label htmlFor="first_name">First Name:</label>
            <input
              type="text"
              id="first_name"
              onChange={(e) => setFirstname(e.target.value)}
              required
            ></input>
            <br />
            <label htmlFor="last_name">Last Name:</label>
            <input
              type="text"
              id="last_name"
              onChange={(e) => setLastname(e.target.value)}
              required
            ></input>
            <br />
            <label htmlFor="email">E-mail:</label>
            <input
              type="text"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            ></input>
            <br />
            <label htmlFor="phone_number">Phone Number:</label>
            <input
              type="text"
              id="phone_number"
              onChange={(e) => setPhonenum(e.target.value)}
              required
            ></input>
            <br />
            <button
              disabled={!validName || !validPwd || !validMatch ? true : false}
            >
              Sign Up
            </button>
          </form>
          <p>
            Need a User Account?
            <br />
            <span className="line">
              <a href="/registeruser">Sign Up</a>
            </span>
          </p>
          <p>
            Already have an account?
            <br />
            <span className="line">
              <a href="/">Sign In</a>
            </span>
          </p>
        </section>
      )}
    </>
  )
}

export default RegisterService

/*
<label htmlFor="serviceType">Service Type:</label>
<div className="dropdown" data-dropdown>
  <button className="link" data-dropdown-button>
    Service Type
  </button>
  <div className="dropdown-menu">
    <option>Fitness</option>
    <option>Beauty</option>
    <option>Medical</option>
  </div>
</div> */
