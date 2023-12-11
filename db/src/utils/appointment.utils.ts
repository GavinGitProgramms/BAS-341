import {
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  IsNull,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
} from 'typeorm'
import { AppDataSource } from '../data-source'
import { Appointment, AppointmentType, UserType } from '../entity'
import type {
  AppointmentDto,
  BookAppointmentArgs,
  CancelAppointmentArgs,
  CreateAppointmentArgs,
  GetAppointmentArgs,
  SearchAppointmentsDto,
  SearchContext,
  SearchResults,
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
    provider: {
      qualifications: true,
    },
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
 * Searches for appointments based on the provided DTO and user context.
 *
 * @param {SearchAppointmentsDto} dto - The DTO containing search parameters.
 * @param {SearchContext} context - The context of the user performing the search.
 * @returns {Promise<SearchResults>} - A promise that resolves to the search results.
 */
export async function searchAppointments(
  dto: SearchAppointmentsDto,
  context: SearchContext,
): Promise<SearchResults<AppointmentDto>> {
  await ensureInitialized()
  const appointmentRepo = AppDataSource.getRepository(Appointment)

  // Constructing where conditions based on DTO
  const mainWhereOptions: FindOptionsWhere<Appointment> = {}
  const altWhereOptions: FindOptionsWhere<Appointment> = {}
  const filterWhereOptions: FindOptionsWhere<Appointment> = {}

  const allWhereOptions: Array<FindOptionsWhere<Appointment>> = []

  const relations = {
    user: true,
    provider: {
      qualifications: true,
    },
  }

  const requestingUser = await expandUser(context.user)

  // Implementing user role-based logic
  switch (requestingUser.type) {
    case UserType.REGULAR:
      // Regular users can only see their appointments (even cancled ones)
      mainWhereOptions['user'] = { id: requestingUser.id }

      // Allow for all unbooked appointments to be returned
      altWhereOptions['user'] = IsNull()
      altWhereOptions['canceled'] = false
      break
    case UserType.SERVICE_PROVIDER:
      // Service providers can only see appointments they created
      mainWhereOptions['provider'] = { id: requestingUser.id }
      break
    case UserType.ADMIN:
      // Admins can see all appointments
      break
  }

  // Adding additional filters from DTO
  if (dto.userId) {
    if (requestingUser.type !== UserType.REGULAR) {
      filterWhereOptions['user'] = { username: Like(`%${dto.userId}%`) }
    }
  }

  if (dto.providerId) {
    if (requestingUser.type !== UserType.SERVICE_PROVIDER) {
      filterWhereOptions['provider'] = {
        username: Like(`%${dto.providerId}%`),
      }
    }
  }

  if (dto.type) {
    filterWhereOptions['type'] = dto.type
  }

  if (dto.description) {
    filterWhereOptions['description'] = Like(`%${dto.description}%`)
  }

  if (dto.startTime) {
    filterWhereOptions['start_time'] = MoreThanOrEqual(new Date(dto.startTime))
  }

  if (dto.endTime) {
    filterWhereOptions['end_time'] = LessThanOrEqual(new Date(dto.endTime))
  }

  if (dto.canceled !== undefined) {
    filterWhereOptions['canceled'] = dto.canceled
  }

  // Pagination and sorting
  const skip = (dto.page - 1) * dto.rowsPerPage
  const take = dto.rowsPerPage

  const order: FindOptionsOrder<Appointment> =
    dto.sortField === 'user'
      ? {
          user: { username: dto.sortDirection },
        }
      : dto.sortField === 'provider'
      ? {
          provider: { username: dto.sortDirection },
        }
      : {
          [dto.sortField]: dto.sortDirection,
        }

  allWhereOptions.push({ ...mainWhereOptions, ...filterWhereOptions })
  if (Object.keys(altWhereOptions).length > 0) {
    allWhereOptions.push({ ...altWhereOptions, ...filterWhereOptions })
    if (requestingUser.type === UserType.REGULAR) {
      // Regular users can't search for unbooked appointments that have been canceled
      allWhereOptions[1]['canceled'] = false
    }
  }

  const appointments = await appointmentRepo.find({
    where: allWhereOptions,
    relations,
    order,
    skip,
    take,
  })

  // Count total appointments
  const total = await appointmentRepo.count({
    where: allWhereOptions,
  })

  // Map to DTOs and return results with total
  return {
    total: total,
    results: appointments.map(appointmentDto),
  }
}

/**
 * Creates a new appointment.
 *
 * This is for use by service provider users only.
 *
 * @param {CreateAppointmentArgs} args - The arguments needed to create an appointment.
 * @returns {Promise<AppointmentDto>} - The newly created appointment.
 * @throws {Error} - If the provider does not exist, the user is not a service provider, the start time is after the end time, or the start time is not in the future.
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

  // Ensure that the appointment is created in the future
  if (start_time < new Date()) {
    throw new Error('appointment start time must be in the future')
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
 * @returns {Promise<AppointmentDto>} - The appointment DTO of the booked appointment.
 * @throws {Error} - If the user is not a regular user, the appointment does not exist, the appointment is already booked, the appointment is canceled, or the appointment start and end time intersect with another booked appointment.
 */
export async function bookAppointment({
  id,
  user,
}: BookAppointmentArgs): Promise<AppointmentDto> {
  await ensureInitialized()

  user = await expandUser(user)

  // Make sure the user is a regular user
  if (user.type !== UserType.REGULAR) {
    throw new Error('only regular users can book appointments')
  }

  const appointmentRepo = AppDataSource.getRepository(Appointment)

  const relations = {
    user: true,
    provider: true,
  }

  const appointment = await appointmentRepo.findOne({
    where: { id },
    relations,
  })

  // Make sure the appointment exists
  if (!appointment) {
    throw new Error(`no appointment exists with the ID: ${id}`)
  }

  // Make sure the appointment isn't canceled
  if (appointment.canceled) {
    throw new Error('appointment is canceled')
  }

  // Make sure the appointment isn't already booked
  if (appointment.user) {
    throw new Error(
      `appointment is already booked by user: ${appointment.user.username}`,
    )
  }

  // Make sure that the appointment start time is in the future
  if (appointment.start_time < new Date()) {
    throw new Error('appointment start time must be in the future')
  }

  // Make sure that the appointment start and end time do not intersect
  // with any other appointments that the user has booked
  const bookedAppointments = await appointmentRepo.find({
    where: {
      user: { id: user.id },
      canceled: false,
    },
  })

  for (const bookedAppointment of bookedAppointments) {
    if (
      appointment.start_time < bookedAppointment.end_time &&
      appointment.end_time > bookedAppointment.start_time
    ) {
      throw new Error(
        `appointment start and end time intersect with another booked appointment: ${bookedAppointment.id}`,
      )
    }
  }

  // Set the appointment user and save the changes to the database
  appointment.user = user
  const updatedAppointment = await appointmentRepo.save(appointment)
  return appointmentDto(updatedAppointment)
}

/**
 * Cancels an appointment.
 *
 * If the requesting user is a regular user, their association with the appointment
 * will be removed so that a new regular user can book the appointment. If the
 * requesting user is any other type of user, the appointment will be marked as
 * canceled and no longer be able to book by regular users.
 *
 * @param {CancelAppointmentArgs} args - The arguments for cancelling an appointment.
 * @returns {Promise<AppointmentDto>} - The cancelled appointment.
 * @throws {Error} - If the appointment doesn't exist, is already cancelled, or the end time has passed. Also, if the appointment is not booked or the user trying to cancel is not the one who booked it.
 */
export async function cancelAppointment({
  id,
  user,
}: CancelAppointmentArgs): Promise<AppointmentDto> {
  await ensureInitialized()
  const appointmentRepo = AppDataSource.getRepository(Appointment)

  const relations = {
    user: true,
    provider: true,
  }

  user = await expandUser(user)

  const appointment = await appointmentRepo.findOne({
    where: { id },
    relations,
  })

  // Make sure the appointment exists
  if (!appointment) {
    throw new Error(`no appointment exists with the ID: ${id}`)
  }

  // Make sure the appointment isn't canceled
  if (appointment.canceled) {
    throw new Error('appointment is canceled')
  }

  // Make sure that the appointment end time hasn't been reached
  if (appointment.end_time < new Date()) {
    throw new Error('appointment end time has already passed')
  }

  if (user?.type === UserType.REGULAR) {
    // For regular users, cancelling an appointment removes their
    // association with the appointment.

    // Make sure that the appointment is booked
    if (!appointment.user) {
      throw new Error('appointment is not booked')
    }

    // Only the user who booked the appointment can cancel it
    if (appointment.user.username !== user.username) {
      throw new Error('only the user who booked the appointment can cancel it')
    }

    appointment.user = null
  } else {
    // For service providers and admin users, cancelling an appointment
    // marks the appointment as cancelled.
    appointment.canceled = true
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
