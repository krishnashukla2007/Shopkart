import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShoppingBag, ArrowRight, ShieldCheck, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"

function Cart() {
    const {
        cartItems,
        isLoading,
        isError,
        totalItems,
        subtotal,
        fetchCart
    } = useCart();

    const [checkoutMessage, setCheckoutMessage] = useState(false);
    const navigate = useNavigate()

    const formattedSubtotal = typeof subtotal === 'number'
        ? `₹${subtotal.toLocaleString('en-IN')}`
        : `₹${subtotal}`;

    return (
        <div className="app-container">
            <Navbar />

            <main className="main-content">
                <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 className="page-title">Shopping Cart</h1>
                        <p className="page-subtitle">Review your selected items before checkout.</p>
                    </div>
                    {cartItems.length > 0 && (
                        <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.9rem' }}>
                            {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="cart-layout">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[1, 2].map((i) => (
                                <div key={i} className="skeleton" style={{ height: '110px', borderRadius: 'var(--radius-lg)' }} />
                            ))}
                        </div>
                        <div className="skeleton" style={{ height: '280px', borderRadius: 'var(--radius-xl)' }} />
                    </div>
                ) : isError ? (
                    <div className="error-state">
                        <div className="state-icon-circle" style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)' }}>
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="state-title">Failed to fetch cart</h2>
                        <p className="state-desc">We couldn't retrieve your cart items right now.</p>
                        <button onClick={fetchCart} className="btn btn-primary">
                            <RefreshCw size={16} />
                            <span>Try Again</span>
                        </button>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="empty-state">
                        <div className="state-icon-circle">
                            <ShoppingBag size={36} />
                        </div>
                        <h2 className="state-title">Your cart is empty</h2>
                        <p className="state-desc">Looks like you haven't added anything yet.</p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            <ShoppingBag size={18} />
                            <span>Browse Products</span>
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        {/* Cart Items List */}
                        <div className="cart-items-container">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.product._id}
                                    item={item}
                                />
                            ))}
                        </div>

                        {/* Order Summary Sidebar */}
                        <aside className="order-summary-card">
                            <h2 className="summary-title">Order Summary</h2>

                            <div className="summary-row">
                                <span>Total Items</span>
                                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{totalItems}</span>
                            </div>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formattedSubtotal}</span>
                            </div>

                            <div className="summary-row">
                                <span>Estimated Shipping</span>
                                <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>Free</span>
                            </div>

                            <div className="summary-row total">
                                <span>Total</span>
                                <span style={{ color: 'var(--primary)' }}>{formattedSubtotal}</span>
                            </div>

                            {checkoutMessage && (
                                <div className="alert-box" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', borderColor: 'var(--success-border)', marginTop: '1rem' }}>
                                    <CheckCircle size={18} />
                                    <span>Checkout initiated! Mock payment order created.</span>
                                </div>
                            )}

                            <button
                                onClick={() => navigate("/checkout")}
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', marginTop: '1.25rem' }}
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight size={18} />
                            </button>

                            <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                <ShieldCheck size={15} style={{ color: 'var(--success-text)' }} />
                                <span>Guaranteed Safe & Secure Checkout</span>
                            </div>
                        </aside>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Cart;