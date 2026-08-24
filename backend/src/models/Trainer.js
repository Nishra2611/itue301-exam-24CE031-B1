import mongoose from 'mongoose'

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, trim: true },
  specialization: { type: String, required: true, minlength: 2, trim: true },
  available: { type: Boolean, default: true, required: true }
}, { timestamps: true })

export default mongoose.model('Trainer', trainerSchema)
