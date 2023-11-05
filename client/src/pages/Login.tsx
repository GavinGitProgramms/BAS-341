import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../hooks'
import Layout from '../layout/Layout'

export default function Login() {
  const userRef = useRef<HTMLInputElement>(null)
  const errRef = useRef<HTMLParagraphElement>(null)
  const { isAuthenticated, login } = useUser()

  const [user, setUser] = useState('')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    userRef.current?.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await login({ username: user, password: pwd })
  }

  const location = useLocation()
  if (isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  ref={userRef}
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
          {errMsg && (
            <p
              ref={errRef}
              className="mt-2 text-center text-sm text-red-600"
              aria-live="assertive"
            >
              {errMsg}
            </p>
          )}
          <div className="text-center">
            <p className="mt-2 text-center text-sm text-gray-600">
              Need an account?{' '}
              <a
                href="/registeruser"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign Up
              </a>
            </p>
            <p className="mt-2 text-center text-sm text-gray-600">
              Want to register a Service?{' '}
              <a
                href="/registerservice"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
