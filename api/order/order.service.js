import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb


export async function sellerQuery() {
    try {
        const { loggedinUser } = asyncLocalStorage.getStore()
        const id = loggedinUser._id

        const collection = await dbService.getCollection('order')
        const orders = await collection.aggregate([
            { $match: { "seller._id": id } },
            { $unwind: "$seller" },
            {
                $match: {
                    "seller._id": id
                }
            }
        ]).toArray()

        return orders
    } catch (err) {
        logger.error('Cannot get seller`s Orders ', err)
        throw err
    }
}

export async function buyerQuery() {
    try {
        const { loggedinUser } = asyncLocalStorage.getStore()
        const id = loggedinUser._id

        const collection = await dbService.getCollection('order')
        const orders = await collection.aggregate([
            { $match: { "buyer._id": id } },
            { $unwind: "$buyer" },
            {
                $match: {
                    "buyer._id": id
                }
            }
        ]).toArray()

        return orders
    } catch (err) {
        logger.error('Cannot get buyer`s Orders ', err);
        throw err;
    }
}

export async function add(order) {
    try {
        order.status = 'pending'
        order.createdAt = Date.now()
        const collection = await dbService.getCollection('order')
        await collection.insertOne(order)

        return order
    } catch (err) {
        logger.error('Cannot insert Order', err)
        throw err
    }
}

export async function updateStatus(orderId, newStatus) {
    try {
        const collection = await dbService.getCollection('order')
        const updatedOrder = await collection.findOneAndUpdate({ _id: new ObjectId(orderId) }, { $set: { status: newStatus } })
        return updatedOrder
    } catch (err) {
        logger.error('Cannot update Order status', err)
        throw err
    }
}

export const orderService = {
    sellerQuery,
    buyerQuery,
    add,
    updateStatus
}