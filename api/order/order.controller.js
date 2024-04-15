import { logger } from "../../services/logger.service.js"
import { orderService } from "./order.service.js"

export async function getOrdersById(req, res) {
    try {
        const filter = req.query
        // console.log('filter:', filter)
        let orders
        if (filter.buyer === 'true') {
            orders = await orderService.buyerQuery()
            console.log('getting buyer')
        } else {
            orders = await orderService.sellerQuery()
            console.log('getting seller')
        }
        res.json(orders)
    } catch (err) {
        logger.error("Failed to get orders", err)
        res.status(500).send({ err: "Failed to get orders" })
    }
}

export async function addOrder(req, res) {
    // const { loggedinUser } = req
    // console.log('loggedinuser from controller',loggedinUser);
    try {
        const order = req.body
        // order.buyerBack = loggedinUser
        const addedOrder = await orderService.add(order)
        res.json(addedOrder)
        console.log('addedOrder:', addedOrder)
    } catch (err) {
        logger.error("order.controller: Failed to add orders", err)
        res.status(500).send({ err: "Failed to add orders" })
    }
}

export async function updateStatus(req, res) {
    try {
        // console.log('req.body:', req.body)
        // console.log('req.params:', req.params.id)
        const gigId = req.params.id
        const status = req.body.value
        console.log('status:', status)
        const updatedOrder = await orderService.updateStatus(gigId, status)
        res.json(updatedOrder)
    } catch (err) {
        logger.error("Failed to update order status", err)
        res.status(500).send({ err: "Failed to update order status" })
    }
}