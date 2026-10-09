const mongoose = require("mongoose")
const Customer = require("../models/customerModel")
const Product = require("../models/productModel")

const addToWishlist = async (req, res) => {
    try {
        const productId = req.params.productId
        const customerId = req.userId

        if(!mongoose.Types.ObjectId.isValid(productId)) {
            res.status(400).json({
                success: false,
                message: "Invalid product id"
            })

            return
        }

        const product = await Product.findById(productId)

        if(!product) {
            res.status(404).json({
                success: false,
                message: "Product not found"
            })

            return
        }

        const customer = await Customer.findById(customerId)

        if(!customer) {
            res.status(404).json({
                success: false,
                message: "Customer not found"
            })

            return
        }


        if(customer.wishlist.some((item) => {
            return item.toString() === productId
        })) {
            res.status(409).json({                        //409 is conflict
                success: false,
                message: "Product already in wishlist"
            })

            return
        }

    
        customer.wishlist.push(productId)
        await customer.save()

        res.status(200).json({
            success: true,
            message: "Product added to wishlist"
        })
    }
    catch(error) {
        console.log(error)

        res.status(500).json({
            success: false,
            message: "Failed to add product to wishlist"
        })
    }
}

const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.userId).populate({            //populate is for the wishlist field, follow those ObjectId references and fetch the corresponding Product document
            path: "wishlist",                                   
            select: "name price category image stock"           
        })

        if(!customer) {
            res.status(404).json({
                success: false,
                message: "Customer not found"
            })

            return
        }

        res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        })
    }
    catch(error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

const removeFromWishlist = async (req, res) => {
    try {
        const customerId = req.userId
        const productId = req.params.productId

        if(!mongoose.Types.ObjectId.isValid(productId)) {
            res.status(400).json({
                success: false,
                message: "Invalid product id"
            })

            return
        }

        const customer = await Customer.findById(customerId)

        if(!customer) {
            res.status(404).json({
                success: false,
                message: "Customer not found"
            })

            return
        }

        if(!customer.wishlist.some((item) => {
            return item.toString() === productId
        })) {
            res.status(404).json({
                success: false,
                message: "Product not found in wishlist"
            })

            return
        }

        customer.wishlist = customer.wishlist.filter((item) => {
            return item.toString() !== productId
        })

        await customer.save()

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        })
    }
    catch(error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

module.exports = {addToWishlist, getWishlist, removeFromWishlist}