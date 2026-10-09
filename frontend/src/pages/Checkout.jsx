import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShoppingBag, MapPin, User, Phone, Building, ShieldCheck, AlertCircle, ArrowRight, CreditCard, Lock } from "lucide-react";

function Checkout() {
    const navigate = useNavigate();

    const {
        cartItems,
        subtotal,
        totalItems,
        clearCart
    } = useCart();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [errors, setErrors] = useState({});
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [paymentError, setPaymentError] = useState("");

    const handleChange = function(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const validateForm = function() {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        }
        else if (!/^\d{10}$/.test(formData.phone.trim())) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        }

        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = "Address is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
        }
        else if (!/^\d{6}$/.test(formData.pincode.trim())) {
            newErrors.pincode = "Enter a valid 6-digit pincode";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async function(event) {
        event.preventDefault();

        setPaymentError("");

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        try {
            setIsPlacingOrder(true);

            const response = await api.post(
                "/orders/create-payment-order",
                {
                    shippingAddress: formData
                }
            );

            const orderData = response.data;

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "ShopKart",
                description: "ShopKart Purchase",
                order_id: orderData.razorpayOrderId,

                handler: async function(paymentResponse) {
                    try {
                        const verifyResponse = await api.post(
                            "/orders/verify-payment",
                            {
                                shopKartOrderId: orderData.shopKartOrderId,
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature
                            }
                        );

                        console.log(verifyResponse.data);

                        // Clear frontend cart
                        clearCart();

                        // Go to order details
                        navigate("/orders/" + orderData.shopKartOrderId);
                    }
                    catch (error) {
                        console.log(error);

                        setPaymentError(
                            error.response?.data?.message ||
                            "Payment verification failed"
                        );
                    }
                },

                prefill: {
                    name: formData.fullName,
                    contact: formData.phone
                },

                theme: {
                    color: "#4f46e5"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        }
        catch (error) {
            console.log(error);

            setPaymentError(
                error.response?.data?.message ||
                "Failed to create payment order"
            );
        }
        finally {
            setIsPlacingOrder(false);
        }
    };

    const formattedSubtotal = typeof subtotal === 'number'
        ? `₹${subtotal.toLocaleString('en-IN')}`
        : `₹${subtotal}`;

    if (cartItems.length === 0) {
        return (
            <div className="app-container">
                <Navbar />

                <main className="main-content">
                    <div className="empty-state">
                        <div className="state-icon-circle">
                            <ShoppingBag size={36} />
                        </div>
                        <h2 className="state-title">Your Cart is Empty</h2>
                        <p className="state-desc">You need items in your cart before proceeding to checkout.</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="btn btn-primary btn-lg"
                        >
                            <span>Continue Shopping</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="app-container">
            <Navbar />

            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Checkout</h1>
                    <p className="page-subtitle">Enter your shipping details to complete your order.</p>
                </div>

                <form onSubmit={handleSubmit} className="checkout-layout">
                    {/* Left Column: Shipping Address Form */}
                    <div className="checkout-card">
                        <h2 className="checkout-card-header">
                            <MapPin size={20} style={{ color: 'var(--primary)' }} />
                            <span>Shipping Address</span>
                        </h2>

                        <div className="form-group">
                            <label className="form-label" htmlFor="fullName">Full Name</label>
                            <div className="input-wrapper">
                                <User size={18} className="input-icon" />
                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    className={`input-field ${errors.fullName ? 'input-error' : ''}`}
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.fullName && (
                                <p className="field-error">
                                    <AlertCircle size={14} />
                                    <span>{errors.fullName}</span>
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">Phone Number</label>
                            <div className="input-wrapper">
                                <Phone size={18} className="input-icon" />
                                <input
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    className={`input-field ${errors.phone ? 'input-error' : ''}`}
                                    placeholder="10-digit Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.phone && (
                                <p className="field-error">
                                    <AlertCircle size={14} />
                                    <span>{errors.phone}</span>
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="addressLine1">Street Address</label>
                            <div className="input-wrapper">
                                <Building size={18} className="input-icon" />
                                <input
                                    id="addressLine1"
                                    type="text"
                                    name="addressLine1"
                                    className={`input-field ${errors.addressLine1 ? 'input-error' : ''}`}
                                    placeholder="Flat, House no., Building, Street"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.addressLine1 && (
                                <p className="field-error">
                                    <AlertCircle size={14} />
                                    <span>{errors.addressLine1}</span>
                                </p>
                            )}
                        </div>

                        <div className="checkout-form-grid">
                            <div className="form-group">
                                <label className="form-label" htmlFor="city">City</label>
                                <input
                                    id="city"
                                    type="text"
                                    name="city"
                                    className={`input-field ${errors.city ? 'input-error' : ''}`}
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                                {errors.city && (
                                    <p className="field-error">
                                        <AlertCircle size={14} />
                                        <span>{errors.city}</span>
                                    </p>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="state">State</label>
                                <input
                                    id="state"
                                    type="text"
                                    name="state"
                                    className={`input-field ${errors.state ? 'input-error' : ''}`}
                                    placeholder="State"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                                {errors.state && (
                                    <p className="field-error">
                                        <AlertCircle size={14} />
                                        <span>{errors.state}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" htmlFor="pincode">Pincode</label>
                            <input
                                id="pincode"
                                type="text"
                                name="pincode"
                                className={`input-field ${errors.pincode ? 'input-error' : ''}`}
                                placeholder="6-digit Pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                            />
                            {errors.pincode && (
                                <p className="field-error">
                                    <AlertCircle size={14} />
                                    <span>{errors.pincode}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Review */}
                    <aside className="order-summary-card">
                        <h2 className="summary-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Order Review</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                {totalItems} {totalItems === 1 ? 'item' : 'items'}
                            </span>
                        </h2>

                        <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
                            {cartItems.map(function(item) {
                                return (
                                    <div key={item.product._id} className="checkout-item-row">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="checkout-item-thumb"
                                        />

                                        <div>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.3' }}>
                                                {item.product.name}
                                            </p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                ₹{item.product.price} × {item.quantity}
                                            </p>
                                        </div>

                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formattedSubtotal}</span>
                        </div>

                        <div className="summary-row">
                            <span>Shipping Fee</span>
                            <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>Free</span>
                        </div>

                        <div className="summary-row total">
                            <span>Total Amount</span>
                            <span style={{ color: 'var(--primary)' }}>{formattedSubtotal}</span>
                        </div>

                        {paymentError && (
                            <div className="alert-box error" style={{ marginTop: '1rem', marginBottom: 0 }}>
                                <AlertCircle size={18} />
                                <span>{paymentError}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPlacingOrder}
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: '1.25rem' }}
                        >
                            <CreditCard size={18} />
                            <span>
                                {isPlacingOrder ? "Creating Order..." : "Place Order"}
                            </span>
                        </button>

                        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                            <ShieldCheck size={15} style={{ color: 'var(--success-text)' }} />
                            <span>Encrypted & Secured by Razorpay</span>
                        </div>
                    </aside>
                </form>
            </main>

            <Footer />
        </div>
    );
}

export default Checkout;