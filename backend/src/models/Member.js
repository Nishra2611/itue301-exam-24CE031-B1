import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: { type: String, required: true, minlength: 10, trim: true },
  membershipType: { type: String, enum: ['basic', 'premium', 'platinum'], default: 'basic', required: true },
  role: { type: String, enum: ['Member', 'Admin'], default: 'Member', required: true }
}, { timestamps: true })

export default mongoose.model('Member', memberSchema)

