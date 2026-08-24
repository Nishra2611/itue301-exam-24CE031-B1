import { Router } from 'express'
import { createBooking, getMyBookings, getAllBookings, updateBookingStatus, deleteBooking } from '../controllers/bookingController.js'

const router = Router()
router.post('/', createBooking)
router.get('/my', getMyBookings)
router.get('/', getAllBookings)
router.patch('/:id/status', updateBookingStatus)
router.delete('/:id', deleteBooking)

export default router

