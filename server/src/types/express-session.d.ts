import session from 'express-session'

declare module 'express-session' {
  export interface SessionData {
    // add your session properties here, for instance:
    username?: string
  }
}
