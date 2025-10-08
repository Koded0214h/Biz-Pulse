import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { authAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    phone_number: '',
    country: '',
    industry: '',
    receive_alerts: true,
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLogoutLoading(false);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-t-lg shadow-lg p-6 mb-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.business_name ? profile.business_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.business_name || 'Your Business'}</h1>
                <p className="text-gray-600">{profile.industry || 'Industry not set'}</p>
              </div>
            </div>
          </div>

          {/* Profile Form Card */}
          <div className="bg-white rounded-b-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="business_name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    id="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your business name"
                  />
                </div>
                <div>
                  <label htmlFor="phone_number" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your country"
                  />
                </div>
                <div>
                  <label htmlFor="industry" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    id="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your industry"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <input
                  id="receive_alerts"
                  name="receive_alerts"
                  type="checkbox"
                  checked={formData.receive_alerts}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="receive_alerts" className="text-sm text-gray-900 font-medium">
                  Receive email alerts for important updates
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {logoutLoading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
