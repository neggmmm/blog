import React, { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/styles.css';

function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {  
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/users/login', {
                emailOrUsername,
                password
            });
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="form-container">
            <h2>Login to BLOG</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin}>
                <input 
                    type="text"
                    placeholder="Email or username *"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="form-input"
                />
                <input
                    type="password"
                    placeholder="Password *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="form-input"
                />
                <div className="form-links">
                    <Link to="/request-password-reset" className="form-link">Forgot password?</Link>
                </div>
                <div className="form-links">
                    New to BLOG? <Link to="/register" className="form-link">Sign Up</Link>
                </div>
                <button type="submit" disabled={isLoading} className="form-button">
                    {isLoading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
        </div>
    );
}

export default Login;
