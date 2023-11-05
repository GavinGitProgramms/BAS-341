import Layout from '../layout/Layout'

import Img1 from '../images/Img1.png'

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="card m-3 w-96 bg-base-100 shadow-xl">
          <figure>
            <img src={Img1} alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Welcome Back!</h2>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Schedule</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
