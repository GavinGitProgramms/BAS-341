import 'express-session'
import { UserSession } from './auth.types'

declare module 'express-session' {
  export interface SessionData extends Partial<UserSession> {}
}

export {}

declare global {
  namespace Express {
    export interface Request {
      user?: UserSession
    }
  }
}
