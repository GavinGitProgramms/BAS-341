import { AppointmentType, UserType } from './entity.types'

export type LoginArgs = { username: string; password: string }

/**
 * Arguments for creating a new user.
 */
export type CreateUserArgs = {
  username: string
  type: UserType
  first_name: string
  last_name: string
  email: string
  phone_number: string
  password: string
}

/**
 * Arguments for creating a new appointment.
 *
 * This is for use by service provider users only.
 */
export type CreateAppointmentArgs = {
  /** The type of appointment. */
  type: AppointmentType
  /** The description of the appointment. */
  description: string
  /** The start time of the appointment. */
  start_time: Date
  /** The end time of the appointment. */
  end_time: Date
}

/**
 * Arguments for booking an appointment.
 *
 * This is for use by regular users only.
 */
export type BookAppointmentArgs = {
  /** The ID of the appointment. */
  id: string
}

/**
 * Arguments for unbooking an appointment.
 *
 * This is for use by regular users only.
 */
export type UnbookAppointmentArgs = {
  /** The ID of the appointment. */
  id: string
}
