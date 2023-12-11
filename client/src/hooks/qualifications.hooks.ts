import { useEffect, useState } from 'react'
import api from '../api'
import { useUser } from '.'
import { Qualification } from '../types'

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
      }
    } catch (err) {
      console.error(err)
    }
  }

  return { qualifications, addQualification }
}
