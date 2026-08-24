import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import requestLogger from './middleware/requestLogger.js'
import authGuard from './middleware/authGuard.js'
import errorHandler from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import trainerRoutes from './routes/trainerRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import memberRoutes from './routes/memberRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use(requestLogger)

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/trainers', trainerRoutes)
app.use('/api/v1/bookings', authGuard, bookingRoutes)
app.use('/api/v1/members', memberRoutes)


app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }))
app.use(errorHandler)

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`FitZone API running on http://localhost:${PORT}`))
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`\n⚠️  Port ${PORT} is already in use (Server is already running on http://localhost:${PORT}).`)
          process.exit(0)
        } else {
          console.error('Server error:', err.message)
          process.exit(1)
        }
      })
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message)
    process.exit(1)
  })



export default app
