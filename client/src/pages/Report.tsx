import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AppointmentStats } from '../components/AppointmentStats'
import BackButton from '../components/GoBack'
import { useAppointmentReport } from '../hooks'
import Layout from '../layout/Layout'
import { SearchAppointmentsDto } from '../types'

export default function Report() {
  const location = useLocation()
  const [searchFilters, setSearchFilters] = useState<SearchAppointmentsDto>()
  const { stats } = useAppointmentReport(searchFilters)

  useEffect(() => {
    const params = queryString.parse(location.search)
    setSearchFilters(params as any)
  }, [location])

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {stats ? (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div>
                <BackButton />
              </div>
              <div className="w-full border-t border-white my-4"></div>
              <h2 className="card-title">Appointments Report</h2>
              <div className="w-full border-t border-white my-4"></div>
              <div className="space-y-4 mb-6">
                <AppointmentStats stats={stats} />
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </Layout>
  )
}
