import { Router } from 'express'
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from '../controllers/trainerController.js'
import authGuard from '../middleware/authGuard.js'

const router = Router()

router.get('/', getTrainers)
router.post('/', authGuard, createTrainer)
router.patch('/:id', authGuard, updateTrainer)
router.delete('/:id', authGuard, deleteTrainer)

export default router

