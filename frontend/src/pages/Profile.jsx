import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { authAPI } from '../api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    business_name: '',
    phone_number: '',
    country: '',
    industry: '',
    receive_alerts: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authAPI.getProfile();
        setProfile(data);
        setFormData({
          business_name: data.business_name || '',
          phone_number: data.phone_number || '',
          country: data.country || '',
          industry: data.industry || '',
          receive_alerts: data.receive_alerts,
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement profile update API call here if available
    alert('Profile update functionality not implemented yet.');
  };

  if (loading) {
    return (
      <Layout activePage="profile">
        <div className="p-4 sm:p-6 lg:p-8">Loading profile...</div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout activePage="profile">
        <div className="p-4 sm:p-6 lg:p-8">Failed to load profile.</div>
      </Layout>
    );
  }

  return (
    <Layout activePage="profile">
      <div className="p-4 sm:p-6 lg:p-8 max-w-lg sm:max-w-none mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              name="business_name"
              id="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phone_number"
              id="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              name="country"
              id="country"
              value={formData.country}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              id="industry"
              value={formData.industry}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex items-center">
            <input
              id="receive_alerts"
              name="receive_alerts"
              type="checkbox"
              checked={formData.receive_alerts}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="receive_alerts" className="ml-2 block text-sm text-gray-900">
              Receive Alerts
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
