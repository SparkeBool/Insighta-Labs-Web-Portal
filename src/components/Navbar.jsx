import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/me")
      .then(res => setUser(res.data.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await api.post("/auth/logout", {});
    navigate("/login");
  };

  // Don't show navbar if not logged in
  if (!user) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">Insighta Labs+</Link>
        <div className="flex items-center space-x-6">
          <Link to="/profiles" className="text-gray-700 hover:text-blue-600">Profiles</Link>
          <Link to="/search" className="text-gray-700 hover:text-blue-600">Search</Link>
          <Link to="/account" className="text-gray-700 hover:text-blue-600">Account</Link>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-800">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;