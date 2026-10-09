import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";

function CartItem({ item }) {
    const {
        updateQuantity,
        removeFromCart
    } = useCart();

    const [isUpdating, setIsUpdating] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const product = item.product;

    const increaseQuantity = async function() {
        if (item.quantity >= product.stock) {
            return;
        }

        setIsUpdating(true);

        await updateQuantity(
            product._id,
            item.quantity + 1
        );

        setIsUpdating(false);
    };

    const decreaseQuantity = async function() {
        if (item.quantity <= 1) {
            return;
        }

        setIsUpdating(true);

        await updateQuantity(
            product._id,
            item.quantity - 1
        );

        setIsUpdating(false);
    };

    const removeItem = async function() {
        setIsRemoving(true);

        await removeFromCart(product._id);

        setIsRemoving(false);
    };

    const itemTotal = product.price * item.quantity;
    const formattedPrice = typeof product.price === 'number'
        ? `₹${product.price.toLocaleString('en-IN')}`
        : `₹${product.price}`;
    const formattedTotal = `₹${itemTotal.toLocaleString('en-IN')}`;

    return (
        <div className="cart-item-card">
            <img
                src={product.image}
                alt={product.name}
                className="cart-item-image"
            />

            <div className="cart-item-info">
                <span className="product-category-tag">{product.category}</span>
                <h3 className="cart-item-title">{product.name}</h3>
                <p className="cart-item-price">
                    Unit Price: {formattedPrice}
                </p>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Item Total: {formattedTotal}
                </p>
            </div>

            <div className="cart-item-controls">
                <div className="qty-picker">
                    <button
                        onClick={decreaseQuantity}
                        disabled={isUpdating || item.quantity <= 1}
                        className="qty-btn"
                        aria-label="Decrease quantity"
                    >
                        <Minus size={14} />
                    </button>

                    <span className="qty-val">
                        {item.quantity}
                    </span>

                    <button
                        onClick={increaseQuantity}
                        disabled={isUpdating || item.quantity >= product.stock}
                        className="qty-btn"
                        aria-label="Increase quantity"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                <button
                    onClick={removeItem}
                    disabled={isRemoving}
                    className="btn btn-danger btn-sm"
                    style={{ gap: '0.35rem' }}
                >
                    <Trash2 size={14} />
                    <span>{isRemoving ? "Removing..." : "Remove"}</span>
                </button>
            </div>
        </div>
    );
}

export default CartItem;