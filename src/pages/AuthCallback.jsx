import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const success = params.get("success");
    
    const exchangeCode = async () => {
      try {
        // If we have code and state, exchange them
        if (code && state) {
          const response = await api.get(`/auth/github/callback?code=${code}&state=${state}`);
          if (response.data.status === "success" && response.data.redirect_url) {
            window.location.href = response.data.redirect_url;
            return;
          }
        }
        
        // If we have success=true or after exchange
        if (success === "true") {
          // Verify we can get user info
          await api.get("/auth/me");
          navigate("/");
          return;
        }
        
        // If no params, try to check auth status
        try {
          await api.get("/auth/me");
          navigate("/");
        } catch (authError) {
          navigate("/login");
        }
        
      } catch (error) {
        console.error("Auth callback error:", error);
        setError("Authentication failed. Please try again.");
        setLoading(false);
      }
    };
    
    exchangeCode();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
        <button 
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}

export default AuthCallback;