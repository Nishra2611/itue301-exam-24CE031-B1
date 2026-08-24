import ClassBooking from '../models/ClassBooking.js'
import Trainer from '../models/Trainer.js'

export async function createBooking(req, res, next) {
  try {
    const { trainerId, className, date, timeSlot } = req.body
    if (!trainerId || !className || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'trainerId, className, date and timeSlot are required' })
    }

    const trainer = await Trainer.findById(trainerId)
    if (!trainer) return res.status(400).json({ success: false, message: 'Trainer not found' })
    if (!trainer.available) return res.status(400).json({ success: false, message: 'Trainer is currently fully booked' })

    const booking = await ClassBooking.create({
      memberId: req.member._id,
      trainerId,
      className,
      date,
      timeSlot
    })

    return res.status(201).json({ success: true, message: 'Booking created successfully', data: booking })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'This trainer already has a booking for this date and time slot.' })
    }
    next(err)
  }
}

export async function getMyBookings(req, res, next) {
  try {
    const bookings = await ClassBooking.find({ memberId: req.member._id })
      .populate('memberId', 'name email')
      .populate('trainerId', 'name specialization')
      .sort({ date: 1 })
    return res.status(200).json({ success: true, data: bookings })
  } catch (err) {
    next(err)
  }
}

export async function getAllBookings(req, res, next) {
  try {
    const bookings = await ClassBooking.find()
      .populate('memberId', 'name email membershipType')
      .populate('trainerId', 'name specialization')
      .sort({ createdAt: -1 })
    return res.status(200).json({ success: true, data: bookings })
  } catch (err) {
    next(err)
  }
}

export async function updateBookingStatus(req, res, next) {
  try {
    const { status } = req.body
    if (!['booked', 'attended', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    const query = req.member.role === 'Admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, memberId: req.member._id }

    const booking = await ClassBooking.findOneAndUpdate(
      query,
      { status },
      { new: true, runValidators: true }
    )

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    return res.status(200).json({ success: true, message: 'Booking status updated', data: booking })
  } catch (err) {
    next(err)
  }
}

export async function deleteBooking(req, res, next) {
  try {
    const query = req.member.role === 'Admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, memberId: req.member._id }

    const booking = await ClassBooking.findOneAndDelete(query)
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    return res.status(200).json({ success: true, message: 'Booking cancelled successfully' })
  } catch (err) {
    next(err)
  }
}

