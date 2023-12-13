import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { format, parseISO } from 'date-fns'
import { Bar, Doughnut } from 'react-chartjs-2'
import { ReportStats } from '../types'

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
)

export type AppointmentStatsProps = {
  stats: ReportStats
}

export function AppointmentStats({ stats }: AppointmentStatsProps) {
  // Prepare data for Doughnut chart - Appointment Types
  const appointmentTypeData = {
    labels: Object.keys(stats.appointmentCountByType),
    datasets: [
      {
        label: 'Appointment Types',
        data: Object.values(stats.appointmentCountByType),
        backgroundColor: [
          'rgba(255, 99, 132, 0.33)',
          'rgba(54, 162, 235, 0.33)',
          'rgba(255, 206, 86, 0.33)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const formattedLabels = stats.appointmentsOverTime
    ? Object.keys(stats.appointmentsOverTime).map((dateStr) =>
        format(parseISO(dateStr), 'MMM. dd, yyyy'),
      )
    : []

  // Prepare data for Bar chart - Appointments Over Time
  const appointmentsOverTimeData = {
    labels: formattedLabels,
    datasets: [
      {
        label: 'Appointments Over Time',
        data: Object.values(stats.appointmentsOverTime),
        backgroundColor: 'rgba(153, 102, 255, 0.33)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  }

  const barChartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        align: 'end',
        labels: {
          padding: 20,
        },
      },
    },
    scales: { y: { beginAtZero: true } },
  }

  const pieChartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        align: 'end',
        labels: {
          padding: 20,
        },
      },
    },
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Left Column */}
      <div className="w-full lg:w-1/2">
        {/* Appointment Stats */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Appointment Stats</h2>
            <p>Average Duration: {stats.averageDuration.toFixed(2)} minutes</p>
            <p>
              Appointments Available: {stats.appointmentStatusCount.notCanceled}
            </p>
            <p>
              Appointments Canceled: {stats.appointmentStatusCount.canceled}
            </p>
          </div>
        </div>

        {/* Bar Chart for Appointments Over Time */}
        <div className="card bg-base-100 mt-6 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Appointments Over Time</h2>
            <Bar
              data={appointmentsOverTimeData}
              options={barChartOptions as any}
            />
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2">
        {/* Doughnut Chart for Appointment Type Counts */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Appointments by Type</h2>
            <Doughnut data={appointmentTypeData} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}
