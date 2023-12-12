import type {
  AppointmentType,
  NotificationType,
  User,
  UserType,
} from '../entity'

/**
 * Arguments for retrieving a user by their username.
 */
export type GetUserArgs = {
  username: string
}

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
 * Arguments for creating a qualification.
 */
export type CreateQualificationArgs = {
  /** The description of the qualification. */
  description: string
  /** The user associated with the qualification. */
  user: User | string
}

/**
 * Arguments for retrieving a single appointment by ID.
 */
export type GetAppointmentArgs = {
  id: string

  /**
   * Optional user to restrict the search to.
   */
  user?: User | string
}

/**
 * Arguments for searching appointments.
 */
export type SearchAppointmentsArgs = {
  /**
   * The user to search for appointments.
   */
  user: User | string

  /**
   * Whether to include all appointments that have not been booked from
   * all of the service providers.
   */
  includeAllUnbooked?: boolean
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
  /** The provider of the appointment. */
  provider: User | string
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
  /** The user associated with the appointment. */
  user: User | string
}

/**
 * Arguments for canceling an appointment.
 */
export type CancelAppointmentArgs = {
  /** The ID of the appointment. */
  id: string
  /** The user associated with the appointment. */
  user: User | string
}

/**
 * Arguments for creating a new notification.
 */
export type CreateNotificationArgs = {
  /** The type of notification. */
  type: NotificationType
  /** The notification recipient. */
  user: User | string
  /** The notification content. */
  message: string
}

/**
 * Arguments for viewing a notification.
 */
export type ViewNotificationArgs = {
  /** The ID of the notification. */
  id: string

  /** The user associated with the notification. */
  user: User | string
}

/**
 * Arguments for getting a notification.
 */
export type GetNotificationArgs = {
  /** The ID of the notification. */
  id: string

  /** The user associated with the notification. */
  user: User | string
}

/**
 * Arguments for listing notifications.
 */
export type ListNotificationsArgs = {
  /** The user associated with the notifications. */
  user: User | string
}
