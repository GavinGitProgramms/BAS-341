import Layout from '../layout/Layout'

import { useUser } from '../hooks'
import Img1 from '../images/Img1.png'

export default function Home() {
  const { user } = useUser()
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="card m-3 w-96 bg-primary-content shadow-xl">
          <figure>
            <img src={Img1} alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{`Welcome Back ${
              user!.first_name
            }!`}</h2>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Schedule</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
