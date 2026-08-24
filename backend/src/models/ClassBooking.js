import mongoose from 'mongoose'

const classBookingSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  className: { type: String, required: true, minlength: 2, trim: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true, minlength: 3, trim: true },
  status: { type: String, enum: ['booked', 'attended', 'cancelled'], default: 'booked', required: true }
}, { timestamps: true })

classBookingSchema.index({ trainerId: 1, date: 1, timeSlot: 1 }, { unique: true })

export default mongoose.model('ClassBooking', classBookingSchema)
