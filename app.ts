import express from 'express'
import { toursRouter } from './routes/tour-routes'
import qs from 'qs'

export const app = express()

app.use(express.json())
app.use('/api/v1/tours', toursRouter)
app.set('query parser', (str: string) => qs.parse(str))