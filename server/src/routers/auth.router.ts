import {
  CreateUserArgs,
  UserType,
  checkCredentials,
  createUser,
  getUser,
} from 'bas-db'
import { Request, Response, Router } from 'express'
import { ensureAuthenticated } from '../middleware'
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
 * Handles requests for user data.
 *
 * Requires an authenticated user for access.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The user data if the request is authorized and the user exists, otherwise an error message.
 */
async function userHandler(req: Request, res: Response) {
  const { username } = req.user!
  const user = await getUser({ username })
  if (!user) {
    return badRequest(res, 'No user data was found')
  }

  return res.json({
    username: user.username,
    email: user.email,
    type: user.type,
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
  })
}

const router = Router()
router.post('/register', registerHandler)
router.post('/login', loginHandler)
router.get('/logout', ensureAuthenticated, logoutHandler)
router.get('/user', ensureAuthenticated, userHandler)

export default router
