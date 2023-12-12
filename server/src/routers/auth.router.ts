import {
  CreateUserArgs,
  SearchUsersDto,
  SortDirection,
  UserType,
  checkCredentials,
  createUser,
  expandUser,
  searchUsers,
  disableUser,
  enableUser,
  userDto,
} from 'bas-db'
import { Request, Response, Router } from 'express'
import { ensureAdmin, ensureAuthenticated } from '../middleware'
import { badRequest, internalErrorRequest, unauthorizedRequest } from '../utils'

/**
 * Handles the registration of a new user.
 *
 * @param req - The request object containing the user data.
 * @param res - The response object to send the result.
 * @returns A JSON response indicating the success or failure of the registration.
 */
async function registerHandler(req: Request<CreateUserArgs>, res: Response) {
  const createUserArgs = req.body

  // TODO: validate the input better
  if (createUserArgs.type === UserType.ADMIN) {
    // Admin users can't be created from the client
    return unauthorizedRequest(res)
  }

  try {
    const user = await createUser(createUserArgs)
    if (!user) {
      return badRequest(res, 'Failed to register')
    }

    req.session.username = user.username
    req.session.type = user.type
    res.json({ message: 'Registered successfully' })
  } catch (err) {
    const errMsg = `failed to register user: '${createUserArgs.username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to register')
  }
}

/**
 * Handles the login request and authenticates the user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating whether the login was successful or not.
 */
async function loginHandler(req: Request, res: Response) {
  const { username, password } = req.body

  const user = await checkCredentials(username, password)
  if (!user) {
    return unauthorizedRequest(res)
  }

  req.session.username = user.username
  req.session.type = user.type
  res.json({ message: 'Logged in successfully' })
}

/**
 * Logout handler function that destroys the session and clears the session cookie.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @returns A JSON response indicating whether the logout was successful or not.
 */
async function logoutHandler(req: Request, res: Response) {
  req.session!.destroy((err) => {
    if (err) {
      return internalErrorRequest(res, 'Could not log out, please try again')
    }
    res.clearCookie('connect.sid') // Clear the session cookie
    res.json({ message: 'Logged out successfully' })
  })
}

/**
 * Handles the request to get user data for the authenticated user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the user data.
 */
async function getAuthUserHandler(req: Request, res: Response) {
  const { username } = req.user!
  const user = await expandUser(username)
  if (!user) {
    return badRequest(res, 'No user data was found')
  }

  return res.json(userDto(user))
}

/**
 * Handles the search users request.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The search results as a JSON response.
 */
async function searchUsersHandler(req: Request, res: Response) {
  const { username } = req.user!

  try {
    // Parsing query parameters into the appropriate types
    const dto: SearchUsersDto = {
      username: req.query.username as string,
      type: req.query.type as UserType,
      firstName: req.query.firstName as string,
      lastName: req.query.lastName as string,
      phoneNumber: req.query.phoneNumber as string,
      email: req.query.email as string,
      page: parseInt(req.query.page as string, 10),
      rowsPerPage: parseInt(req.query.rowsPerPage as string, 10),
      sortField: req.query.sortField as string,
      sortDirection: req.query.sortDirection as SortDirection,
      enabled: req.query.enabled === 'true',
    }

    const results = await searchUsers(dto, { user: username })
    res.json(results)
  } catch (err) {
    const errMsg = `failed to search users for user: '${username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to search users')
  }
}

/**
 * Handles the request to enable a user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the results of enabling the user.
 */
async function enableUserHandler(req: Request, res: Response) {
  const { username } = req.params
  try {
    const results = await enableUser(username)
    res.json(results)
  } catch (err) {
    const errMsg = `failed to enable user: '${username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to enable user')
  }
}

/**
 * Handles the request to disable a user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the results of disabling the user.
 */
async function disableUserHandler(req: Request, res: Response) {
  const { username } = req.params
  try {
    const results = await disableUser(username)
    res.json(results)
  } catch (err) {
    const errMsg = `failed to disable user: '${username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to disable user')
  }
}

/**
 * Retrieves user data based on the provided username.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the user data.
 */
async function getUserHandler(req: Request, res: Response) {
  const { username } = req.params
  const user = await expandUser(username)
  if (!user) {
    return badRequest(res, 'No user data was found')
  }

  return res.json(userDto(user))
}

const router = Router()

// Auth routes
router.post('/register', registerHandler)
router.post('/login', loginHandler)
router.get('/logout', ensureAuthenticated, logoutHandler)
router.get('/user', ensureAuthenticated, getAuthUserHandler)

// Admin routes
router.get('/user/search', ensureAdmin, searchUsersHandler)
router.put('/user/enable/:username', ensureAdmin, enableUserHandler)
router.put('/user/disable/:username', ensureAdmin, disableUserHandler)
router.put('/user/disable/:username', ensureAdmin, disableUserHandler)
router.get('/user/:username', ensureAdmin, getUserHandler)

export default router
