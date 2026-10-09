import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import WishlistCard from "../components/WishlistCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SkeletonGrid } from "../components/SkeletonCard";
import { Heart, ShoppingBag, AlertCircle, RefreshCw } from "lucide-react";

function Wishlist() {
    const [isLoading, setIsLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);
    const [isError, setIsError] = useState(false);
    const [removingId, setRemovingId] = useState(null);

    const fetchWishlist = async function() {
        try {
            setIsLoading(true);
            setIsError(false);
            const response = await api.get("/wishlist");
            setWishlist(response.data.wishlist || []);
        }
        catch(error) {
            console.log(error);
            setIsError(true);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const removeFromWishlist = async function(productId) {
        try {
            setRemovingId(productId);
            await api.delete("/wishlist/" + productId);

            setWishlist((currentWishlist) => {
                return currentWishlist.filter(
                    (product) => product._id !== productId
                );
            });
        }
        catch(error) {
            console.log(error);
        }
        finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="app-container">
            <Navbar />

            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Your Wishlist</h1>
                    <p className="page-subtitle">Products you've saved for later.</p>
                </div>

                {isLoading ? (
                    <SkeletonGrid count={4} />
                ) : isError ? (
                    <div className="error-state">
                        <div className="state-icon-circle" style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)' }}>
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="state-title">Failed to fetch wishlist</h2>
                        <p className="state-desc">We couldn't retrieve your saved items. Make sure you are logged in.</p>
                        <button onClick={fetchWishlist} className="btn btn-primary">
                            <RefreshCw size={16} />
                            <span>Try Again</span>
                        </button>
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="empty-state">
                        <div className="state-icon-circle" style={{ backgroundColor: '#ffe4e6', color: '#e11d48' }}>
                            <Heart size={36} fill="currentColor" />
                        </div>
                        <h2 className="state-title">Your wishlist is empty</h2>
                        <p className="state-desc">Save products you love and find them here later.</p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            <ShoppingBag size={18} />
                            <span>Explore Products</span>
                        </Link>
                    </div>
                ) : (
                    <div className="products-grid">
                        {wishlist.map((product) => (
                            <WishlistCard
                                key={product._id}
                                product={product}
                                onRemove={removeFromWishlist}
                                isRemoving={removingId === product._id}
                            />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Wishlist;