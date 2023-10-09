import { Request } from 'express'

/**
 * Returns the username from the session object in the request.
 *
 * @param req - The request object.
 * @returns The username string if it exists in the session object, otherwise undefined.
 */
export function getUsernameFromSession(req: Request): string | undefined {
  const session = req.session as any
  if (!session) {
    return undefined
  }

  return session.username
}
