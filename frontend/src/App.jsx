// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import SalesDeepDive from './pages/SalesDeepDive';
import DataConnections from './pages/DataConnections';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/sales" element={<SalesDeepDive />} />
  <Route path="/alerts" element={<Alerts />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/connections" element={<DataConnections />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/landing" element={<LandingPage />} />
</Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;