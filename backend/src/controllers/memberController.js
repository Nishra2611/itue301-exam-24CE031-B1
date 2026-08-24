import Member from '../models/Member.js'

export async function getAllMembers(req, res, next) {
  try {
    const members = await Member.find().sort({ createdAt: -1 })
    return res.status(200).json({ success: true, data: members })
  } catch (err) {
    next(err)
  }
}

export async function createMember(req, res, next) {
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

    return res.status(201).json({ success: true, message: 'Member created successfully', data: member })
  } catch (err) {
    next(err)
  }
}

export async function updateMember(req, res, next) {
  try {
    const { name, email, phone, membershipType, role } = req.body
    const updateData = {}
    if (name) updateData.name = name.trim()
    if (email) updateData.email = email.toLowerCase().trim()
    if (phone) updateData.phone = phone.trim()
    if (membershipType) updateData.membershipType = membershipType
    if (role) updateData.role = role

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!member) return res.status(404).json({ success: false, message: 'Member not found' })
    return res.status(200).json({ success: true, message: 'Member updated successfully', data: member })
  } catch (err) {
    next(err)
  }
}

export async function deleteMember(req, res, next) {
  try {
    const member = await Member.findByIdAndDelete(req.params.id)
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' })
    return res.status(200).json({ success: true, message: 'Member deleted successfully' })
  } catch (err) {
    next(err)
  }
}
