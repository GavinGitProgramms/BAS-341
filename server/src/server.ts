import bodyParser from 'body-parser'
import express from 'express'
import session from 'express-session'
import { v4 } from 'uuid'
import appointmentRouter from './routers/appointment.router'
import authRouter from './routers/auth.router'

const app = express()
const PORT = 3000

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json())

// Use the session middleware to track authenticated users.
app.use(
  session({
    secret: v4(),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true },
  }),
)

app.use('/auth', authRouter)
app.use('/appointment', appointmentRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
