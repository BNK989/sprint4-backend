import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

// const PAGE_SIZE = 3

async function query(filterBy = { title: '', category: '', price: 0 , daysToMake: 0, sellerLevel: null, userId: '' }, sortBy = 'recommended') {
    // console.log('from service:', filterBy, sortBy)
    try {
        const criteria = {}
        // console.log('filterBy:', filterBy)
        if (filterBy.userId) {
            criteria['owner._id'] = new ObjectId(filterBy.userId)
        }
        if (filterBy.title) {
            criteria.$or = [
                { title: { $regex: filterBy.title, $options: 'i' } },
                { 'packages.basic.description': { $regex: filterBy.title, $options: 'i' } }
            ]
        }

        if (filterBy.category) {
            criteria.category = filterBy.category
        }

        if (+filterBy.price) {
            criteria['packages.basic.price'] = { $lte: +filterBy.price }
        }

        if (+filterBy.daysToMake) {
            criteria['packages.basic.daysToMake'] = { $lte: +filterBy.daysToMake }
        }

        // if (filterBy.sellerLevel) {
        //     criteria['owner.rate'] = { $gte: +filterBy.sellerLevel }
        // }

        // console.log('criteria from service:', criteria)

        const collection = await dbService.getCollection('gigs')
        const gigs = await collection.find(criteria).toArray()
        // if (sortBy === 'recommended') {
        //     gigs.sort((gig1, gig2) => {
        //         const gig1ReviewsAvg = utilService.getAvgRating(gig1.reviews)
        //         const gig2ReviewsAvg = utilService.getAvgRating(gig2.reviews)
        //         return gig2ReviewsAvg - gig1ReviewsAvg
        //     })
        // } else if (sortBy === 'newest') {
        //     gigs.sort((gig1, gig2) => gig1.createdAt - gig2.createdAt)
        // } else if (sortBy === 'mostReviewed') {
        //     gigs.sort((gig1, gig2) => gig2.reviews.length - gig1.reviews.length)
        // }
        return gigs
    } catch (err) {
        logger.error('cannot find gigs', err)
        throw err
    }
}

async function getById(gigId) {
    try {
        const collection = await dbService.getCollection('gigs')
        const gig = collection.findOne({ _id: new ObjectId(gigId) })
        return gig
    } catch (err) {
        logger.error(`while finding gig ${gigId}`, err)
        throw err
    }
}

async function remove(gigId) {
    try {
        const collection = await dbService.getCollection('gigs')
        await collection.deleteOne({ _id: new ObjectId(gigId) })
        return gigId
    } catch (err) {
        logger.error(`cannot remove gig ${gigId}`, err)
        throw err
    }
}

async function add(gig) {
    try {
        const collection = await dbService.getCollection('gigs')
        await collection.insertOne(gig)
        return gig
    } catch (err) {
        logger.error('cannot insert gig', err)
        throw err
    }
}

async function update(gig) {
    try {
        const gigToSave = {
            title: gig.title,
            price: gig.price
        }
        const collection = await dbService.getCollection('gigs')
        await collection.updateOne({ _id: new ObjectId(gig._id) }, { $set: gigToSave })
        return gig
    } catch (err) {
        logger.error(`cannot update gig ${gigId}`, err)
        throw err
    }
}

async function addGigReview(gigId, review) {
    try {
        review.id = utilService.makeId()
        const collection = await dbService.getCollection('gigs')
        await collection.updateOne({ _id: new ObjectId(gigId) }, { $push: { reviews: review } })
        return review
    } catch (err) {
        logger.error(`cannot add gig review ${gigId}`, err)
        throw err
    }
}

async function removeGigReview(gigId, reviewId) {
    try {
        const collection = await dbService.getCollection('gigs')
        await collection.updateOne({ _id: new ObjectId(gigId) }, { $pull: { reviews: { id: reviewId } } })
        return reviewId
    } catch (err) {
        logger.error(`cannot add gig review ${gigId}`, err)
        throw err
    }
}

export const gigService = {
    remove,
    query,
    getById,
    add,
    update,
    addGigReview,
    removeGigReview
}
