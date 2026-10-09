import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { ShoppingBag, Home, Package, Heart, ShoppingCart, LogOut, User, Menu, X, Receipt } from "lucide-react";

function Navbar() {
    const { totalItems } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const checkAuth = async () => {
            try {
                const response = await api.get("/customers/me");
                if (isMounted) {
                    setCustomer(response.data.customer);
                }
            } catch (error) {
                if (isMounted) {
                    setCustomer(null);
                }
            }
        };
        checkAuth();
        return () => { isMounted = false; };
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await api.post("/customers/logout");
            setCustomer(null);
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    const isActive = (path) => {
        if (location.pathname === path) return true;
        if (path !== '/' && path !== '/home' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/home" className="navbar-brand">
                    <span className="brand-icon">
                        <ShoppingBag size={20} />
                    </span>
                    <span>ShopKart</span>
                </Link>

                <nav className="navbar-links">
                    <Link
                        to="/home"
                        className={`nav-link ${isActive('/home') ? 'active' : ''}`}
                    >
                        <Home size={17} />
                        <span>Home</span>
                    </Link>

                    <Link
                        to="/products"
                        className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                    >
                        <Package size={17} />
                        <span>Products</span>
                    </Link>

                    <Link
                        to="/wishlist"
                        className={`nav-link ${isActive('/wishlist') ? 'active' : ''}`}
                    >
                        <Heart size={17} />
                        <span>Wishlist</span>
                    </Link>

                    <Link
                        to="/cart"
                        className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
                    >
                        <ShoppingCart size={17} />
                        <span>Cart</span>
                        <span className="cart-badge">{totalItems}</span>
                    </Link>

                    <Link
                        to="/orders"
                        className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
                    >
                        <Receipt size={17} />
                        <span>My Orders</span>
                    </Link>
                </nav>

                <div className="nav-user-actions">
                    {customer ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className="user-pill">
                                <User size={15} style={{ color: 'var(--primary)' }} />
                                <span>{customer.fullName.split(' ')[0]}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline btn-sm"
                                title="Logout"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link to="/login" className="btn btn-outline btn-sm">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary btn-sm">
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
                <Link
                    to="/home"
                    className={`nav-link ${isActive('/home') ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                >
                    <Home size={18} />
                    <span>Home</span>
                </Link>

                <Link
                    to="/products"
                    className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                >
                    <Package size={18} />
                    <span>Products</span>
                </Link>

                <Link
                    to="/wishlist"
                    className={`nav-link ${isActive('/wishlist') ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                >
                    <Heart size={18} />
                    <span>Wishlist</span>
                </Link>

                <Link
                    to="/cart"
                    className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                >
                    <ShoppingCart size={18} />
                    <span>Cart ({totalItems})</span>
                </Link>

                <Link
                    to="/orders"
                    className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                >
                    <Receipt size={18} />
                    <span>My Orders</span>
                </Link>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    {customer ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="user-pill" style={{ justifyContent: 'center' }}>
                                <User size={16} />
                                <span>{customer.fullName}</span>
                            </div>
                            <button
                                onClick={() => {
                                    setMobileOpen(false);
                                    handleLogout();
                                }}
                                className="btn btn-danger"
                                style={{ width: '100%' }}
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Link
                                to="/login"
                                className="btn btn-outline"
                                style={{ flex: 1 }}
                                onClick={() => setMobileOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={() => setMobileOpen(false)}
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;