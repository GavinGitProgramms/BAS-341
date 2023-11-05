import { UserType } from './entity.types'

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
