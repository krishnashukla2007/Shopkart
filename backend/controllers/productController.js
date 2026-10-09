const mongoose = require("mongoose")
const Product = require("../models/productModel")

const products = async (req, res) => {
    try {
        const {name, description, price, category, image, stock} = req.body

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock
        })

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: {
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                image: product.image,
                stock: product.stock
            }
        })

    }
    catch(error) {
        console.log(error)
        if(error.name === "ValidationError") {
            res.status(400).json({
                success: false,
                message: "Product data invalid"
            })
        }
        else {
            res.status(500).json({
                success: false,
                message: "Server error"
            })
        }
    }
}


const getProducts = async (req, res) => {
    try {
        const {search, category} = req.query

        const filter = {}
        if(search) {
            filter.name = {
                $regex: search,       //find anywhere inside the text dont look for an exact match
                $options: "i"        //makes the search case insensitive
            }
        }

        if(category) {
            filter.category = category
        }

        const products = await Product.find(filter)

        res.status(200).json({
            success: true,
            count: products.length,
            products: products
        })
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch the products"
        })
    }
}


const getProduct = async (req, res) => {
    try{
        const id = req.params.id
        
        if(!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Id does not exist"
            })
            return
        }

        const product = await Product.findById(id)


        if(!product) {
            res.status(404).json({
                success: false,
                message: "Product not found"
            })
            return 
        }
        
        res.status(200).json({
            success: true,
            product: product
        })
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch the product"
        })
    }
}

module.exports = {products, getProducts, getProduct}