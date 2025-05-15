import express from "express"
import { createTour, deleteTour, getAllTours, getSingleTour, getTourStats, getTrendingTours, updateTour } from "../controllers/tour-controller"

const router = express.Router()

router.route('/tours-stats').get(getTourStats);
router.route('/trending').get(getTrendingTours, getAllTours);
router.route('/').post(createTour).get(getAllTours)
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour)

export { router as toursRouter } 