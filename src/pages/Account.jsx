import React, { useEffect, useState } from "react";
import api from "../api/axios";

function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me")
      .then(res => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-8">Not logged in</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img src={user.avatar_url} alt={user.username} className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">User ID</p>
            <p className="font-mono text-sm">{user.id.substring(0, 8)}...</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Role</p>
            <p className="font-medium">
              <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                {user.role}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;