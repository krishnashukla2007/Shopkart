import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShoppingBag, Mail, Lock, AlertCircle, ArrowRight, LogIn } from "lucide-react";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { fetchCart } = useCart();

    const handleChange = function(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async function(e) {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in both email and password");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await api.post(
                "/customers/login",
                formData
            );

            console.log(response.data);

            await fetchCart();

            navigate("/home");
        }
        catch(error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="app-container">
            <Navbar />

            <main className="auth-page-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <span className="brand-icon" style={{ margin: '0 auto' }}>
                            <ShoppingBag size={24} />
                        </span>
                        <h1>Welcome Back</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.35rem' }}>
                            Sign in to your ShopKart account
                        </p>
                    </div>

                    {error && (
                        <div className="alert-box error">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="input-field"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                        >
                            <LogIn size={18} />
                            <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
                        </button>
                    </form>

                    <div className="auth-footer-text">
                        Don't have an account? <Link to="/register">Create an Account</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Login;