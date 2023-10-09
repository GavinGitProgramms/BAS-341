import { UserType } from '../entity'

export type GetUserArgs = {
  username: string
}

export type CreateUserArgs = {
  username: string
  type: UserType
  first_name: string
  last_name: string
  email: string
  phone_number: string
  password: string
}
