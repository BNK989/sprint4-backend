import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb


export async function sellerQuery() {
    try {
        const { loggedinUser } = asyncLocalStorage.getStore()
        const id = loggedinUser._id
        console.log('id:', id)
        
        const OrdersCollection = await dbService.getCollection('orders')
        // console.log('collection:', OrdersCollection)
        const orders = await OrdersCollection.find({"seller._id": id}).toArray()
        
        console.log('ordersservice:', orders)
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

        const orderCollection = await dbService.getCollection('orders')
        const orders = await orderCollection.find({'buyer._id': id}).toArray()
        // console.log('31 orders:', orders)

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
        const collection = await dbService.getCollection('orders')
        await collection.insertOne(order)

        return order
    } catch (err) {
        logger.error('Cannot insert Order', err)
        throw err
    }
}

export async function updateStatus(orderId, newStatus) {
    console.log('newStatus:',newStatus )
    try {
        const collection = await dbService.getCollection('orders')
        const updatedOrder = await collection.findOneAndUpdate({ _id: new ObjectId(orderId) }, { $set: { status: newStatus } }, { returnDocument: 'after' })
        console.log('updatedOrder:', updatedOrder)
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