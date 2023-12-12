import { useEffect, useState } from 'react'
import api from '../api'
import { useUser } from '.'
import { Qualification } from '../types'
import { errorNotification, successNotification } from '../utils'

const QUALIFICATION_URL = '/provider/qualification'

export function useQualifications() {
  const { isAuthenticated, user } = useUser()
  const [qualifications, setQualifications] = useState<Qualification[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      setQualifications([])
    } else {
      setQualifications(user?.qualifications || [])
    }
  }, [isAuthenticated])

  async function addQualification(description: string) {
    try {
      const response = await api.post(QUALIFICATION_URL, { description })

      // TODO: handle errors
      if (response.status === 200) {
        setQualifications(response.data.user.qualifications)
        successNotification('Qualification added successfully')
      } else {
        errorNotification('Failed to add qualification')
      }
    } catch (err) {
      console.error(err)
      errorNotification('Failed to add qualification')
    }
  }

  return { qualifications, addQualification }
}
