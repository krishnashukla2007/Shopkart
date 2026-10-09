const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")

const {
    createPaymentOrder,
    verifyPayment,
    getOrders,
    getOrder
} = require("../controllers/orderController")

const router = express.Router()

router.post(
    "/create-payment-order",
    authMiddleware,
    createPaymentOrder
)

router.post(
    "/verify-payment",
    authMiddleware,
    verifyPayment
)

router.get(
    "/",
    authMiddleware,
    getOrders
)

router.get(
    "/:id",
    authMiddleware,
    getOrder
)

module.exports = router