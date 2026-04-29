import React, { useEffect, useState } from "react";
import api from "../api/axios";

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        window.location.href = "/";
      } catch (error) {
        // Not authenticated, stay on login page
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/auth/github");
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to start authentication. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-96">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Insighta Labs+</h1>
        <p className="text-gray-600 mb-6">Sign in to access the platform</p>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition w-full disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Continue with GitHub"}
        </button>
      </div>
    </div>
  );
}

export default Login;