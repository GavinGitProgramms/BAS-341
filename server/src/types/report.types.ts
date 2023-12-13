import { AppointmentType } from 'bas-db'

export type ReportStats = {
  appointmentCountByType: Record<AppointmentType, number>
  appointmentStatusCount: {
    canceled: number
    notCanceled: number
  }
  averageDuration: number
  appointmentsOverTime: Record<string, number> // Key is a date string in YYYY-MM-DD format
  appointmentCountByProvider: Record<string, number> // Key is the provider's ID
  userParticipation: Record<string, number> // Key is the user's ID
}
