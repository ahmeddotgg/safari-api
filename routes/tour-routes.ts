import express from "express"
import { createTour, deleteTour, getAllTours, getSingleTour, getTrendingTours, updateTour } from "../controllers/tour-controller"

const router = express.Router()

router.route('/trending').get(getTrendingTours, getAllTours);
router.route('/').post(createTour).get(getAllTours)
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour)

export { router as toursRouter } 