import jwt from 'jsonwebtoken'
import Member from '../models/Member.js'

export async function login(req, res, next) {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' })

    const member = await Member.findOne({ email: email.toLowerCase().trim() })
    if (!member) return res.status(401).json({ success: false, message: 'Member not found. Please register first.' })

    const token = jwt.sign({ memberId: member._id.toString(), role: member.role }, process.env.JWT_SECRET, { expiresIn: '24h' })
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        role: member.role,
        member: { id: member._id, _id: member._id, name: member.name, email: member.email, phone: member.phone, membershipType: member.membershipType, role: member.role }
      }
    })
  } catch (err) {
    next(err)
  }
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, membershipType, role } = req.body
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required' })
    }

    const cleanEmail = email.toLowerCase().trim()
    const existing = await Member.findOne({ email: cleanEmail })
    if (existing) {
      return res.status(400).json({ success: false, message: 'Member with this email already exists' })
    }

    const member = await Member.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      membershipType: membershipType || 'basic',
      role: role || 'Member'
    })

    const token = jwt.sign({ memberId: member._id.toString(), role: member.role }, process.env.JWT_SECRET, { expiresIn: '24h' })
    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to FitZone.',
      data: {
        token,
        role: member.role,
        member: { id: member._id, _id: member._id, name: member.name, email: member.email, phone: member.phone, membershipType: member.membershipType, role: member.role }
      }
    })
  } catch (err) {
    next(err)
  }
}

export async function getMe(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: {
        member: {
          id: req.member._id,
          _id: req.member._id,
          name: req.member.name,
          email: req.member.email,
          phone: req.member.phone,
          membershipType: req.member.membershipType,
          role: req.member.role
        }
      }
    })
  } catch (err) {
    next(err)
  }
}

