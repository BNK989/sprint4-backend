import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { getOrdersById, addOrder, updateStatus } from './order.controller.js'

const router = express.Router()

router.get('/', getOrdersById)
router.post('/', addOrder)
router.put('/:id', updateStatus)

export const orderRoutes = router
