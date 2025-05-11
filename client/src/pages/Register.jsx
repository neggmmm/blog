import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/styles.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/users/register', {
                email,
                password,
                username
            });
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="form-container">
            <h2>Create a BLOG Account</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleRegister}>
                <input 
                    type="email"
                    placeholder="Email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="form-input"
                />
                <input 
                    type="text"
                    placeholder="Username *"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    Already have an account? <Link to="/login" className="form-link">Login</Link>
                </div>
                <button type="submit" disabled={isLoading} className="form-button">
                    {isLoading ? 'Creating account...' : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default Register;
