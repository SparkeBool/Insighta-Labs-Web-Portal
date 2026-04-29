import React, { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {
  const [metrics, setMetrics] = useState({
    total: 0,
    male: 0,
    female: 0,
    child: 0,
    teenager: 0,
    adult: 0,
    senior: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [totalRes, maleRes, femaleRes, childRes, teenRes, adultRes, seniorRes] = await Promise.all([
          api.get("/api/profiles?limit=1"),
          api.get("/api/profiles?gender=male&limit=1"),
          api.get("/api/profiles?gender=female&limit=1"),
          api.get("/api/profiles?age_group=child&limit=1"),
          api.get("/api/profiles?age_group=teenager&limit=1"),
          api.get("/api/profiles?age_group=adult&limit=1"),
          api.get("/api/profiles?age_group=senior&limit=1")
        ]);

        setMetrics({
          total: totalRes.data.total,
          male: maleRes.data.total,
          female: femaleRes.data.total,
          child: childRes.data.total,
          teenager: teenRes.data.total,
          adult: adultRes.data.total,
          senior: seniorRes.data.total
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Profiles</h3>
          <p className="text-3xl font-bold">{metrics.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Male</h3>
          <p className="text-3xl font-bold text-blue-600">{metrics.male}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Female</h3>
          <p className="text-3xl font-bold text-pink-600">{metrics.female}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Child</h3>
          <p className="text-3xl font-bold">{metrics.child}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Teenager</h3>
          <p className="text-3xl font-bold">{metrics.teenager}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Adult</h3>
          <p className="text-3xl font-bold">{metrics.adult}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Senior</h3>
          <p className="text-3xl font-bold">{metrics.senior}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;