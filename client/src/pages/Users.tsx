import { useNavigate } from 'react-router-dom'
import UsersTable from '../components/UsersTable'
import UsersImg from '../images/UserManage.png'
import Layout from '../layout/Layout'

export default function Users() {
  const navigate = useNavigate()

  function handleRowClick(userId: string) {
    navigate(`/user/${userId}`)
  }

  return (
    <Layout>
      <div className="container p-6 mx-auto">
        <div className="flex flex-col items-center -mx-2">
          <div className="w-full xl:w-2/3 px-2 mb-4">
            <div className="card bg-base-200 shadow-xl h-auto">
              <figure className="h-48 overflow-hidden">
                <img
                  src={UsersImg}
                  alt="Users"
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Users</h2>
                <UsersTable onClick={handleRowClick} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
