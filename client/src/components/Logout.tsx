import { MouseEventHandler } from 'react'
import axios from '../api/axios'
const LOGOUT_URL = '/auth/logout'

export function Logout(props: any) {
  const handleButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    try {
      const response = await axios.post(LOGOUT_URL, JSON.stringify({}), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
    } catch (error) {
      console.log('Logout Failed')
    }
  }

  return <button onClick={handleButtonClick}>Logout</button>
}
