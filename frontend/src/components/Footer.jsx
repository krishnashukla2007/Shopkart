import { Link } from "react-router-dom";
import { ShoppingBag, Heart, ShoppingCart, ShieldCheck, Sparkles } from "lucide-react";

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div>
                        <Link to="/home" className="navbar-brand" style={{ marginBottom: '0.75rem' }}>
                            <span className="brand-icon">
                                <ShoppingBag size={20} />
                            </span>
                            <span>ShopKart</span>
                        </Link>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '320px', lineHeight: '1.6' }}>
                            Everything you need. One smarter shopping experience. Built with performance and elegance in mind.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                Navigation
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <Link to="/home" style={{ color: 'var(--text-secondary)' }}>Home</Link>
                                <Link to="/products" style={{ color: 'var(--text-secondary)' }}>Explore Products</Link>
                                <Link to="/wishlist" style={{ color: 'var(--text-secondary)' }}>Saved Wishlist</Link>
                                <Link to="/cart" style={{ color: 'var(--text-secondary)' }}>Shopping Cart</Link>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                Account
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <Link to="/login" style={{ color: 'var(--text-secondary)' }}>Customer Login</Link>
                                <Link to="/register" style={{ color: 'var(--text-secondary)' }}>Create Account</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={16} style={{ color: 'var(--primary)' }} />
                        <span>© {new Date().getFullYear()} ShopKart Inc. All rights reserved.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <ShieldCheck size={16} style={{ color: 'var(--success-text)' }} /> Secure SSL Encryption
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
