import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/profiles/${id}`);
        setProfile(response.data.data);
      } catch (error) {
        if (error.response?.status === 404) {
          navigate("/profiles");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this profile?")) {
      try {
        await api.delete(`/api/profiles/${id}`);
        navigate("/profiles");
      } catch (error) {
        alert("Failed to delete profile");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8">Profile not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-medium">{profile.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Gender</p>
            <p className="font-medium">{profile.gender} ({(profile.gender_probability * 100).toFixed(1)}%)</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Age</p>
            <p className="font-medium">{profile.age} ({profile.age_group})</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Country</p>
            <p className="font-medium">{profile.country_name || profile.country_id} ({(profile.country_probability * 100).toFixed(1)}%)</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Created At</p>
            <p className="font-medium">{new Date(profile.created_at).toLocaleString()}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
}

export default ProfileDetail;