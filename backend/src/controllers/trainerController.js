import Trainer from '../models/Trainer.js'

export async function getTrainers(req, res, next) {
  try {
    const trainers = await Trainer.find().sort({ name: 1 })
    return res.status(200).json({ success: true, data: trainers })
  } catch (err) {
    next(err)
  }
}

export async function createTrainer(req, res, next) {
  try {
    const { name, specialization, available } = req.body
    if (!name || !specialization) {
      return res.status(400).json({ success: false, message: 'Name and specialization are required' })
    }

    const trainer = await Trainer.create({
      name: name.trim(),
      specialization: specialization.trim(),
      available: available !== undefined ? Boolean(available) : true
    })

    return res.status(201).json({ success: true, message: 'Trainer added successfully', data: trainer })
  } catch (err) {
    next(err)
  }
}

export async function updateTrainer(req, res, next) {
  try {
    const { name, specialization, available } = req.body
    const updateData = {}
    if (name !== undefined) updateData.name = name.trim()
    if (specialization !== undefined) updateData.specialization = specialization.trim()
    if (available !== undefined) updateData.available = Boolean(available)

    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' })
    return res.status(200).json({ success: true, message: 'Trainer updated successfully', data: trainer })
  } catch (err) {
    next(err)
  }
}

export async function deleteTrainer(req, res, next) {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id)
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' })
    return res.status(200).json({ success: true, message: 'Trainer deleted successfully' })
  } catch (err) {
    next(err)
  }
}

