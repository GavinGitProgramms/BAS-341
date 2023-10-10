import {
  BookAppointmentArgs,
  CreateAppointmentArgs,
  UserType,
  bookAppointment,
  createAppointment,
  getAppointment,
  searchAppointments,
} from 'bas-db'
import { Request, Response, Router } from 'express'
import { ensureAuthenticated } from '../middleware'
import { badRequest, unauthorizedRequest } from '../utils'

/**
 * Handler function for retrieving all booked appointments for a user.
 *
 * Requires an authenticated user for access.
 * For use by regular users only.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @returns Returns a JSON response containing the user's appointments.
 */
async function getBookedAppointmentsHandler(req: Request, res: Response) {
  const { username } = req.user!
  try {
    const appointments = await searchAppointments({ user: username })
    res.json({ appointments })
  } catch (err) {
    const errMsg = `failed to search booked appointments for user: '${username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to search booked appointments')
  }
}

/**
 * Handler function to get all appointments for a user.
 *
 * This includes all booked appointments for the particular user
 * and all unbooked appointments for all service providers.
 *
 * Requires an authenticated user for access.
 * For use by regular users only.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @returns Returns a JSON response with all appointments for the user.
 */
async function getAllAppointmentsHandler(req: Request, res: Response) {
  const { username } = req.user!
  try {
    const appointments = await searchAppointments({
      user: username,
      includeAllUnbooked: true,
    })
    res.json({ appointments })
  } catch (err) {
    const errMsg = `failed to search all appointments for user: '${username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to search all appointments')
  }
}

/**
 * Handles GET requests for a specific booked appointment by ID for a given user.
 *
 * Requires an authenticated user for access.
 * For use by regular users only.
 *
 * @param req - The request object containing the authenticated user and the appointment ID.
 * @param res - The response object to send the appointment data or error message.
 * @returns The appointment data or an error message if the appointment search fails.
 */
async function getBookedAppointmentHandler(req: Request, res: Response) {
  const { username } = req.user!
  const { appointmentId } = req.params
  try {
    const appointments = await getAppointment({
      id: appointmentId,
      user: username,
    })
    res.json({ appointments })
  } catch (err) {
    const errMsg = `failed to get booked appointment for user: '${username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to get booked appointment')
  }
}

/**
 * Creates a new appointment for a service provider.
 *
 * Requires an authenticated user for access.
 * For use by service provider users only.
 *
 * @param req - The request object containing the appointment details.
 * @param res - The response object to send the result.
 * @returns The created appointment object.
 */
async function createAppointmentHandler(
  req: Request<Omit<CreateAppointmentArgs, 'provider'>>,
  res: Response,
) {
  const { username, type } = req.user!
  if (type !== UserType.SERVICE_PROVIDER) {
    return unauthorizedRequest(res)
  }

  try {
    const createAppointmentArgs: CreateAppointmentArgs = {
      ...req.body,
      provider: username,
    }

    const appointment = await createAppointment(createAppointmentArgs)
    res.json({ appointment })
  } catch (err) {
    const errMsg = `failed to create new appointment for user: '${username}', because: ${err}`
    console.error(errMsg)
    console.log(err)
    return badRequest(res, 'Failed to create appointment')
  }
}

/**
 * Handles the request to book an appointment.
 *
 * Requires an authenticated user for access.
 * For use by regular users only.
 *
 * @param req - The request object containing the appointment details.
 * @param res - The response object to send the result.
 * @returns The appointment details if successful, or an error message if failed.
 */
async function bookAppointmentHandler(
  req: Request<BookAppointmentArgs>,
  res: Response,
) {
  const { username, type } = req.user!
  if (type !== UserType.REGULAR) {
    return unauthorizedRequest(res)
  }

  try {
    const bookAppointmentArgs = req.body
    const appointment = await bookAppointment(bookAppointmentArgs)
    res.json({ appointment })
  } catch (err) {
    const errMsg = `failed to book appointment for user: '${username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to book appointment')
  }
}

const router = Router()
router.get('/', ensureAuthenticated, getBookedAppointmentsHandler)
router.get('/all', ensureAuthenticated, getAllAppointmentsHandler)
router.get('/:appointmentId', ensureAuthenticated, getBookedAppointmentHandler)
router.post('/', ensureAuthenticated, createAppointmentHandler)
router.post('/book', ensureAuthenticated, bookAppointmentHandler)

export default router
