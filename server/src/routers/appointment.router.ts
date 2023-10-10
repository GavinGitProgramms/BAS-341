import { Request, Response, Router } from 'express'
import { ensureAuthenticated } from '../middleware'

/**
 * Handles the GET request to retrieve appointments for a specific user.
 *
 * Requires an authenticated user for access.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the appointments array.
 */
async function appointmentsHandler(req: Request, res: Response) {
  // TODO: Search appointments by username
  res.json({ appointments: [] })
}

const router = Router()
router.get('/', ensureAuthenticated, appointmentsHandler)

export default router
