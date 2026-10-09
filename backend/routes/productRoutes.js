const express = require("express")
const {products, getProducts, getProduct} = require("../controllers/productController")

const router = express.Router()

router.post("/", products)
router.get("/", getProducts)
router.get("/:id", getProduct)

module.exports = router