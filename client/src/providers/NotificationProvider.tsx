import React, { createContext, useEffect, useState } from 'react'
import { useNotifications, useUser } from '../hooks'
import { Notification } from '../types'

export type NotificationsContextType = {
  notifications: Notification[]
  getNotification: (notificationId: string) => Promise<Notification | null>
  viewNotification: (notificationId: string) => Promise<Notification | null>
}

export type NotificationsProviderProps = {
  children: React.ReactNode
}

function defaultNotificationsContext(): NotificationsContextType {
  return {
    notifications: [],
    getNotification: async () => null,
    viewNotification: async () => null,
  }
}

export const NotificationsContext = createContext<NotificationsContextType>(
  defaultNotificationsContext(),
)

export default function NotificationsProvider({
  children,
}: NotificationsProviderProps) {
  const { isAuthenticated } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { listNotifications, getNotification, viewNotification } =
    useNotifications()

  async function fetchNotifications() {
    const fetchedNotifications = await listNotifications()
    setNotifications(fetchedNotifications)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    fetchNotifications()
  }, [isAuthenticated])

  const viewNotificationCallback = React.useCallback(
    async (notificationId: string) => {
      const notification = await viewNotification(notificationId)
      if (notification) {
        await fetchNotifications()
      }
      return notification
    },
    [isAuthenticated, viewNotification],
  )

  const context = {
    notifications,
    getNotification,
    viewNotification: viewNotificationCallback,
  }

  return (
    <NotificationsContext.Provider value={context}>
      {children}
    </NotificationsContext.Provider>
  )
}
