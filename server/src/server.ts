import bodyParser from 'body-parser'
import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
import 'reflect-metadata'
import { v4 } from 'uuid'
import appointmentRouter from './routers/appointment.router'
import authRouter from './routers/auth.router'
import notificationRouter from './routers/notification.router'
import providerRouter from './routers/provider.router'

const app = express()
app.disable('x-powered-by')

const PORT = process.env.PORT || 3000

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json())

app.use(morgan('dev'))

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
app.use('/provider', providerRouter)
app.use('/notification', notificationRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
