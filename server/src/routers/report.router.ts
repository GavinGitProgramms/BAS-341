import {
  AppointmentDto,
  AppointmentType,
  SearchAppointmentsDto,
  SortDirection,
  searchAppointments,
} from 'bas-db'
import { Request, Response, Router } from 'express'
import { ensureAdmin } from '../middleware'
import { ReportStats } from '../types'
import { badRequest } from '../utils'

/**
 * Generates report statistics based on the provided appointments.
 *
 * @param appointments - An array of AppointmentDto objects.
 * @returns The report statistics object.
 */
function generateReportStats(appointments: AppointmentDto[]): ReportStats {
  const stats = {
    appointmentCountByType: {} as Record<AppointmentType, number>,
    appointmentStatusCount: { canceled: 0, notCanceled: 0 },
    averageDuration: 0,
    appointmentsOverTime: {} as Record<string, number>, // Key can be a date string
    appointmentCountByProvider: {} as Record<string, number>,
    userParticipation: {} as Record<string, number>,
  }

  let totalDuration = 0

  appointments.forEach((appointment) => {
    // Count by Type
    stats.appointmentCountByType[appointment.type] =
      (stats.appointmentCountByType[appointment.type] || 0) + 1

    // Count by Status
    if (appointment.canceled) {
      stats.appointmentStatusCount.canceled++
    } else {
      stats.appointmentStatusCount.notCanceled++
    }

    // Calculate Duration
    const duration =
      (new Date(appointment.end_time).getTime() -
        new Date(appointment.start_time).getTime()) /
      1000 /
      60 // Duration in minutes
    totalDuration += duration

    // Appointments Over Time
    const dateString = appointment.start_time.toISOString().split('T')[0] // Extracting date in YYYY-MM-DD format
    stats.appointmentsOverTime[dateString] =
      (stats.appointmentsOverTime[dateString] || 0) + 1

    // Count by Provider
    if (appointment.provider) {
      const providerId = appointment.provider.id
      stats.appointmentCountByProvider[providerId] =
        (stats.appointmentCountByProvider[providerId] || 0) + 1
    }

    // User Participation
    if (appointment.user) {
      const userId = appointment.user.id
      stats.userParticipation[userId] =
        (stats.userParticipation[userId] || 0) + 1
    }
  })

  // Average Duration
  stats.averageDuration = totalDuration / appointments.length

  return stats
}

/**
 * Generates an appointment report based on the provided request parameters.
 *
 * @param req - The request object containing the user information and query parameters.
 * @param res - The response object used to send the generated report.
 * @returns A JSON response containing the appointment report statistics.
 */
async function generateAppointmentReport(req: Request, res: Response) {
  const { username } = req.user!

  try {
    // Parsing query parameters into the appropriate types
    const dto: SearchAppointmentsDto = {
      userId: req.query.userId as string,
      providerId: req.query.providerId as string,
      type: req.query.type as AppointmentType,
      description: req.query.description as string,
      startTime: req.query.startTime as string,
      endTime: req.query.endTime as string,
      canceled:
        req.query.canceled === undefined || req.query.canceled === ''
          ? undefined
          : req.query.canceled === 'true',
      page: parseInt(req.query.page as string, 10),
      rowsPerPage: parseInt(req.query.rowsPerPage as string, 10),
      sortField: req.query.sortField as string,
      sortDirection: req.query.sortDirection as SortDirection,
      unbookedOnly: req.query.unbookedOnly === 'true',
    }

    // Get every page of results
    const results = await searchAppointments(dto, { user: username })
    while (results.results.length < results.total) {
      dto.page += 1
      const nextResults = await searchAppointments(dto, { user: username })
      results.results = results.results.concat(nextResults.results)
    }

    const reportStats = generateReportStats(results.results)
    res.json(reportStats)
  } catch (err) {
    const errMsg = `failed to generate appointments report because: ${err}`
    console.error(errMsg)
    return badRequest(res, 'Failed to generate appointments report')
  }
}

const router = Router()
router.get('/appointment', ensureAdmin, generateAppointmentReport)

export default router
