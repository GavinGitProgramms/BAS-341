import { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { getUsernameFromSession } from '../utils'

/**
 * Handles the GET request to retrieve appointments for a specific user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the appointments array.
 */
async function appointmentsHandler(req: Request, res: Response) {
  const username = getUsernameFromSession(req)
  if (!username) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized access' })
  }

  // TODO: Search appointments by username

  res.json({ appointments: [] })
}

const router = Router()
router.get('/', appointmentsHandler)

export default router
