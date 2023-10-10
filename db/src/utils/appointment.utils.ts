import { AppDataSource } from '../data-source'
import { Appointment, AppointmentType, UserType } from '../entity'
import type {
  BookAppointmentArgs,
  CreateAppointmentArgs,
  GetAppointmentArgs,
  SearchAppointmentsArgs,
} from '../types'
import { ensureInitialized } from './db.utils'
import { getUser } from './user.utils'

/**
 * Retrieves an appointment by ID.
 *
 * @param {GetAppointmentArgs} args - The arguments for retrieving an appointment.
 * @returns {Promise<Appointment | null>} - A promise that resolves with the appointment or null if not found.
 */
export async function getAppointment({
  id,
}: GetAppointmentArgs): Promise<Appointment | null> {
  await ensureInitialized()
  const appointmentRepo = AppDataSource.getRepository(Appointment)
  const appointment = await appointmentRepo.findOneBy({ id })
  return appointment
}

/**
 * Searches for appointments based on the provided user.
 *
 * If the user is a string, it retrieves the user entity from the database.
 * If the user is a regular user, it searches by the user field.
 * Otherwise, it searches by the provider field.
 *
 * @param {SearchAppointmentsArgs} args - The arguments for the search.
 * @returns {Promise<Appointment[]>} - A promise that resolves to an array of appointments.
 * @throws {Error} - If the user does not exist in the database.
 */
export async function searchAppointments({
  user,
}: SearchAppointmentsArgs): Promise<Appointment[]> {
  await ensureInitialized()
  const appointmentRepo = AppDataSource.getRepository(Appointment)

  // If the user is a string, then we need to retrieve the user entity from the database.
  if (typeof user === 'string') {
    const userEntity = await getUser({ username: user })
    if (!userEntity) {
      throw new Error(`user: '${user}' does not exist`)
    }
    user = userEntity
  }

  // If the user is a regular user, then we need to search by the user field.
  // Otherwise, we need to search by the provider field.
  const findByArgs =
    user.type === UserType.REGULAR ? { user } : { provider: user }

  const appointments = await appointmentRepo.findBy(findByArgs)
  return appointments
}

/**
 * Creates a new appointment.
 *
 * This is for use by service provider users only.
 *
 * @param {CreateAppointmentArgs} args - The arguments needed to create an appointment.
 * @returns {Promise<Appointment>} - The newly created appointment.
 * @throws {Error} - If the appointment type is invalid, the provider does not exist, the user is not a service provider, or the start time is after the end time.
 */
export async function createAppointment({
  type,
  provider,
  start_time,
  end_time,
}: CreateAppointmentArgs): Promise<Appointment> {
  await ensureInitialized()
  const appointmentRepo = AppDataSource.getRepository(Appointment)
  const appointment = new Appointment()

  // Validate the appointment type
  if (!Object.values(AppointmentType).includes(type)) {
    throw new Error('invalid appointment type')
  }

  appointment.type = type

  // If the provider is a string, then we need to retrieve the user entity from the database.
  if (typeof provider === 'string') {
    const userEntity = await getUser({ username: provider })
    if (!userEntity) {
      throw new Error(`user: '${provider}' does not exist`)
    }
    appointment.provider = userEntity
  } else {
    appointment.provider = provider
  }

  // Only service providers can create appointments
  if (appointment.provider.type !== UserType.SERVICE_PROVIDER) {
    throw new Error('only service providers can create appointments')
  }

  // If the start time is after the end time, throw an error
  if (start_time > end_time) {
    throw new Error('start time cannot be after end time')
  }

  appointment.start_time = start_time
  appointment.end_time = end_time

  return appointmentRepo.save(appointment)
}

/**
 * Books an appointment for a user.
 *
 * This is for use by regular users only.
 *
 * @param {BookAppointmentArgs} args - The arguments for booking an appointment.
 * @returns {Promise<Appointment>} - The booked appointment.
 * @throws {Error} - If no appointment exists with the given ID, if the appointment is already booked by a user, if the user does not exist, or if the user is not a regular user.
 */
export async function bookAppointment({
  id,
  user,
}: BookAppointmentArgs): Promise<Appointment> {
  await ensureInitialized()
  const appointment = await getAppointment({ id })
  if (!appointment) {
    throw new Error(`no appointment exists with the ID: ${id}`)
  }

  if (appointment.user) {
    throw new Error(
      `appointment is already booked by user: ${appointment.user.username}`,
    )
  }

  // If the user is a string, then we need to retrieve the user entity from the database.
  if (typeof user === 'string') {
    const userEntity = await getUser({ username: user })
    if (!userEntity) {
      throw new Error(`user: '${user}' does not exist`)
    }
    appointment.user = userEntity
  } else {
    appointment.user = user
  }

  // Only service providers can create appointments
  if (appointment.provider.type !== UserType.REGULAR) {
    throw new Error('only regular users can book appointments')
  }

  const appointmentRepo = AppDataSource.getRepository(Appointment)
  return appointmentRepo.save(appointment)
}
