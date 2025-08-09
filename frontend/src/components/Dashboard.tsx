import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './auth/Login';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import { UserRole } from '../types';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState('overview');

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Today's Sales</h3>
              <p className="text-3xl font-bold text-blue-600">₹0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Consultations</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Low Stock Items</h3>
              <p className="text-3xl font-bold text-red-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Pending Orders</h3>
              <p className="text-3xl font-bold text-yellow-600">0</p>
            </div>
          </div>
        </div>;
      case 'consultations':
        return <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Consultations</h2>
          <p>Consultation management coming soon...</p>
        </div>;
      case 'inventory':
        return <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
          <p>Inventory management coming soon...</p>
        </div>;
      case 'sales':
        return <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Point of Sale</h2>
          <p>POS system coming soon...</p>
        </div>;
      default:
        return <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p>Select an option from the sidebar</p>
        </div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} userRole={user.role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;