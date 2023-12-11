import React, { useState } from 'react'
import { CreateAppointmentArgs, AppointmentType } from '../types'

export type CreateAppointmentFormProps = {
  onSubmit: (args: CreateAppointmentArgs) => void
}

export default function CreateAppointmentForm({
  onSubmit,
}: CreateAppointmentFormProps) {
  const [type, setType] = useState<AppointmentType>(AppointmentType.BEAUTY)
  const [description, setDescription] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value
    setStartTime(newStartTime)

    // Create a Date object from the input value
    const startDateTime = new Date(newStartTime)

    // Set end time to 1 hour after the start time
    startDateTime.setHours(startDateTime.getHours() + 1)

    // Adjust for the timezone offset to keep the time in the local timezone
    const timezoneOffset = startDateTime.getTimezoneOffset() * 60000 // offset in milliseconds
    const localEndTime = new Date(startDateTime.getTime() - timezoneOffset)

    // Format the date to the correct format for datetime-local input
    const endDateTime = localEndTime.toISOString().slice(0, 16)

    setEndTime(endDateTime)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const start = new Date(startTime)
    const end = new Date(endTime)
    const currentDate = new Date()

    if (start < currentDate || end <= start) {
      alert('Please enter valid start and end times.')
      return
    }

    await onSubmit({
      type,
      description,
      start_time: start,
      end_time: end,
    })

    // Clear the form
    setType(AppointmentType.BEAUTY)
    setDescription('')
    setStartTime('')
    setEndTime('')
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Appointment Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as AppointmentType)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value={AppointmentType.BEAUTY}>Beauty</option>
            <option value={AppointmentType.FITNESS}>Fitness</option>
            <option value={AppointmentType.MEDICAL}>Medical</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            placeholder="Provide a description for the appointment"
          />
        </div>
        <div>
          <label
            htmlFor="start_time"
            className="block text-sm font-medium text-gray-700"
          >
            Start Time
          </label>
          <input
            type="datetime-local"
            id="start_time"
            value={startTime}
            onChange={handleStartTimeChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
        <div>
          <label
            htmlFor="end_time"
            className="block text-sm font-medium text-gray-700"
          >
            End Time
          </label>
          <input
            type="datetime-local"
            id="end_time"
            value={endTime}
            min={startTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
        <div>
          <button
            type="submit"
            className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Appointment
          </button>
        </div>
      </form>
    </>
  )
}
