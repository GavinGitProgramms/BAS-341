import { Appointment, AppointmentType, User } from '../entity'
import { EntitySearchOptions } from './search.types'

export type UserDto = Omit<User, 'password_hash'>

export type AppointmentDto = Omit<Appointment, 'user' | 'provider'> & {
  user: UserDto | null
  provider: UserDto | null
}

export type SearchAppointmentsDto = {
  userId?: string
  providerId?: string
  type?: AppointmentType
  description?: string
  startTime?: string
  endTime?: string
  canceled?: boolean
} & EntitySearchOptions
