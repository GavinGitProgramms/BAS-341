/* ~~~ Enums ~~~~ */

export enum UserType {
  REGULAR = 'REGULAR',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  ADMIN = 'ADMIN',
}

export enum AppointmentType {
  BEAUTY = 'BEAUTY',
  FITNESS = 'FITNESS',
  MEDICAL = 'MEDICAL',
}

/* ~~~ Entities ~~~~ */

export type BaseEntity<T> = {
  created_date: Date
  updated_date: Date
} & T

/**
 * A user for the BAS application.
 *
 * We don't save the password on the user data model.
 * This is stored in the database as a salted hash.
 */
export type User = BaseEntity<{
  username: string
  type: UserType
  first_name: string
  last_name: string
  email: string
  phone_number: string
  qualifications: Qualification[]
}>

export type Appointment = BaseEntity<{
  /**
   * A unique identifier for an appointment.
   */
  id: string

  /**
   * The type of appointment that the service provide
   * has made available for a user.
   */
  type: AppointmentType

  /**
   * The service provider user which created the slot
   * for this appointment.
   */
  provider: User | null

  /**
   * The users description of the appointment.
   */
  description: string

  /**
   * The user that signs up for an appointment.
   * This value is `null` before any user signs up.
   */
  user: string | null

  /**
   * The date and time that the appointment will start.
   */
  start_time: Date

  /**
   * The date and time that the appointment will end.
   */
  end_time: Date

  /**
   * Whether the appointment has been canceled.
   */
  canceled: boolean
}>

export type Qualification = {
  id: string
  description: string
}
