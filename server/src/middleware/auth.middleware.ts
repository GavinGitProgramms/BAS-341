import { NextFunction, Request, Response } from 'express'
import { getUserSession, unauthorizedRequest } from '../utils'

/**
 * Middleware function to ensure that the user is authenticated.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @param next - Express NextFunction object.
 * @returns If the user is not authenticated, returns an error response with status code 401 and message "Unauthorized access". Otherwise, sets the user session in the request object and calls the next middleware function.
 */
export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const session = getUserSession(req)
  if (!session) {
    return unauthorizedRequest(res)
  }
  req.user = session
  next()
}
