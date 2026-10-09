import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SkeletonCard } from "../components/SkeletonCard";
import { Package, Calendar, CreditCard, ArrowRight, CheckCircle2, Clock, XCircle, Truck, AlertCircle, RefreshCw, Eye } from "lucide-react";

function Orders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const fetchOrders = async function() {
        try {
            setIsLoading(true);
            setIsError(false);
            const response = await api.get("/orders");
            setOrders(response.data.orders || []);
        }
        catch (error) {
            console.log(error);
            setIsError(true);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

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

    return (
        <div className="app-container">
            <Navbar />

            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">My Orders</h1>
                    <p className="page-subtitle">Track and manage your recent purchase history.</p>
                </div>

                {isLoading ? (
                    <div className="orders-container">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-xl)' }} />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="error-state">
                        <div className="state-icon-circle" style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)' }}>
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="state-title">Failed to load orders</h2>
                        <p className="state-desc">We couldn't fetch your order history right now. Please try again.</p>
                        <button onClick={() => window.location.reload()} className="btn btn-primary">
                            <RefreshCw size={16} />
                            <span>Try Again</span>
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="state-icon-circle">
                            <Package size={36} />
                        </div>
                        <h2 className="state-title">You haven't placed any orders yet.</h2>
                        <p className="state-desc">Explore our catalog and find products tailored for you.</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="btn btn-primary btn-lg"
                        >
                            <span>Start Shopping</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="orders-container">
                        {orders.map(function(order) {
                            const totalItems = order.items.reduce(
                                function(total, item) {
                                    return total + item.quantity;
                                },
                                0
                            );

                            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            });

                            return (
                                <div key={order._id} className="order-dashboard-card">
                                    <div className="order-card-header">
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                                <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                                                    Order #{order._id}
                                                </h2>
                                                {renderPaymentBadge(order.paymentStatus)}
                                                {renderOrderBadge(order.status)}
                                            </div>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <Calendar size={14} />
                                                <span>Placed on {formattedDate}</span>
                                            </p>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                    Total Amount
                                                </p>
                                                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                                                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="order-card-body">
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{totalItems}</span> {totalItems === 1 ? 'item' : 'items'} in this order
                                        </p>

                                        <button
                                            onClick={() => navigate("/orders/" + order._id)}
                                            className="btn btn-outline btn-sm"
                                        >
                                            <Eye size={15} />
                                            <span>View Order</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Orders;