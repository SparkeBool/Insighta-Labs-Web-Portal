import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function ProfilesList() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: "",
    country_id: "",
    age_group: "",
    min_age: "",
    max_age: "",
    sort_by: "created_at",
    order: "desc",
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
    links: { self: "", next: "", prev: "" }
  });

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.gender) params.append("gender", filters.gender);
      if (filters.country_id) params.append("country_id", filters.country_id);
      if (filters.age_group) params.append("age_group", filters.age_group);
      if (filters.min_age) params.append("min_age", filters.min_age);
      if (filters.max_age) params.append("max_age", filters.max_age);
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      if (filters.order) params.append("order", filters.order);
      params.append("page", filters.page);
      params.append("limit", filters.limit);

      const response = await api.get(`/api/profiles?${params.toString()}`);

      setProfiles(response.data.data);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        total_pages: response.data.total_pages,
        links: response.data.links
      });
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleSort = (field) => {
    const newOrder = filters.sort_by === field && filters.order === "asc" ? "desc" : "asc";
    setFilters({ ...filters, sort_by: field, order: newOrder, page: 1 });
  };

  const goToPage = (page) => {
    if (page && page !== filters.page) {
      setFilters({ ...filters, page });
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.gender) params.append("gender", filters.gender);
      if (filters.country_id) params.append("country_id", filters.country_id);
      
      const response = await api.get(`/api/profiles/export?${params.toString()}`, {
        responseType: "blob"
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `profiles_${new Date().toISOString().replace(/[:.]/g, "-")}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Check console for details.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profiles</h1>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <select name="gender" value={filters.gender} onChange={handleFilterChange} className="border rounded px-3 py-2">
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="text" name="country_id" placeholder="Country (NG, US, KE)" value={filters.country_id} onChange={handleFilterChange} className="border rounded px-3 py-2" />
          <select name="age_group" value={filters.age_group} onChange={handleFilterChange} className="border rounded px-3 py-2">
            <option value="">All Ages</option>
            <option value="child">Child</option>
            <option value="teenager">Teenager</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>
          <input type="number" name="min_age" placeholder="Min Age" value={filters.min_age} onChange={handleFilterChange} className="border rounded px-3 py-2" />
          <input type="number" name="max_age" placeholder="Max Age" value={filters.max_age} onChange={handleFilterChange} className="border rounded px-3 py-2" />
        </div>
      </div>

      <div className="mb-4 text-right">
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("gender")}>Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("age")}>Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profiles.map((profile) => (
                  <tr key={profile.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{profile.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{profile.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{profile.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{profile.age_group}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{profile.country_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/profiles/${profile.id}`} className="text-blue-600 hover:text-blue-800">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} profiles
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={!pagination.links.prev}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">Page {pagination.page} of {pagination.total_pages}</span>
              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={!pagination.links.next}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProfilesList;