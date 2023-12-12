import { AppDataSource } from '../data-source'
import { Notification } from '../entity'
import {
  CreateNotificationArgs,
  ListNotificationsArgs,
  ViewNotificationArgs,
} from '../types'
import { ensureInitialized } from './db.utils'
import { expandUser } from './user.utils'

/**
 * Creates a notification.
 *
 * @param {CreateNotificationArgs} args - The arguments for creating a notification.
 * @returns {Promise<Notification>} - A promise that resolves to the newly created notification.
 */
export async function createNotification({
  type,
  user,
  message,
}: CreateNotificationArgs): Promise<Notification> {
  await ensureInitialized()
  const notificationRepo = AppDataSource.getRepository(Notification)
  const notification = new Notification()
  notification.type = type
  notification.user = await expandUser(user)
  notification.message = message
  const newNotification = await notificationRepo.save(notification)
  return newNotification
}

/**
 * Retrieves a notification by its ID and marks it as viewed.
 *
 * @param {ViewNotificationArgs} args - The arguments for viewing a notification.
 * @returns {Promise<Notification>} - A promise that resolves to the updated notification.
 * @throws {Error} - If the notification is not found.
 */
export async function viewNotification({
  id,
  user,
}: ViewNotificationArgs): Promise<Notification> {
  await ensureInitialized()
  const notificationRepo = AppDataSource.getRepository(Notification)

  user = await expandUser(user)

  const notification = await notificationRepo.findOne({
    where: { id, user: { username: user.username } },
  })

  if (!notification) {
    throw new Error('notification not found')
  }

  notification.viewed = true
  const updatedNotification = await notificationRepo.save(notification)
  return updatedNotification
}

/**
 * Retrieves a notification based on the provided arguments.
 *
 * @param {ViewNotificationArgs} args - The arguments for retrieving the notification.
 * @returns {Promise<Notification>} - A promise that resolves to the retrieved notification.
 * @throws {Error} - If the notification is not found.
 */
export async function getNotification({
  id,
  user,
}: ViewNotificationArgs): Promise<Notification> {
  await ensureInitialized()
  const notificationRepo = AppDataSource.getRepository(Notification)

  user = await expandUser(user)

  const notification = await notificationRepo.findOne({
    where: { id, user: { username: user.username } },
  })

  if (!notification) {
    throw new Error('notification not found')
  }

  return notification
}

/**
 * Retrieves a list of notifications for a specific user.
 *
 * @param {ListNotificationsArgs} args - The arguments for listing notifications.
 * @returns {Promise<Notification[]>} - A promise that resolves to an array of notifications.
 */
export async function listNotifications({
  user,
}: ListNotificationsArgs): Promise<Notification[]> {
  await ensureInitialized()
  const notificationRepo = AppDataSource.getRepository(Notification)

  user = await expandUser(user)

  const notifications = await notificationRepo.find({
    where: { viewed: false, user: { username: user.username } },
    order: { created_date: 'DESC' },
  })

  return notifications
}
