import { getNotification, listNotifications, viewNotification } from 'bas-db'
import { Request, Response, Router } from 'express'
import { ensureAuthenticated } from '../middleware'
import { badRequest, notFoundRequest } from '../utils'

/**
 * Handles the request to list notifications for a user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the list of notifications, or an error response.
 */
async function listNotificationsHandler(req: Request, res: Response) {
  const { username } = req.user!
  try {
    const notifications = await listNotifications({
      user: username,
    })

    if (!notifications) {
      return notFoundRequest(res, 'Notifications not found')
    }

    res.json({ notifications })
  } catch (err) {
    const errMsg = `failed to list notifications for user: '${username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to list notifications')
  }
}

/**
 * Handles the GET request to retrieve a notification.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the retrieved notification or an error message.
 */
async function getNotificationHandler(req: Request, res: Response) {
  const { username } = req.user!
  const { notificationId } = req.params
  try {
    const notification = await getNotification({
      id: notificationId,
      user: username,
    })

    if (!notification) {
      return notFoundRequest(res, 'Notification not found')
    }

    res.json({ notification })
  } catch (err) {
    const errMsg = `failed to get notification for user: '${username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to get notification')
  }
}

/**
 * Handles the request to view a notification.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the notification if successful, or an error response if failed.
 */
async function viewNotificationHandler(req: Request, res: Response) {
  const { username } = req.user!
  const { notificationId } = req.params
  try {
    const notification = await viewNotification({
      id: notificationId,
      user: username,
    })

    if (!notification) {
      return notFoundRequest(res, 'Notification not found')
    }

    res.json({ notification })
  } catch (err) {
    const errMsg = `failed to view notification for user: '${username}', because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to view notification')
  }
}

const router = Router()
router.get('/list', ensureAuthenticated, listNotificationsHandler)
router.get('/:notificationId', ensureAuthenticated, getNotificationHandler)
router.post(
  '/view/:notificationId',
  ensureAuthenticated,
  viewNotificationHandler,
)

export default router
