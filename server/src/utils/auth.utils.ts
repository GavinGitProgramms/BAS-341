import { User } from 'bas-db'
import { Request } from 'express'
import { UserDTO, UserSession } from '../types'

/**
 * Returns the user session object from the request object.
 *
 * @param req - The request object.
 * @returns The user session object or null if the session is invalid.
 */
export function getUserSession(req: Request): UserSession | null {
  const session = req.session
  if (!session || !session.username || !session.type) {
    return null
  }

  return { username: session.username, type: session.type }
}

/**
 * Converts a User object to a UserDTO object.
 *
 * @param user - The User object to convert.
 * @returns The converted UserDTO object.
 */
export function userDTO(user: User): UserDTO {
  return {
    username: user.username,
    email: user.email,
    type: user.type,
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
    qualifications:
      user.qualifications.map(({ id, description }) => ({ id, description })) ||
      [],
  }
}
