import { useEffect, useState } from 'react'
import api from '../api'
import { ReportStats, SearchAppointmentsDto } from '../types'
import { useUser } from './user.hooks'

const GET_APPOINTMENT_REPROT_URL = '/report/appointment'

/**
 * Custom hook that retrieves stats for a set of appointments gathered using search parameters.
 *
 * @param searchParams - The search parameters used to filter the appointments.
 * @returns An object containing the stats for the appointments.
 */
export function useAppointmentReport(
  searchParams: SearchAppointmentsDto | undefined | null,
) {
  const { isAuthenticated } = useUser()
  const [stats, setStats] = useState<ReportStats | null>(null)

  /**
   * Retrieves stats for a set of appointments gathered using search parameters.
   *
   * @returns A Promise that resolves to void.
   */
  async function getAppointmentReport(): Promise<void> {
    try {
      // Constructing query string from searchParams
      const queryParams = new URLSearchParams()
      Object.entries(searchParams || {}).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })

      const response = await api.get(
        `${GET_APPOINTMENT_REPROT_URL}?${queryParams.toString()}`,
      )

      if (response.status === 200) {
        setStats(response.data)
      } else {
        setStats(null)
      }
    } catch (err) {
      console.error(err)
      setStats(null)
    }
  }

  useEffect(() => {
    if (!isAuthenticated || !searchParams) {
      setStats(null)
      return
    }

    getAppointmentReport()
  }, [isAuthenticated, searchParams])

  return {
    stats,
  }
}
