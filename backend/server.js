import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

app.use(cors({ origin: CORS_ORIGIN }))
app.use(express.json())

// Healthcheck endpoint (Foundation placeholder)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'datadignity-backend',
    timestamp: new Date().toISOString()
  })
})

// Start server listening
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[DataDignity Backend] Service foundation running on port ${PORT}`)
  })
}

export default app
