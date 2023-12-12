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

export enum EventType {
  APPOINTMENT_CREATED = 'APPOINTMENT_CREATED',
  APPOINTMENT_CANCELED = 'APPOINTMENT_CANCELED',
  APPOINTMENT_UPDATED = 'APPOINTMENT_UPDATED',
  APPOINTMENT_BOOKED = 'APPOINTMENT_BOOKED',
  USER_ENABLED = 'USER_ENABLED',
  USER_DISABLED = 'USER_DISABLED',
}

export enum NotificationType {
  APP = 'APP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}

/* ~~~ Entities ~~~~ */

export type BaseEntity<T> = {
  /**
   * The date and time that the entity was created.
   */
  created_date: string

  /**
   * The date and time that the entity was updated.
   */
  updated_date: string
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
  enabled: boolean
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

/**
 * Represents a qualification.
 */
export type Qualification = {
  /**
   * A unique identifier for a qualification.
   */
  id: string

  /**
   * The description of the qualification.
   */
  description: string
}

/**
 * A notification for a user.
 */
export type Notification = BaseEntity<{
  /**
   * A unique identifier for a notification.
   */
  id: string

  /**
   * The user that the notification is for.
   */
  type: NotificationType

  /**
   * The contents of the notification.
   */
  message: string

  /**
   * Whether the user has viewed the notification.
   */
  viewed: boolean
}>
