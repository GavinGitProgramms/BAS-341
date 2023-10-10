import { CreateQualificationArgs, createQualification } from 'bas-db'
import { Request, Response, Router } from 'express'
import { ensureAuthenticated } from '../middleware'
import { badRequest, userDTO } from '../utils'

/**
 * Handler function for creating a service provider qualification.
 *
 * @param req - The request object containing the qualification data.
 * @param res - The response object to send the result.
 * @returns A JSON response containing the updated user object.
 */
async function createQualificationHandler(
  req: Request<Omit<CreateQualificationArgs, 'user'>>,
  res: Response,
) {
  const { username } = req.user!
  try {
    const createQualificationArgs: CreateQualificationArgs = {
      ...req.body,
      user: username,
    }

    const user = await createQualification(createQualificationArgs)
    if (!user) {
      return badRequest(res, 'Failed to create qualification')
    }

    res.json({ user: userDTO(user) })
  } catch (err) {
    const errMsg = `failed to create qualification for user: '${username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to create qualification')
  }
}

const router = Router()
router.post('/qualification', ensureAuthenticated, createQualificationHandler)

export default router
