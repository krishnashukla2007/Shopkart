import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle2, Package, MapPin, ShoppingBag, ArrowRight, Clock, XCircle, Truck, AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchOrder = async function() {
            try {
                setIsLoading(true);
                setIsError(false);
                const response = await api.get("/orders/" + id);
                setOrder(response.data.order);
            }
            catch (error) {
                console.log(error);
                setIsError(true);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const renderPaymentBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'PAID':
                return (
                    <span className="status-pill badge-paid">
                        <CheckCircle2 size={13} />
                        <span>PAID</span>
                    </span>
                );
            case 'PENDING':
                return (
                    <span className="status-pill badge-pending">
                        <Clock size={13} />
                        <span>PENDING</span>
                    </span>
                );
            case 'FAILED':
                return (
                    <span className="status-pill badge-failed">
                        <XCircle size={13} />
                        <span>FAILED</span>
                    </span>
                );
            default:
                return (
                    <span className="status-pill badge-pending">
                        <span>{status}</span>
                    </span>
                );
        }
    };

    const renderOrderBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'PLACED':
                return (
                    <span className="status-pill badge-placed">
                        <Package size={13} />
                        <span>PLACED</span>
                    </span>
                );
            case 'CONFIRMED':
                return (
                    <span className="status-pill badge-confirmed">
                        <CheckCircle2 size={13} />
                        <span>CONFIRMED</span>
                    </span>
                );
            case 'SHIPPED':
                return (
                    <span className="status-pill badge-shipped">
                        <Truck size={13} />
                        <span>SHIPPED</span>
                    </span>
                );
            case 'DELIVERED':
                return (
                    <span className="status-pill badge-delivered">
                        <CheckCircle2 size={13} />
                        <span>DELIVERED</span>
                    </span>
                );
            default:
                return (
                    <span className="status-pill badge-placed">
                        <span>{status}</span>
                    </span>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="app-container">
                <Navbar />

                <main className="main-content">
                    <div className="skeleton" style={{ height: '180px', borderRadius: 'var(--radius-xl)', marginBottom: '2rem' }} />
                    <div className="order-details-grid">
                        <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-xl)' }} />
                        <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-xl)' }} />
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="app-container">
                <Navbar />

                <main className="main-content">
                    <div className="error-state">
                        <div className="state-icon-circle" style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)' }}>
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="state-title">Unable to find this order</h2>
                        <p className="state-desc">The requested order details could not be found or retrieved.</p>
                        <button
                            onClick={() => navigate("/orders")}
                            className="btn btn-primary"
                        >
                            <span>View My Orders</span>
                        </button>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    const formattedTotal = typeof order.totalAmount === 'number'
        ? `₹${order.totalAmount.toLocaleString('en-IN')}`
        : `₹${order.totalAmount}`;

    return (
        <div className="app-container">
            <Navbar />

            <main className="main-content">
                {/* Success Hero Header */}
                <div className="order-details-hero">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '999px', backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle2 size={32} />
                        </div>

                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                                Order Placed Successfully!
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Thank you for shopping with ShopKart. Your order has been confirmed.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            Order ID: <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{order._id}</span>
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Payment:</span>
                            {renderPaymentBadge(order.paymentStatus)}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
                            {renderOrderBadge(order.status)}
                        </div>
                    </div>
                </div>

                <div className="order-details-grid">
                    {/* Left Column: Items */}
                    <div>
                        <h2 className="section-title" style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
                            Purchased Items ({order.items.length})
                        </h2>

                        <div>
                            {order.items.map(function(item) {
                                const itemTotal = item.price * item.quantity;

                                return (
                                    <div key={item._id} className="order-item-row">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="order-item-row-img"
                                        />

                                        <div>
                                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                                {item.name}
                                            </h3>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                Price: ₹{item.price?.toLocaleString('en-IN')} &nbsp;•&nbsp; Quantity: {item.quantity}
                                            </p>
                                        </div>

                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Item Total</p>
                                            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                                ₹{itemTotal.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Shipping & Summary Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Shipping Address Card */}
                        <div className="checkout-card">
                            <h2 className="checkout-card-header">
                                <MapPin size={20} style={{ color: 'var(--primary)' }} />
                                <span>Shipping Address</span>
                            </h2>

                            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                                    {order.shippingAddress.fullName}
                                </p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                <p style={{ marginTop: '0.4rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                                    Phone: {order.shippingAddress.phone}
                                </p>
                            </div>
                        </div>

                        {/* Order Summary Card */}
                        <aside className="order-summary-card">
                            <h2 className="summary-title">Order Summary</h2>

                            <div className="summary-row">
                                <span>Total Amount</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                                    {formattedTotal}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button
                                    onClick={() => navigate("/orders")}
                                    className="btn btn-primary btn-lg"
                                    style={{ width: '100%' }}
                                >
                                    <span>View My Orders</span>
                                </button>

                                <button
                                    onClick={() => navigate("/products")}
                                    className="btn btn-outline btn-lg"
                                    style={{ width: '100%' }}
                                >
                                    <span>Continue Shopping</span>
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default OrderDetails;