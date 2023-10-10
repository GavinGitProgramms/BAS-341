import { FindOptionsWhere, IsNull } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Appointment, AppointmentType, UserType } from '../entity'
import type {
  BookAppointmentArgs,
  CreateAppointmentArgs,
  GetAppointmentArgs,
  SearchAppointmentsArgs,
} from '../types'
import { ensureInitialized } from './db.utils'
import { expandUser } from './user.utils'

/**
 * Retrieves an appointment by ID and user (if provided).
 *
 * @param {GetAppointmentArgs} args - The arguments for retrieving the appointment.
 * @returns {Promise<Appointment | null>} - The retrieved appointment, or null if not found.
 */
export async function getAppointment({
  id,
  user,
}: GetAppointmentArgs): Promise<Appointment | null> {
  await ensureInitialized()
  const appointmentRepo = AppDataSource.getRepository(Appointment)
  const appointment = await (user
    ? appointmentRepo.findOneBy({ id, user: await expandUser(user) })
    : appointmentRepo.findOneBy({ id }))
  return appointment
}

/**
 * Searches for appointments based on the provided arguments.
 *
 * If the includeAllUnbooked argument is true, then all unbooked appointments
 * for all service providers are returned in addition to the appointments for
 * the given user.
 *
 * @param {SearchAppointmentsArgs} args - The arguments to use for the search.
 * @returns {Promise<Appointment[]>} - A promise that resolves to an array of appointments.
 */
export async function searchAppointments({
  user,
  includeAllUnbooked = false,
}: SearchAppointmentsArgs): Promise<Appointment[]> {
  await ensureInitialized()
  const appointmentRepo = AppDataSource.getRepository(Appointment)
  const whereOptions: Array<FindOptionsWhere<Appointment>> = []

  if (includeAllUnbooked) {
    // Get all unbooked appointments for all service providers
    whereOptions.push({ user: IsNull() })
  }

  // Get all appointments for the user
  user = await expandUser(user)

  // If the user is a regular user, then we need to search by the user field.
  // Otherwise, we need to search by the provider field.
  whereOptions.push(
    user.type === UserType.REGULAR ? { user } : { provider: user },
  )

  const appointments = await appointmentRepo.find({ where: whereOptions })
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
  appointment.provider = await expandUser(provider)

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

  appointment.user = await expandUser(user)

  // Only service providers can create appointments
  if (appointment.provider.type !== UserType.REGULAR) {
    throw new Error('only regular users can book appointments')
  }

  const appointmentRepo = AppDataSource.getRepository(Appointment)
  return appointmentRepo.save(appointment)
}
