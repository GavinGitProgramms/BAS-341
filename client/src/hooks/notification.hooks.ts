import api from '../api'
import { Notification } from '../types'
import { useUser } from './user.hooks'

const LIST_NOTIFICATIONS_URL = '/notification/list'
const GET_NOTIFICATION_URL = '/notification'
const VIEW_NOTIFICATION_URL = '/notification/view'

/**
 * Custom hook for managing notifications.
 *
 * Provides functions to retrieve and view notifications.
 */
export function useNotifications() {
  const { isAuthenticated } = useUser()

  /**
   * Retrieves a list of notifications.
   *
   * @returns A promise that resolves to an array of Notification objects.
   */
  async function listNotifications(): Promise<Notification[]> {
    if (!isAuthenticated) {
      return []
    }

    try {
      const response = await api.get(LIST_NOTIFICATIONS_URL)

      if (response.status === 200) {
        return response.data.notifications
      }

      return []
    } catch (err) {
      console.error(err)
      return []
    }
  }

  /**
   * Retrieves a notification by its ID.
   *
   * @param notificationId - The ID of the notification to retrieve.
   * @returns A Promise that resolves to the retrieved Notification object, or null if the user is not authenticated or an error occurs.
   */
  async function getNotification(
    notificationId: string,
  ): Promise<Notification | null> {
    if (!isAuthenticated) {
      return null
    }

    try {
      const response = await api.get(
        `${GET_NOTIFICATION_URL}/${notificationId}`,
      )

      if (response.status === 200) {
        return response.data.notification
      }

      return null
    } catch (err) {
      console.error(err)
      return null
    }
  }

  /**
   * Retrieves a notification by its ID and marks it as viewed.
   *
   * @param notificationId - The ID of the notification to view.
   * @returns A Promise that resolves to the viewed Notification object, or null if the user is not authenticated or an error occurs.
   */
  async function viewNotification(
    notificationId: string,
  ): Promise<Notification | null> {
    if (!isAuthenticated) {
      return null
    }

    try {
      const response = await api.post(
        `${VIEW_NOTIFICATION_URL}/${notificationId}`,
      )

      if (response.status === 200 || response.status === 201) {
        return response.data.notification
      }

      return null
    } catch (err) {
      console.error(err)
      return null
    }
  }

  return { listNotifications, getNotification, viewNotification }
}
