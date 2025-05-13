import express from 'express'
import { toursRouter } from './routes/tour-routes'

export const app = express()

app.use(express.json())
app.use('/api/v1/tours', toursRouter)

