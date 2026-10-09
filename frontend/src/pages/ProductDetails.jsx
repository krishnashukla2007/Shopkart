import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, Heart, ShoppingBag, Check, AlertCircle, RefreshCw } from "lucide-react";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { cartItems, addToCart } = useCart();

    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isAddingWishlist, setIsAddingWishlist] = useState(false);
    const [isAddedWishlist, setIsAddedWishlist] = useState(false);
    const [isAddingCart, setIsAddingCart] = useState(false);

    const fetchDetails = async function(productId) {
        try {
            setIsLoading(true);
            setIsError(false);
            const response = await api.get("/products/" + productId);
            setDetails(response.data.product);
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
        fetchDetails(id);
    }, [id]);

    useEffect(() => {
        async function fetchWishlistIds() {
            try {
                const response = await api.get("/wishlist");
                const ids = (response.data.wishlist || []).map((p) => p._id);
                setIsAddedWishlist(ids.includes(id));
            }
            catch (error) {
                console.log(error);
            }
        }

        fetchWishlistIds();
    }, [id]);

    const handleAddToWishlist = async function(productId) {
        try {
            setIsAddingWishlist(true);
            await api.post("/wishlist/" + productId);
            setIsAddedWishlist(true);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setIsAddingWishlist(false);
        }
    };

    const handleAddToCart = async function(productId) {
        try {
            setIsAddingCart(true);
            await addToCart(productId);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setIsAddingCart(false);
        }
    };

    const cartItem = details ? cartItems.find((item) => item.product?._id === details._id) : null;
    const isInCart = !!cartItem;
    const maxStockReached = cartItem && details && cartItem.quantity >= details.stock;

    const formattedPrice = details
        ? typeof details.price === 'number'
            ? `₹${details.price.toLocaleString('en-IN')}`
            : `₹${details.price}`
        : '';

    return (
        <div className="app-container">
            <Navbar />

            <main className="main-content">
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link to="/products" className="btn btn-outline btn-sm">
                        <ArrowLeft size={16} />
                        <span>Back to Products</span>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="product-detail-layout">
                        <div className="skeleton" style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-xl)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="skeleton" style={{ width: '30%', height: '16px' }} />
                            <div className="skeleton" style={{ width: '80%', height: '36px' }} />
                            <div className="skeleton" style={{ width: '40%', height: '28px' }} />
                            <div className="skeleton" style={{ width: '100%', height: '100px' }} />
                            <div className="skeleton" style={{ width: '60%', height: '44px' }} />
                        </div>
                    </div>
                ) : isError || !details ? (
                    <div className="error-state">
                        <div className="state-icon-circle" style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)' }}>
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="state-title">Failed to load product</h2>
                        <p className="state-desc">The requested product could not be retrieved.</p>
                        <button onClick={() => fetchDetails(id)} className="btn btn-primary">
                            <RefreshCw size={16} />
                            <span>Retry</span>
                        </button>
                    </div>
                ) : (
                    <div className="product-detail-layout">
                        <div className="product-detail-gallery">
                            <img
                                src={details.image}
                                alt={details.name}
                                className="product-detail-image"
                            />
                        </div>

                        <div className="product-detail-content">
                            <span className="product-category-tag" style={{ fontSize: '0.9rem' }}>
                                {details.category}
                            </span>
                            <h1 className="product-detail-title">{details.name}</h1>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <span className="product-detail-price">{formattedPrice}</span>
                                <span className={`stock-badge ${details.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                    {details.stock > 0 ? (
                                        <>
                                            <Check size={14} />
                                            <span>In stock ({details.stock} available)</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle size={14} />
                                            <span>Out of stock</span>
                                        </>
                                    )}
                                </span>
                            </div>

                            <p className="product-detail-desc">{details.description}</p>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                                <button
                                    onClick={() => handleAddToCart(details._id)}
                                    disabled={isAddingCart || details.stock === 0 || maxStockReached}
                                    className="btn btn-primary btn-lg"
                                    style={{ flex: 1, minWidth: '200px' }}
                                >
                                    <ShoppingBag size={20} />
                                    <span>
                                        {isAddingCart
                                            ? "Adding..."
                                            : details.stock === 0
                                                ? "Out of Stock"
                                                : maxStockReached
                                                    ? "Max Stock Reached"
                                                    : isInCart
                                                        ? "Add Another"
                                                        : "Add to Cart"}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleAddToWishlist(details._id)}
                                    disabled={isAddingWishlist || isAddedWishlist}
                                    className={`btn btn-lg ${isAddedWishlist ? 'btn-outline' : 'btn-outline'}`}
                                    style={{
                                        color: isAddedWishlist ? '#e11d48' : 'inherit',
                                        borderColor: isAddedWishlist ? '#fecdd3' : 'var(--border-color)',
                                        backgroundColor: isAddedWishlist ? '#ffe4e6' : 'transparent'
                                    }}
                                >
                                    <Heart size={20} fill={isAddedWishlist ? "currentColor" : "none"} />
                                    <span>
                                        {isAddingWishlist
                                            ? "Adding..."
                                            : isAddedWishlist
                                                ? "Added to Wishlist"
                                                : "Add to Wishlist"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default ProductDetails;