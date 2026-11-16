
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = "http://localhost:5000/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid email or password"
                );
            }

            if (!data.token) {
                throw new Error("Login token was not received");
            }

            // Store Admin JWT Token
            localStorage.setItem("radianceAdminToken", data.token);

            // Navigate to Admin Dashboard
            navigate("/admin/dashboard");

        } catch (error) {
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">

            {/* Close Button */}
            <button
                type="button"
                className="login-close-btn"
                onClick={() => navigate("/")}
                aria-label="Close login"
            >
                ×
            </button>

            <div className="admin-login-card">

                <div className="admin-login-heading">
                    <h1>RADIANCE IAS ACADEMY</h1>
                    <h2>Admin Login</h2>
                    <p>Login to manage your academy website</p>
                </div>

                <form onSubmit={handleLogin}>

                    <div className="login-input-group">
                        <label>Email Address</label>

                        <input
                            type="email"
                            placeholder="Enter admin email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-input-group">
                        <label>Password</label>

                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="admin-login-submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="admin-login-footer">
                    © {new Date().getFullYear()} Radiance IAS Academy
                </p>

            </div>
        </div>
    );
}

export default Login;
