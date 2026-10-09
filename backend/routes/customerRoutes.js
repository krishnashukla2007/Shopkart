const express = require("express");
const {registerCustomer, loginCustomer, getCurrentCustomer, logoutCustomer} = require("../controllers/customerController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.get("/me", authMiddleware, getCurrentCustomer)
router.post("/logout", logoutCustomer);

module.exports = router;