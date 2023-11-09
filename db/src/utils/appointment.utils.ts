import { FindOneOptions, FindOptionsWhere, IsNull } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Appointment, AppointmentType, UserType } from '../entity'
import type {
  AppointmentDto,
  BookAppointmentArgs,
  CreateAppointmentArgs,
  GetAppointmentArgs,
  SearchAppointmentsArgs,
} from '../types'
import { ensureInitialized } from './db.utils'
import { expandUser, userDto } from './user.utils'

/**
 * Retrieves an appointment by ID and user (if provided).
 *
 * Includes data for the associated user and provider.
 *
 * @param {GetAppointmentArgs} args - The arguments for retrieving the appointment.
 * @returns {Promise<Appointment | null>} - The retrieved appointment, or null if not found.
 */
export async function getAppointment({
  id,
  user,
}: GetAppointmentArgs): Promise<AppointmentDto | null> {
  await ensureInitialized()
  const appointmentRepo = AppDataSource.getRepository(Appointment)

  const relations = {
    user: true,
    provider: true,
  }

  if (typeof user === 'string') {
    user = await expandUser(user)
  }

  // Restrict the search to the given user if provided and the user is not an admin
  if (user && user.type !== UserType.ADMIN) {
    user = await expandUser(user)
    const whereOptions: Array<FindOptionsWhere<Appointment>> = []

    if (user.type === UserType.REGULAR) {
      // Regular users can only see appointments that they booked or appointments that are unbooked
      whereOptions.push({ id, user: IsNull() })
      whereOptions.push({ id, user: { id: user.id } })
    } else if (user.type === UserType.SERVICE_PROVIDER) {
      // Service providers can only see appointments that they created
      whereOptions.push({ id, provider: { id: user.id } })
    }

    const findOptions: FindOneOptions<Appointment> = {
      where: whereOptions,
      relations,
    }

    const appointment = await appointmentRepo.findOne(findOptions)
    return appointment ? appointmentDto(appointment) : null
  }

  const appointment = await appointmentRepo.findOne({
    where: { id },
    relations,
  })

  return appointment ? appointmentDto(appointment) : null
}

/**
 * Searches for appointments based on the provided arguments.
 *
 * If the includeAllUnbooked argument is true, then all unbooked appointments
 * for all service providers are returned in addition to the appointments for
 * the given user.
 *
 * @param {SearchAppointmentsArgs} args - The arguments to use for the search.
 * @returns {Promise<AppointmentDto[]>} - A promise that resolves to an array of appointments.
 */
export async function searchAppointments({
  user,
  includeAllUnbooked = false,
}: SearchAppointmentsArgs): Promise<AppointmentDto[]> {
  await ensureInitialized()
  const appointmentRepo = AppDataSource.getRepository(Appointment)
  const whereOptions: Array<FindOptionsWhere<Appointment>> = []

  const relations = {
    user: true,
    provider: true,
  }

  if (typeof user === 'string') {
    user = await expandUser(user)
  }

  if (includeAllUnbooked && user.type === UserType.REGULAR) {
    // Get all unbooked appointments for all service providers
    whereOptions.push({ user: IsNull() })
  }

  // If the user is a regular user, then we need to search by the user field.
  // Otherwise, we need to search by the provider field.
  whereOptions.push(
    user.type === UserType.REGULAR
      ? { user: { id: user.id } }
      : { provider: { id: user.id } },
  )

  const appointments = await appointmentRepo.find({
    where: whereOptions,
    relations,
  })

  return appointments.map(appointmentDto)
}

/**
 * Creates a new appointment.
 *
 * This is for use by service provider users only.
 *
 * @param {CreateAppointmentArgs} args - The arguments needed to create an appointment.
 * @returns {Promise<AppointmentDto>} - The newly created appointment.
 * @throws {Error} - If the appointment type is invalid, the provider does not exist, the user is not a service provider, or the start time is after the end time.
 */
export async function createAppointment({
  type,
  provider,
  description,
  start_time,
  end_time,
}: CreateAppointmentArgs): Promise<AppointmentDto> {
  await ensureInitialized()
  const appointmentRepo = AppDataSource.getRepository(Appointment)
  const appointment = new Appointment()

  // Validate the appointment type
  if (!Object.values(AppointmentType).includes(type)) {
    throw new Error('invalid appointment type')
  }

  appointment.type = type
  appointment.description = description
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

  const newAppointment = await appointmentRepo.save(appointment)
  return appointmentDto(newAppointment)
}

/**
 * Books an appointment for a regular user.
 *
 * @param {BookAppointmentArgs} args - The arguments needed to book an appointment.
 * @returns {Promise<AppointmentDto>} - The booked appointment.
 * @throws {Error} - If no appointment exists with the given ID, if the appointment is already booked by another user, if the appointment start time is not in the future, or if the user trying to book the appointment is not a regular user.
 */
export async function bookAppointment({
  id,
  user,
}: BookAppointmentArgs): Promise<AppointmentDto> {
  await ensureInitialized()
  const appointmentRepo = AppDataSource.getRepository(Appointment)

  const relations = {
    user: true,
    provider: true,
  }

  const appointment = await appointmentRepo.findOne({
    where: { id },
    relations,
  })

  if (!appointment) {
    throw new Error(`no appointment exists with the ID: ${id}`)
  }

  if (appointment.user) {
    throw new Error(
      `appointment is already booked by user: ${appointment.user.username}`,
    )
  }

  // Make sure that the appointment start time is in the future
  if (appointment.start_time < new Date()) {
    throw new Error('appointment start time must be in the future')
  }

  appointment.user = await expandUser(user)

  // Only service providers can create appointments
  if (appointment.user.type !== UserType.REGULAR) {
    throw new Error('only regular users can book appointments')
  }

  const updatedAppointment = await appointmentRepo.save(appointment)
  return appointmentDto(updatedAppointment)
}

/**
 * Converts an Appointment object to an AppointmentDto object.
 *
 * @param {Appointment} appointment - The Appointment object to convert.
 * @returns {AppointmentDto} - The converted AppointmentDto object.
 */
export function appointmentDto({
  user,
  provider,
  ...appointment
}: Appointment): AppointmentDto {
  return {
    ...appointment,
    user: user ? userDto(user) : null,
    provider: provider ? userDto(provider) : null,
  }
}
