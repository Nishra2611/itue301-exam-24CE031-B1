import jwt from 'jsonwebtoken'
import Member from '../models/Member.js'

export default async function authGuard(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Bearer token required' })
    const token = header.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const member = await Member.findById(payload.memberId)
    if (!member) return res.status(401).json({ success: false, message: 'Invalid authentication' })
    req.member = member
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}
