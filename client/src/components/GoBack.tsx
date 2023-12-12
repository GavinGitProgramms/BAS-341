import { useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate()

  function goBack(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.stopPropagation()
    event.preventDefault()
    navigate(-1)
  }

  return (
    <button onClick={goBack} className="btn btn-primary">
      &#8592; Back
    </button>
  )
}
