const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const {addToWishlist, getWishlist, removeFromWishlist} = require('../controllers/wishlistController')

const router = express.Router()

router.post('/:productId', authMiddleware, addToWishlist)
router.get('/', authMiddleware, getWishlist)
router.delete('/:productId', authMiddleware, removeFromWishlist)

module.exports = router