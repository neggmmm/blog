import axios from 'axios';
import React, { useState } from 'react'

function ForgetPw() {
    const [emailOrUsername,setEmailOrUsername] = useState("");
    const [error,setError] = useState("");
    const [isLoading,setIsLoading] = useState(false);
    const handleForget = async(e)=>{
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try{
            const res = await axios.post("http:://localhost:5000/api/users/forgetpassword")
        }catch(err){
            setError(err.response?.data?.message || "Couldn't find the email address");
        }finally{
            setIsLoading(false)
        }
    }
  return (
    <div className="form-container">
            <h2>Login to BLOG</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleForget}>
                <input 
                    type="text"
                    placeholder="Email or username *"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="form-input"
                />
            </form>    
    </div>
  )
}

export default ForgetPw
