import { Router } from 'express'
import { getAllMembers, createMember, updateMember, deleteMember } from '../controllers/memberController.js'
import authGuard from '../middleware/authGuard.js'

const router = Router()

router.use(authGuard)
router.get('/', getAllMembers)
router.post('/', createMember)
router.patch('/:id', updateMember)
router.delete('/:id', deleteMember)

export default router
