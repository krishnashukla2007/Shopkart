const crypto = require("crypto")
const mongoose = require("mongoose")

const Customer = require("../models/customerModel")
const Product = require("../models/productModel")
const Order = require("../models/orderModel")
const razorpay = require("../config/razorpay")


const createPaymentOrder = async (req, res) => {
    try {
        const customerId = req.userId
        const { shippingAddress } = req.body

        // Validate shipping address
        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required"
            })
        }

        const {
            fullName,
            phone,
            addressLine1,
            city,
            state,
            pincode
        } = shippingAddress

        if (
            !fullName?.trim() ||
            !phone?.trim() ||
            !addressLine1?.trim() ||
            !city?.trim() ||
            !state?.trim() ||
            !pincode?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "All shipping fields are required"
            })
        }

        if (!/^\d{10}$/.test(phone.trim())) {
            return res.status(400).json({
                success: false,
                message: "Phone must contain 10 digits"
            })
        }

        if (!/^\d{6}$/.test(pincode.trim())) {
            return res.status(400).json({
                success: false,
                message: "Pincode must contain 6 digits"
            })
        }

        // Find customer
        const customer = await Customer.findById(customerId)

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            })
        }

        // Cart cannot be empty
        if (!customer.cart || customer.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            })
        }

        const orderItems = []
        let totalAmount = 0

        // Load latest product information
        for (const cartItem of customer.cart) {

            const productId = cartItem.product

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product in cart"
                })
            }

            const product = await Product.findById(productId)

            // Product may have been deleted after being added to cart
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "A product in your cart no longer exists"
                })
            }

            // Final stock verification
            if (cartItem.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                })
            }

            // Snapshot product information
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
            })

            // Server-side total
            totalAmount += product.price * cartItem.quantity
        }

        // Create ShopKart order
        const shopKartOrder = await Order.create({
            user: customerId,

            items: orderItems,

            shippingAddress: {
                fullName: fullName.trim(),
                phone: phone.trim(),
                addressLine1: addressLine1.trim(),
                city: city.trim(),
                state: state.trim(),
                pincode: pincode.trim()
            },

            totalAmount: totalAmount,

            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT"
        })

        try {
            // Razorpay expects INR in paise
            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: shopKartOrder._id.toString()
            })

            shopKartOrder.razorpayOrderId = razorpayOrder.id

            await shopKartOrder.save()

            return res.status(201).json({
                success: true,
                shopKartOrderId: shopKartOrder._id,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID
            })
        }
        catch (razorpayError) {
            console.log(razorpayError)

            // Do not leave an unusable pending ShopKart order
            await Order.findByIdAndDelete(shopKartOrder._id)

            return res.status(500).json({
                success: false,
                message: "Failed to create payment order"
            })
        }
    }
    catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Failed to create order"
        })
    }
}


const verifyPayment = async (req, res) => {
    try {
        const {
            shopKartOrderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body

        if (
            !shopKartOrderId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification data is incomplete"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ShopKart order id"
            })
        }

        // Find the order belonging to the logged-in customer
        const order = await Order.findOne({
            _id: shopKartOrderId,
            user: req.userId
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        // Prevent changing an already paid order
        if (order.paymentStatus === "PAID") {
            return res.status(200).json({
                success: true,
                message: "Payment already verified",
                order
            })
        }

        // The Razorpay order ID stored in our database is trusted
        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Razorpay order does not match"
            })
        }

        // Build signature payload
        const body =
            order.razorpayOrderId +
            "|" +
            razorpay_payment_id

        // Generate expected signature
        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex")

        // Compare signatures
        if (expectedSignature !== razorpay_signature) {
            order.paymentStatus = "FAILED"

            await order.save()

            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            })
        }

        // Payment successfully verified
        order.paymentStatus = "PAID"
        order.status = "PLACED"
        order.razorpayPaymentId = razorpay_payment_id

        await order.save()

        // Clear cart only after successful verification
        const customer = await Customer.findById(req.userId)

        if (customer) {
            customer.cart = []
            await customer.save()
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified and order placed",
            order
        })
    }
    catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        })
    }
}


const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.userId
        })
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            orders
        })
    }
    catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        })
    }
}


const getOrder = async (req, res) => {
    try {
        const orderId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order id"
            })
        }

        const order = await Order.findOne({
            _id: orderId,
            user: req.userId
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        return res.status(200).json({
            success: true,
            order
        })
    }
    catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Failed to fetch order"
        })
    }
}


module.exports = {
    createPaymentOrder,
    verifyPayment,
    getOrders,
    getOrder
}