import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './src/config/db.js'
import Member from './src/models/Member.js'
import Trainer from './src/models/Trainer.js'

await connectDB()
await Member.deleteMany({})
await Trainer.deleteMany({})

await Member.create([
  { name: 'FitZone Admin', email: 'admin@fitzone.com', phone: '9998887770', membershipType: 'platinum', role: 'Admin' },
  { name: 'Aarav Patel', email: 'member@fitzone.com', phone: '9876543210', membershipType: 'premium', role: 'Member' },
  { name: 'Riya Shah', email: 'riya@fitzone.com', phone: '9876501234', membershipType: 'basic', role: 'Member' }
])

await Trainer.create([
  { name: 'Neha Mehta', specialization: 'Strength & Conditioning', available: true },
  { name: 'Karan Joshi', specialization: 'Yoga & Pilates', available: true },
  { name: 'Mira Desai', specialization: 'HIIT & Cardio', available: true },
  { name: 'Vikram Singh', specialization: 'CrossFit & Boxing', available: false }
])

console.log('Seed data inserted successfully')
await mongoose.disconnect()

