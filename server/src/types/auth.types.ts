import { Qualification, UserType } from 'bas-db'

export type UserSession = {
  username: string
  type: UserType
}

export type UserDTO = {
  username: string
  email: string
  type: UserType
  first_name: string
  last_name: string
  phone_number: string
  qualifications: Array<Pick<Qualification, 'id' | 'description'>>
}
