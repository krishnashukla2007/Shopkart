import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import { Sparkles, ArrowRight, ShoppingBag, Heart, ShieldCheck, Zap, Laptop, Shirt, Book, Grid, Smile } from "lucide-react";

function Home() {
    const [customer, setCustomer] = useState(null);
    const [products, setProducts] = useState([]);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getCustomer = async function () {
            try {
                const response = await api.get("/customers/me");
                setCustomer(response.data.customer);
            }
            catch (error) {
                // If not logged in, user can still view the landing page!
                setCustomer(null);
            }
        };

        getCustomer();
    }, []);

    useEffect(() => {
        async function fetchFeaturedData() {
            try {
                setIsLoading(true);
                const response = await api.get("/products");
                setProducts(response.data.products || []);

                try {
                    const wishlistRes = await api.get("/wishlist");
                    setWishlistIds((wishlistRes.data.wishlist || []).map((p) => p._id));
                } catch (e) {
                    // ignore wishlist fetch error if guest
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchFeaturedData();
    }, []);

    // Extract unique categories from actual product data
    const categories = Array.from(
        new Set(products.map((p) => p.category).filter(Boolean))
    );

    // Map category name to icon
    const getCategoryIcon = (cat) => {
        const lower = cat.toLowerCase();
        if (lower.includes("electronics")) return <Laptop size={24} />;
        if (lower.includes("clothing") || lower.includes("fashion")) return <Shirt size={24} />;
        if (lower.includes("book")) return <Book size={24} />;
        return <Grid size={24} />;
    };

    return (
        <div className="app-container">
            <Navbar />

            <main className="main-content">
                {/* Hero Section */}
                <section className="hero-section">
                    <div>
                        <div className="hero-pill">
                            <Sparkles size={16} />
                            <span>Smarter Shopping Experience</span>
                        </div>

                        {customer && (
                            <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                                Welcome back, {customer.fullName}! 👋
                            </p>
                        )}

                        <h1 className="hero-title">
                            ShopKart<span>.</span>
                        </h1>

                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                            Everything you need. One smarter shopping experience.
                        </p>

                        <p className="hero-subtitle">
                            Discover products you'll love, save your favorites and manage your shopping effortlessly.
                        </p>

                        <div className="hero-actions">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                <span>Explore Products</span>
                                <ArrowRight size={18} />
                            </Link>

                            <Link to="/wishlist" className="btn btn-outline btn-lg">
                                <Heart size={18} />
                                <span>View Wishlist</span>
                            </Link>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-visual-card">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em' }}>
                                    Featured Collection
                                </span>
                                <span className="stock-badge in-stock">Live Inventory</span>
                            </div>

                            {products.length > 0 ? (
                                <div>
                                    <div style={{ aspectRatio: '16/9', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                                        <img
                                            src={products[0].image}
                                            alt={products[0].name}
                                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{products[0].name}</h4>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                                        ₹{products[0].price?.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            ) : (
                                <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <ShoppingBag size={48} style={{ margin: '0 auto 1rem auto' }} />
                                    <p>Loading catalog preview...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Featured Categories Section */}
                {categories.length > 0 && (
                    <section style={{ marginBottom: '4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 className="section-title">Browse Categories</h2>
                                <p className="section-subtitle">Curated collections for every lifestyle</p>
                            </div>
                            <Link to="/products" className="btn btn-outline btn-sm">
                                <span>View All</span>
                                <ArrowRight size={15} />
                            </Link>
                        </div>

                        <div className="categories-grid">
                            {categories.map((cat) => (
                                <div
                                    key={cat}
                                    className="category-card"
                                    onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
                                >
                                    <div className="category-icon">
                                        {getCategoryIcon(cat)}
                                    </div>
                                    <h3 className="category-card-title">{cat}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                                        {products.filter(p => p.category === cat).length} Products
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Featured Products Section */}
                <section style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 className="section-title">Trending Products</h2>
                            <p className="section-subtitle">Handpicked items popular right now</p>
                        </div>
                        <Link to="/products" className="btn btn-outline btn-sm">
                            <span>Explore Catalog</span>
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="products-grid">
                            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.slice(0, 4).map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    isInWishlist={wishlistIds.includes(product._id)}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Why ShopKart Section */}
                <section style={{ marginBottom: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 className="section-title">Why Choose ShopKart?</h2>
                        <p className="section-subtitle" style={{ maxWidth: '500px', margin: '0.5rem auto 0 auto' }}>
                            Designed for modern shoppers who demand speed, clarity, and convenience.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <Zap size={24} />
                            </div>
                            <h3>Easy Shopping</h3>
                            <p>Instant category filtering and real-time live search across our catalog.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <Heart size={24} />
                            </div>
                            <h3>Smart Wishlist</h3>
                            <p>Save items you love in one click and revisit them whenever you are ready.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <ShoppingBag size={24} />
                            </div>
                            <h3>Simple Cart</h3>
                            <p>Dynamic stock limit checks, quantity management, and subtotal calculations.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <ShieldCheck size={24} />
                            </div>
                            <h3>Secure Account</h3>
                            <p>Encrypted authentication keeps your session and personal information safe.</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Home;