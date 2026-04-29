import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await api.get(`/api/profiles/search?q=${encodeURIComponent(query)}`);
      setResults(response.data.data);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Natural Language Search</h1>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., young males from nigeria, females above 30, adult males from kenya"
            className="flex-1 border rounded px-4 py-2"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Search
          </button>
        </div>
      </form>

      {loading && <div className="text-center py-8">Searching...</div>}

      {!loading && hasSearched && (
        <>
          <p className="mb-4 text-gray-600">Found {results.length} results</p>
          {results.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No profiles found matching your query
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((profile) => (
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
          )}
        </>
      )}
    </div>
  );
}

export default Search;