import { UserType } from 'bas-db'
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
  req: Request<any>,
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

/**
 * Middleware function to ensure that the user is an admin.
 *
 * If the user is not authenticated or is not an admin, it returns an unauthorized response.
 * Otherwise, it sets the user session in the request object and calls the next middleware.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
export function ensureAdmin(
  req: Request<any>,
  res: Response,
  next: NextFunction,
) {
  const session = getUserSession(req)
  if (!session) {
    return unauthorizedRequest(res)
  }

  if (session.type !== UserType.ADMIN) {
    return unauthorizedRequest(res)
  }

  req.user = session
  next()
}
