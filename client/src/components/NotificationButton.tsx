import { useState, useEffect, useRef, useContext } from 'react'
import { NotificationsContext } from '../providers/NotificationProvider'
import { FaEye } from 'react-icons/fa'
import { IoIosNotificationsOutline } from "react-icons/io"

export default function NotificationButton() {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)
  const { notifications, viewNotification } = useContext(NotificationsContext)

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={menuRef} className="relative">
      <button onClick={toggleMenu}>
        <IoIosNotificationsOutline size="2em" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
      {showMenu && (
        <div className="notification-menu absolute top-full left-1/2 z-50 bg-base-300 border border-gray-300 rounded shadow-xl mt-1 transform -translate-x-1/2 p-6 w-96 cursor-pointer">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div
                key={index}
                className="group notification-item p-2 hover:bg-gray-100 hover:text-black border-b border-white cursor-pointer flex justify-between items-center"
              >
                <span className="w-8 h-8">
                  <FaEye
                    className="hidden group-hover:flex p-1 text-blue-500 cursor-pointer bg-black rounded-full justify-center items-center"
                    onClick={() => viewNotification(notification.id)}
                  />
                </span>
                {notification.message}
              </div>
            ))
          ) : (
            <div>No notifications</div>
          )}
        </div>
      )}
    </div>
  )
}
