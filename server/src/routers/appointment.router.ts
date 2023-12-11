import {
  AppointmentDto,
  AppointmentType,
  BookAppointmentArgs,
  CancelAppointmentArgs,
  CreateAppointmentArgs,
  SearchAppointmentsDto,
  SearchResults,
  SortDirection,
  UserType,
  bookAppointment,
  cancelAppointment,
  createAppointment,
  getAppointment,
  searchAppointments,
} from 'bas-db'
import { Request, Response, Router } from 'express'
import { ensureAuthenticated } from '../middleware'
import { badRequest, notFoundRequest, unauthorizedRequest } from '../utils'

/**
 * Handles the searchAppointments request.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the search results of appointments.
 */
async function searchAppointmentsHandler(
  req: Request,
  res: Response<SearchResults<AppointmentDto>>,
) {
  const { username } = req.user!

  try {
    // Parsing query parameters into the appropriate types
    const dto: SearchAppointmentsDto = {
      userId: req.query.userId as string,
      providerId: req.query.providerId as string,
      type: req.query.type as AppointmentType,
      description: req.query.description as string,
      startTime: req.query.startTime as string,
      endTime: req.query.endTime as string,
      canceled: req.query.canceled === 'true', // Parsing the string to a boolean
      page: parseInt(req.query.page as string, 10),
      rowsPerPage: parseInt(req.query.rowsPerPage as string, 10),
      sortField: req.query.sortField as string,
      sortDirection: req.query.sortDirection as SortDirection,
    }

    const results = await searchAppointments(dto, { user: username })
    res.json(results)
  } catch (err) {
    const errMsg = `failed to search appointments for user: '${username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to search appointments')
  }
}

/**
 * Handles GET requests for a specific appointment by ID for a given user.
 *
 * Requires an authenticated user for access. Regular users can't access
 * appointments booked by other users.
 *
 * @param req - The request object containing the authenticated user and the appointment ID.
 * @param res - The response object to send the appointment data or error message.
 * @returns The appointment data or an error message if the appointment search fails.
 */
async function getAppointmentHandler(req: Request, res: Response) {
  const { username } = req.user!
  const { appointmentId } = req.params
  try {
    const appointment = await getAppointment({
      id: appointmentId,
      user: username,
    })

    if (!appointment) {
      return notFoundRequest(res, 'Appointment not found')
    }

    res.json({ appointment })
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
  req: Request<Omit<BookAppointmentArgs, 'user'>>,
  res: Response,
) {
  const { username, type } = req.user!
  if (type !== UserType.REGULAR) {
    return unauthorizedRequest(res)
  }

  try {
    const bookAppointmentArgs: BookAppointmentArgs = {
      ...req.body,
      user: username,
    }

    const appointment = await bookAppointment(bookAppointmentArgs)
    res.json({ appointment })
  } catch (err) {
    const errMsg = `failed to book appointment for user: '${username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to book appointment')
  }
}

/**
 * Handler function for cancelling an appointment.
 *
 * @param req - The request object containing the appointment cancellation arguments.
 * @param res - The response object to send the appointment cancellation result.
 * @returns A JSON response containing the cancelled appointment.
 */
async function cancelAppointmentHandler(
  req: Request<Omit<CancelAppointmentArgs, 'user'>>,
  res: Response,
) {
  const { username } = req.user!
  try {
    const cancelAppointmentArgs: CancelAppointmentArgs = {
      ...req.body,
      user: username,
    }

    const appointment = await cancelAppointment(cancelAppointmentArgs)
    res.json({ appointment })
  } catch (err) {
    const errMsg = `failed to cancel appointment because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to cancel appointment')
  }
}

const router = Router()
router.post('/', ensureAuthenticated, createAppointmentHandler)
router.get('/search', ensureAuthenticated, searchAppointmentsHandler)
router.post('/book', ensureAuthenticated, bookAppointmentHandler)
router.post('/cancel', ensureAuthenticated, cancelAppointmentHandler)
router.get('/:appointmentId', ensureAuthenticated, getAppointmentHandler)

export default router
