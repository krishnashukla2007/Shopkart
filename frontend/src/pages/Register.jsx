import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShoppingBag, User, Mail, Lock, Phone, AlertCircle, UserPlus } from "lucide-react";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: ""
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = function (e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async function (e) {
        e.preventDefault();
        setError("");

        if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
            setError("All fields are required");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await api.post("/customers/register", formData);
            console.log(response.data);
            navigate("/login");
        }
        catch (error) {
            setError(error.response?.data?.message || "Registration failed. Please try again.");
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
                        <h1>Create Account</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.35rem' }}>
                            Join ShopKart for a smarter shopping experience
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
                            <label className="form-label" htmlFor="fullName">Full Name</label>
                            <div className="input-wrapper">
                                <User size={18} className="input-icon" />
                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    className="input-field"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="input-field"
                                    placeholder="john@example.com"
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
                                    placeholder="At least 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">Phone Number</label>
                            <div className="input-wrapper">
                                <Phone size={18} className="input-icon" />
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    className="input-field"
                                    placeholder="+91 9876543210"
                                    value={formData.phone}
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
                            <UserPlus size={18} />
                            <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
                        </button>
                    </form>

                    <div className="auth-footer-text">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Register;