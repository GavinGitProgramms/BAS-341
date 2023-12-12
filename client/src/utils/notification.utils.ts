import toast from 'react-hot-toast'

export function successNotification(message: string) {
  toast.success(message, {
    duration: 4000,
    position: 'top-center',
    // Custom Icon
    icon: '👏',
    // Aria
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  })
}

export function errorNotification(message: string) {
  toast.error(message, {
    duration: 4000,
    position: 'top-center',
    // Aria
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  })
}
