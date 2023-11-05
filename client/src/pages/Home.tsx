import { Link } from 'react-router-dom'
import Qualifications from '../components/Qualifications'
import { useUser } from '../hooks'
import Img1 from '../images/Greeting.png'
import QualificationsImg from '../images/Qualifications.png' // Placeholder image for qualifications card
import Layout from '../layout/Layout'
import { UserType } from '../types' // Import UserType enum

export default function Home() {
  const { user } = useUser()

  return (
    <Layout>
      <div className="container p-6 mx-auto">
        <div className="flex flex-wrap -mx-2">
          {/* Welcome card */}
          <div className="w-full md:w-1/2 px-2 mb-4">
            <div className="card bg-base-200 shadow-xl h-auto">
              <figure className="h-48 overflow-hidden">
                <img src={Img1} alt="Graphic" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{`Welcome Back ${
                  user!.first_name
                }!`}</h2>
                <div className="card-actions justify-end">
                  <Link to="/schedule" className="btn btn-primary">
                    Schedule
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {user && user.type === UserType.SERVICE_PROVIDER && (
            <div className="w-full md:w-1/2 px-2 mb-4">
              <div className="card bg-base-200 shadow-xl h-auto">
                <figure className="h-48 overflow-hidden">
                  <img
                    src={QualificationsImg}
                    alt="Qualifications"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <Qualifications />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
