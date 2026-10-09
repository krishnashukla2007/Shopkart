import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SkeletonGrid } from "../components/SkeletonCard";
import { Search, Filter, AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";

function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") || "";

    const [products, setProducts] = useState([]);
    const [allCategories, setAllCategories] = useState(["Electronics", "Clothing", "Books"]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(initialCategory);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [wishlistIds, setWishlistIds] = useState([]);

    // Fetch products based on search & category
    const fetchProducts = async function() {
        try {
            setIsLoading(true);
            setIsError(false);
            const response = await api.get("/products?search=" + search + "&category=" + category);
            const fetchedProducts = response.data.products || [];
            setProducts(fetchedProducts);

            // Dynamically collect unique categories from returned products
            if (fetchedProducts.length > 0) {
                const cats = Array.from(new Set(fetchedProducts.map(p => p.category).filter(Boolean)));
                setAllCategories(prev => Array.from(new Set([...prev, ...cats])));
            }
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
        fetchProducts();
    }, [search, category]);

    useEffect(() => {
        async function fetchWishlistIds() {
            try {
                const response = await api.get("/wishlist");
                setWishlistIds((response.data.wishlist || []).map((product) => product._id));
            }
            catch(error) {
                console.log(error);
            }
        }

        fetchWishlistIds();
    }, []);

    const handleSearchChange = function(event) {
        setSearch(event.target.value);
    };

    const handleCategoryChange = function(event) {
        setCategory(event.target.value);
        if (event.target.value) {
            setSearchParams({ category: event.target.value });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="app-container">
            <Navbar />

            <main className="main-content">
                <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem' }}>
                    <div>
                        <h1 className="page-title">Products</h1>
                        <p className="page-subtitle">Discover products curated for your everyday needs.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%', maxWidth: '560px' }}>
                        {/* Search Input */}
                        <div className="input-wrapper" style={{ flex: 1, minWidth: '220px' }}>
                            <Search size={18} className="input-icon" />
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Search by name..."
                                value={search}
                                onChange={handleSearchChange}
                                aria-label="Search products"
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="select-wrapper" style={{ minWidth: '180px' }}>
                            <select
                                className="select-field"
                                value={category}
                                onChange={handleCategoryChange}
                                aria-label="Filter by category"
                            >
                                <option value="">All Categories</option>
                                {allCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {isLoading ? (
                    <SkeletonGrid count={8} />
                ) : isError ? (
                    <div className="error-state">
                        <div className="state-icon-circle" style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)' }}>
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="state-title">Something went wrong</h2>
                        <p className="state-desc">We couldn't load the products right now. Please check your connection and try again.</p>
                        <button onClick={fetchProducts} className="btn btn-primary">
                            <RefreshCw size={16} />
                            <span>Try Again</span>
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <div className="state-icon-circle">
                            <ShoppingBag size={32} />
                        </div>
                        <h2 className="state-title">No products found</h2>
                        <p className="state-desc">We couldn't find any products matching your search criteria. Try clearing search filters.</p>
                        <button
                            onClick={() => { setSearch(""); setCategory(""); setSearchParams({}); }}
                            className="btn btn-outline"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                isInWishlist={wishlistIds.includes(product._id)}
                            />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Products;