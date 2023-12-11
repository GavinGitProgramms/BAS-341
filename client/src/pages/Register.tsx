import { useState, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../hooks'
import Layout from '../layout/Layout'
import { CreateUserArgs, UserType } from '../types'

export default function Register() {
  const location = useLocation()
  const { isAuthenticated, register } = useUser()

  const [errMsg, setErrMsg] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const errRef = useRef<HTMLParagraphElement>(null)

  const [formData, setFormData] = useState<CreateUserArgs>({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    type: UserType.REGULAR,
  })

  const [confirmPassword, setConfirmPassword] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleConfirmPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setConfirmPassword(value)
  }

  function validatePhoneNumber(phone: string) {
    // This is a simple regex for demonstration, which checks for 10 digits.
    // You may need a more complex regex to handle international phone number formats or other criteria.
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    return phoneRegex.test(phone)
  }

  function toggleUserType() {
    setFormData((prev) => ({
      ...prev,
      type:
        prev.type === UserType.REGULAR
          ? UserType.SERVICE_PROVIDER
          : UserType.REGULAR,
    }))
  }

  function clearErrors() {
    setErrMsg('')
    setPhoneError('')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    clearErrors()

    let hasErrors = false

    if (formData.password !== confirmPassword) {
      hasErrors = true
      setErrMsg('Passwords do not match.')
    }

    if (!validatePhoneNumber(formData.phone_number)) {
      hasErrors = true
      setPhoneError('Please enter a valid phone number.')
    }

    if (hasErrors) {
      errRef.current?.focus()
      return
    }

    try {
      await register(formData)
    } catch (err) {
      setErrMsg('Registration failed. Please try again.')
      errRef.current?.focus()
    }
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-base-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold">
              Create an account
            </h2>
          </div>
          <form
            className="mt-8 space-y-6 pl-5 pr-5 pt-1 pb-8 rounded-xl shadow-md"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="remember" defaultValue="true" />

            {/* Username */}
            <div className="form-control">
              <label htmlFor="username" className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input input-bordered"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input input-bordered"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label htmlFor="confirm_password" className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                className="input input-bordered"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="form-control">
                <label htmlFor="first_name" className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  className="input input-bordered"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>

              {/* Last Name */}
              <div className="form-control">
                <label htmlFor="last_name" className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  className="input input-bordered"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input input-bordered"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Phone Number */}
            <div className="form-control">
              <label htmlFor="phone_number" className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                required
                className={`input input-bordered w-full ${
                  phoneError ? 'input-error' : ''
                }`}
                placeholder="123-456-7890"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {phoneError && (
                <label className="label text-error">{phoneError}</label>
              )}
            </div>

            {/* Service Provider Checkbox */}
            <div className="form-control">
              <label className="cursor-pointer label justify-start">
                <input
                  type="checkbox"
                  name="isServiceProvider"
                  className="checkbox checkbox-primary"
                  checked={formData.type === UserType.SERVICE_PROVIDER}
                  onChange={toggleUserType}
                />
                <span className="label-text ml-2">
                  I want to provide services
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button type="submit" className="btn btn-primary w-full">
                Register
              </button>
            </div>
          </form>
          {errMsg && (
            <p
              ref={errRef}
              className="mt-2 text-center text-sm text-error"
              aria-live="assertive"
            >
              {errMsg}
            </p>
          )}
        </div>
      </div>
    </Layout>
  )
}
