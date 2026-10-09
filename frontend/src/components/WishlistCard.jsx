import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Eye, Trash2, ShoppingBag, Check, AlertCircle } from "lucide-react";

function WishlistCard({ product, onRemove, isRemoving }) {
    const navigate = useNavigate();
    const { cartItems, addToCart } = useCart();
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const cartItem = cartItems.find((item) => item.product?._id === product._id);
    const isInCart = !!cartItem;
    const maxStockReached = cartItem && cartItem.quantity >= product.stock;

    const redirect = function(id) {
        try {
            navigate("/products/" + id);
        }
        catch(error) {
            console.log(error);
        }
    };

    const handleAddToCart = async () => {
        try {
            setIsAddingToCart(true);
            await addToCart(product._id);
        } catch (error) {
            console.log(error);
        } finally {
            setIsAddingToCart(false);
        }
    };

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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="product-card-actions">
                        <button
                            onClick={() => redirect(product._id)}
                            className="btn btn-outline btn-sm"
                        >
                            <Eye size={15} />
                            <span>Details</span>
                        </button>

                        <button
                            onClick={handleAddToCart}
                            disabled={isAddingToCart || product.stock === 0 || maxStockReached}
                            className="btn btn-primary btn-sm"
                        >
                            <ShoppingBag size={15} />
                            <span>
                                {isAddingToCart
                                    ? "Adding..."
                                    : product.stock === 0
                                        ? "Out of Stock"
                                        : maxStockReached
                                            ? "Max Stock"
                                            : isInCart
                                                ? "Add Another"
                                                : "Add to Cart"}
                            </span>
                        </button>
                    </div>

                    <button
                        onClick={() => onRemove(product._id)}
                        disabled={isRemoving}
                        className="btn btn-danger btn-sm"
                        style={{ width: '100%' }}
                    >
                        <Trash2 size={15} />
                        <span>{isRemoving ? "Removing..." : "Remove from Wishlist"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WishlistCard;