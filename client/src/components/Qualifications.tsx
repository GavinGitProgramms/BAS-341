import { useState } from 'react'
import { useQualifications } from '../hooks'

export default function Qualifications() {
  const [description, setDescription] = useState('')
  const { qualifications, addQualification } = useQualifications()

  async function handleAddQualification() {
    if (description) {
      await addQualification(description)
      setDescription('')
    }
  }

  return (
    <div className="card-body">
      <h3 className="card-title">Your Qualifications</h3>
      <ul>
        {qualifications.map(({ id, description }) => (
          <li key={id}>{description}</li>
        ))}
      </ul>
      <div className="form-control">
        <label className="label" htmlFor="qualification-input">
          <span className="label-text">Add Qualification</span>
        </label>
        <div className="input-group">
          <input
            id="qualification-input"
            type="text"
            placeholder="Qualification"
            className="input input-bordered"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAddQualification}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
