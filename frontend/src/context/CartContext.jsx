import { createContext, useContext, useEffect, useState } from "react"
import api from "../services/api"

const CartContext = createContext()

function CartProvider({ children }) {

    const [cartItems, setCartItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const fetchCart = async function() {
        try {
            setIsLoading(true)
            setIsError(false)

            const response = await api.get("/cart")

            setCartItems(response.data.cart)
        }
        catch (error) {
            console.log(error)
            setIsError(true)
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const addToCart = async function(productId) {
        try {
            const response = await api.post(
                "/cart/" + productId
            )

            setCartItems(response.data.cart)

            return {
                success: true
            }
        }
        catch (error) {
            console.log(error)

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to add product to cart"
            }
        }
    }

    const updateQuantity = async function(productId, quantity) {
        try {
            const response = await api.patch(
                "/cart/" + productId,
                {
                    quantity: quantity
                }
            )

            setCartItems(response.data.cart)

            return {
                success: true
            }
        }
        catch (error) {
            console.log(error)

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to update quantity"
            }
        }
    }

    const removeFromCart = async function(productId) {
        try {
            const response = await api.delete(
                "/cart/" + productId
            )

            setCartItems(response.data.cart)

            return {
                success: true
            }
        }
        catch (error) {
            console.log(error)

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to remove product"
            }
        }
    }

    const clearCart = function() {
        setCartItems([])
    }

    const totalItems = cartItems.reduce(function(total, item) {
        return total + item.quantity
    }, 0)

    const subtotal = cartItems.reduce(function(total, item) {

        if (!item.product) {
            return total
        }

        return total +
            item.product.price * item.quantity

    }, 0)

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isLoading,
                isError,
                totalItems,
                subtotal,
                addToCart,
                updateQuantity,
                removeFromCart,
                fetchCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

function useCart() {
    return useContext(CartContext)
}

export { CartProvider, useCart }