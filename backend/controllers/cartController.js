const mongoose = require("mongoose")
const Customer = require("../models/customerModel")
const Product = require("../models/productModel")

const addToCart = async (req, res) => {
    try {
        const productId = req.params.productId
        const customerId = req.userId

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id"
            })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const customer = await Customer.findById(customerId)

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            })
        }

        const cartItem = customer.cart.find((item) => {
            return item.product.toString() === productId
        })

        if (cartItem) {
            if (cartItem.quantity + 1 > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Requested quantity exceeds stock"
                })
            }

            cartItem.quantity += 1
        }
        else {
            if (product.stock < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Product is out of stock"
                })
            }

            customer.cart.push({
                product: productId,
                quantity: 1
            })
        }

        await customer.save()

        const updatedCustomer = await Customer.findById(customerId)
            .populate({
                path: "cart.product",
                select: "name price image category stock"
            })

        res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: updatedCustomer.cart
        })
    }
    catch (error) {
        console.log(error)

        res.status(500).json({
            success: false,
            message: "Failed to update cart"
        })
    }
}


const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.userId)
            .populate({
                path: "cart.product",
                select: "name price image category stock"
            })

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            })
        }

        res.status(200).json({
            success: true,
            cart: customer.cart
        })
    }
    catch (error) {
        console.log(error)

        res.status(500).json({
            success: false,
            message: "Failed to fetch cart"
        })
    }
}


const updateCartQuantity = async (req, res) => {
    try {
        const productId = req.params.productId
        const customerId = req.userId
        const quantity = req.body.quantity

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id"
            })
        }

        if (typeof quantity !== "number" || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity exceeds stock"
            })
        }

        const customer = await Customer.findById(customerId)

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            })
        }

        const cartItem = customer.cart.find((item) => {
            return item.product.toString() === productId
        })

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            })
        }

        cartItem.quantity = quantity

        await customer.save()

        const updatedCustomer = await Customer.findById(customerId)
            .populate({
                path: "cart.product",
                select: "name price image category stock"
            })

        res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: updatedCustomer.cart
        })
    }
    catch (error) {
        console.log(error)

        res.status(500).json({
            success: false,
            message: "Failed to update cart quantity"
        })
    }
}


const removeFromCart = async (req, res) => {
    try {
        const productId = req.params.productId
        const customerId = req.userId

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id"
            })
        }

        const customer = await Customer.findById(customerId)

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            })
        }

        const cartItemExists = customer.cart.some((item) => {
            return item.product.toString() === productId
        })

        if (!cartItemExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            })
        }

        customer.cart = customer.cart.filter((item) => {
            return item.product.toString() !== productId
        })

        await customer.save()

        const updatedCustomer = await Customer.findById(customerId)
            .populate({
                path: "cart.product",
                select: "name price image category stock"
            })

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: updatedCustomer.cart
        })
    }
    catch (error) {
        console.log(error)

        res.status(500).json({
            success: false,
            message: "Failed to remove product from cart"
        })
    }
}


module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart
}