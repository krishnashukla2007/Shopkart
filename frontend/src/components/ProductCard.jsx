import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { Heart, ShoppingBag, Eye, Check, AlertCircle } from "lucide-react";

function ProductCard({ product, isInWishlist }) {
    const navigate = useNavigate();

    const {
        cartItems,
        addToCart
    } = useCart();

    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
    const [isAddedToWishlist, setIsAddedToWishlist] = useState(isInWishlist);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const cartItem = cartItems.find(function(item) {
        return item.product?._id === product._id;
    });

    const isInCart = !!cartItem;

    const maxStockReached = cartItem &&
        cartItem.quantity >= product.stock;

    const redirect = function(id) {
        try {
            navigate("/products/" + id);
        }
        catch(error) {
            console.log(error);
        }
    };

    const addToWishlist = async function(productId) {
        try {
            setIsAddingToWishlist(true);

            const response = await api.post(
                "/wishlist/" + productId
            );

            setIsAddedToWishlist(true);
            console.log(response.data);
        }
        catch(error) {
            console.log(error);
        }
        finally {
            setIsAddingToWishlist(false);
        }
    };

    const addProductToCart = async function(productId) {
        try {
            setIsAddingToCart(true);

            const result = await addToCart(productId);

            if (!result.success) {
                console.log(result.message);
            }
        }
        catch(error) {
            console.log(error);
        }
        finally {
            setIsAddingToCart(false);
        }
    };

    useEffect(() => {
        setIsAddedToWishlist(isInWishlist);
    }, [isInWishlist]);

    const formattedPrice = typeof product.price === 'number'
        ? `₹${product.price.toLocaleString('en-IN')}`
        : `₹${product.price}`;

    return (
        <div className="product-card">
            <div className="product-card-image-wrapper">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-image"
                    loading="lazy"
                />

                <button
                    onClick={() => addToWishlist(product._id)}
                    disabled={isAddingToWishlist || isAddedToWishlist}
                    className={`wishlist-btn-overlay ${isAddedToWishlist ? 'active' : ''}`}
                    title={isAddedToWishlist ? "Added to Wishlist" : "Add to Wishlist"}
                    aria-label="Wishlist button"
                >
                    <Heart size={18} fill={isAddedToWishlist ? "currentColor" : "none"} />
                </button>
            </div>

            <div className="product-card-body">
                <span className="product-category-tag">{product.category}</span>
                <h3 className="product-card-title">{product.name}</h3>

                <div className="product-card-price-row">
                    <span className="product-card-price">{formattedPrice}</span>
                    <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock > 0 ? (
                            <>
                                <Check size={12} />
                                <span>In stock</span>
                            </>
                        ) : (
                            <>
                                <AlertCircle size={12} />
                                <span>Out of stock</span>
                            </>
                        )}
                    </span>
                </div>

                <div className="product-card-actions">
                    <button
                        onClick={() => redirect(product._id)}
                        className="btn btn-outline btn-sm"
                        title="View Product Details"
                    >
                        <Eye size={15} />
                        <span>View Details</span>
                    </button>

                    <button
                        onClick={() => addProductToCart(product._id)}
                        disabled={
                            isAddingToCart ||
                            product.stock === 0 ||
                            maxStockReached
                        }
                        className={`btn btn-sm ${
                            product.stock === 0 || maxStockReached ? 'btn-outline' : 'btn-primary'
                        }`}
                    >
                        <ShoppingBag size={15} />
                        <span>
                            {
                                isAddingToCart
                                    ? "Adding..."
                                    : product.stock === 0
                                        ? "Out of Stock"
                                        : maxStockReached
                                            ? "Max Stock"
                                            : isInCart
                                                ? "Add Another"
                                                : "Add to Cart"
                            }
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;