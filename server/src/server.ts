import bodyParser from 'body-parser'
import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
import path from 'path'
import 'reflect-metadata'
import { v4 } from 'uuid'
import appointmentRouter from './routers/appointment.router'
import authRouter from './routers/auth.router'
import notificationRouter from './routers/notification.router'
import providerRouter from './routers/provider.router'
import reportRouter from './routers/report.router'

const app = express()
app.disable('x-powered-by')

const MANUAL_NAME = 'BAS-Manual.pdf'

app.get('/help', (req, res) => {
  const file = path.join(__dirname, '..', 'public', MANUAL_NAME)
  res.download(file, MANUAL_NAME, (err) => {
    if (err) {
      console.error(err)
      if (!res.headersSent) {
        res.status(500).send('Error occurred while downloading the file.')
      }
    }
  })
})

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
app.use('/report', reportRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
