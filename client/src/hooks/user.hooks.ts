import { useContext } from 'react'
import { UserContext, UserContextType } from '../providers/UserProvider'

export function useUser(): UserContextType {
  const context = useContext<UserContextType>(UserContext)
  return context
}
