import { Appointment, User } from '../entity'

export type UserDto = Omit<User, 'password_hash'>

export type AppointmentDto = Omit<Appointment, 'user' | 'provider'> & {
  user: UserDto | null
  provider: UserDto | null
}
