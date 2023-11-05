import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../hooks'
import Layout from '../layout/Layout'

export default function Login() {
  const userRef = useRef<HTMLInputElement>(null)
  const errRef = useRef<HTMLParagraphElement>(null)
  const { isAuthenticated, login, errMsg } = useUser()

  const [user, setUser] = useState('')
  const [pwd, setPwd] = useState('')

  useEffect(() => {
    userRef.current?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await login({ username: user, password: pwd })
  }

  // Redirect the user to the home page if they are already logged in
  const location = useLocation()
  if (isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
        <div className="form-control w-full max-w-xs">
          <h2 className="text-4xl font-bold text-center">
            Sign in to your account
          </h2>
          <form className="mt-8" onSubmit={handleSubmit}>
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full max-w-xs"
              ref={userRef}
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />

            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />

            <button
              type="submit"
              className="btn btn-primary w-full max-w-xs mt-4"
            >
              Sign in
            </button>
          </form>
          {errMsg && (
            <p
              ref={errRef}
              className="alert alert-error shadow-lg mt-4"
              aria-live="assertive"
            >
              {errMsg}
            </p>
          )}
          <div className="flex flex-col items-center mt-6">
            <Link to="/register" className="link link-hover">
              Need an account? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
