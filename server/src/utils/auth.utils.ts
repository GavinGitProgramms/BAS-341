import { User } from 'bas-db'
import { Request } from 'express'
import { UserSession } from '../types'

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
