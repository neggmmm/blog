import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../pages/styles.css';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const token = searchParams.get('token');
                if (!token) {
                    setError('No verification token provided');
                    setStatus('error');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/users/verify-email?token=${token}`);
                setStatus('success');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (err) {
                setError(err.response?.data?.message || 'Verification failed');
                setStatus('error');
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div className="form-container">
            <h2>Email Verification</h2>
            {status === 'verifying' && (
                <div className="verification-status">
                    <p>Verifying your email...</p>
                </div>
            )}
            {status === 'success' && (
                <div className="verification-status success">
                    <p>Email verified successfully! Redirecting to login...</p>
                </div>
            )}
            {status === 'error' && (
                <div className="error-message">
                    <p>{error}</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="form-button"
                    >
                        Return to Login
                    </button>
                </div>
            )}
        </div>
    );
}

export default VerifyEmail; 