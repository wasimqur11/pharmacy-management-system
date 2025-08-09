import React, { useState, useEffect } from 'react';

const colors = {
  primary: '#667eea',
  primaryDark: '#5a67d8',
  secondary: '#764ba2',
  accent: '#f093fb',
  success: '#48bb78',
  warning: '#ed8936',
  error: '#f56565',
  bgPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  bgCard: 'rgba(255, 255, 255, 0.95)',
  bgOverlay: 'rgba(255, 255, 255, 0.1)',
  textPrimary: '#2d3748',
  textSecondary: '#4a5568',
  textLight: '#a0aec0',
  textWhite: '#ffffff',
  border: 'rgba(255, 255, 255, 0.2)',
  borderDark: '#e2e8f0'
};

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  is_active?: boolean; // Backend sends snake_case
  // Role-specific fields
  specialization?: string;
  licenseNumber?: string;
  license_number?: string; // Backend sends snake_case
  consultationFee?: number;
  consultation_fee?: number; // Backend sends snake_case
  employeeId?: string;
  employee_id?: string; // Backend sends snake_case
  department?: string;
  salary?: number;
  profitSharePercentage?: number;
  profit_share_percentage?: number; // Backend sends snake_case
  investmentAmount?: number;
  investment_amount?: number; // Backend sends snake_case
}

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  // Doctor fields
  specialization?: string;
  licenseNumber?: string;
  consultationFee?: number;
  // Employee fields
  employeeId?: string;
  department?: string;
  salary?: number;
  // Partner fields
  profitSharePercentage?: number;
  investmentAmount?: number;
}

interface PharmacyConfig {
  pharmacyName: string;
  address: string;
  phone: string;
  email: string;
  licenseNumber: string;
  registrationNumber: string;
  ownerName: string;
  workingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  currency: string;
  taxRate: number;
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'employees' | 'partners' | 'config'>('doctors');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pharmacyConfig, setPharmacyConfig] = useState<PharmacyConfig>({
    pharmacyName: '',
    address: '',
    phone: '',
    email: '',
    licenseNumber: '',
    registrationNumber: '',
    ownerName: '',
    workingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '14:00' },
      sunday: { open: '10:00', close: '13:00' }
    },
    currency: 'INR',
    taxRate: 18
  });

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const getAuthToken = () => localStorage.getItem('token');

  const apiRequest = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const response = await fetch(`http://localhost:5001/api${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const fetchUsers = async (role: string) => {
    setLoading(true);
    try {
      const response = await apiRequest(`/admin/users/${role}`);
      setUsers(response.data || []);
    } catch (error: any) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPharmacyConfig = async () => {
    try {
      const response = await apiRequest('/admin/config/pharmacy');
      if (response.data) {
        setPharmacyConfig(response.data);
      }
    } catch (error: any) {
      if (!error.message.includes('404')) {
        showMessage(error.message, 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingUser) {
        // Update existing user
        await apiRequest(`/admin/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        showMessage(`${activeTab.slice(0, -1)} updated successfully!`);
      } else {
        // Create new user
        let endpoint = '';
        switch (activeTab) {
          case 'doctors':
            endpoint = '/admin/doctors';
            break;
          case 'employees':
            endpoint = '/admin/employees';
            break;
          case 'partners':
            endpoint = '/admin/partners';
            break;
        }

        await apiRequest(endpoint, {
          method: 'POST',
          body: JSON.stringify(formData)
        });

        showMessage(`${activeTab.slice(0, -1)} added successfully!`);
      }
      
      setShowForm(false);
      resetForm();
      fetchUsers(activeTab.slice(0, -1));
    } catch (error: any) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiRequest('/admin/config/pharmacy', {
        method: 'POST',
        body: JSON.stringify(pharmacyConfig)
      });

      showMessage('Pharmacy configuration saved successfully!');
    } catch (error: any) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: ''
    });
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '', // Don't show password for editing
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
      // Map backend snake_case to frontend
      specialization: user.specialization || user.specialization,
      licenseNumber: user.licenseNumber || user.license_number,
      consultationFee: user.consultationFee || user.consultation_fee,
      employeeId: user.employeeId || user.employee_id,
      department: user.department,
      salary: user.salary,
      profitSharePercentage: user.profitSharePercentage || user.profit_share_percentage,
      investmentAmount: user.investmentAmount || user.investment_amount
    });
    setShowForm(true);
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      if (currentStatus) {
        await apiRequest(`/admin/users/${userId}/deactivate`, {
          method: 'PATCH'
        });
        showMessage('User deactivated successfully!');
      } else {
        await apiRequest(`/admin/users/${userId}/activate`, {
          method: 'PATCH'
        });
        showMessage('User activated successfully!');
      }
      fetchUsers(activeTab.slice(0, -1));
    } catch (error: any) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'config') {
      fetchUsers(activeTab.slice(0, -1));
    } else {
      fetchPharmacyConfig();
    }
  }, [activeTab]);

  const tabs = [
    { id: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { id: 'employees', label: 'Employees', icon: '👥' },
    { id: 'partners', label: 'Partners', icon: '🤝' },
    { id: 'config', label: 'Settings', icon: '⚙️' }
  ];

  const renderForm = () => {
    if (activeTab === 'config') {
      return (
        <div style={{ 
          background: colors.bgCard,
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${colors.borderDark}`
        }}>
          <h3 style={{ 
            color: colors.textPrimary,
            marginBottom: '24px',
            fontSize: '18px',
            fontWeight: '700'
          }}>
            Pharmacy Configuration
          </h3>
          <form onSubmit={handleConfigSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Pharmacy Name *
                </label>
                <input
                  type="text"
                  value={pharmacyConfig.pharmacyName}
                  onChange={(e) => setPharmacyConfig({...pharmacyConfig, pharmacyName: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Owner Name *
                </label>
                <input
                  type="text"
                  value={pharmacyConfig.ownerName}
                  onChange={(e) => setPharmacyConfig({...pharmacyConfig, ownerName: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                Address *
              </label>
              <textarea
                value={pharmacyConfig.address}
                onChange={(e) => setPharmacyConfig({...pharmacyConfig, address: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, height: '80px', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  value={pharmacyConfig.phone}
                  onChange={(e) => setPharmacyConfig({...pharmacyConfig, phone: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={pharmacyConfig.email}
                  onChange={(e) => setPharmacyConfig({...pharmacyConfig, email: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Tax Rate (%) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.01"
                  value={pharmacyConfig.taxRate}
                  onChange={(e) => setPharmacyConfig({...pharmacyConfig, taxRate: Number(e.target.value)})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  License Number *
                </label>
                <input
                  type="text"
                  value={pharmacyConfig.licenseNumber}
                  onChange={(e) => setPharmacyConfig({...pharmacyConfig, licenseNumber: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Registration Number *
                </label>
                <input
                  type="text"
                  value={pharmacyConfig.registrationNumber}
                  onChange={(e) => setPharmacyConfig({...pharmacyConfig, registrationNumber: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Currency *
                </label>
                <select
                  value={pharmacyConfig.currency}
                  onChange={(e) => setPharmacyConfig({...pharmacyConfig, currency: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}` }}
                  required
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: loading ? colors.textLight : colors.bgPrimary,
                color: colors.textWhite,
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Saving...' : 'Save Configuration'}
            </button>
          </form>
        </div>
      );
    }

    if (!showForm) return null;

    return (
      <div style={{ 
        background: colors.bgCard,
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08)',
        border: `1px solid ${colors.borderDark}`,
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ 
            color: colors.textPrimary,
            margin: 0,
            fontSize: '18px',
            fontWeight: '700'
          }}>
            {editingUser ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
          </h3>
          <button
            onClick={() => { setShowForm(false); resetForm(); }}
            style={{
              padding: '8px 12px',
              background: colors.error,
              color: colors.textWhite,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            ✕ Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                Password {editingUser ? '(leave blank to keep current)' : '*'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                required={!editingUser}
                placeholder={editingUser ? 'Leave blank to keep current password' : ''}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
            />
          </div>

          {/* Role-specific fields */}
          {activeTab === 'doctors' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Specialization *
                </label>
                <input
                  type="text"
                  value={formData.specialization || ''}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  License Number *
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber || ''}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Consultation Fee *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.consultationFee || ''}
                  onChange={(e) => setFormData({...formData, consultationFee: Number(e.target.value)})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
            </div>
          )}

          {activeTab === 'employees' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Employee ID *
                </label>
                <input
                  type="text"
                  value={formData.employeeId || ''}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Department *
                </label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Salary *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salary || ''}
                  onChange={(e) => setFormData({...formData, salary: Number(e.target.value)})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
            </div>
          )}

          {activeTab === 'partners' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Profit Share (%) *
                </label>
                <input
                  type="number"
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={formData.profitSharePercentage || ''}
                  onChange={(e) => setFormData({...formData, profitSharePercentage: Number(e.target.value)})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                  Investment Amount *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.investmentAmount || ''}
                  onChange={(e) => setFormData({...formData, investmentAmount: Number(e.target.value)})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.borderDark}`, boxSizing: 'border-box' }}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: loading ? colors.textLight : colors.bgPrimary,
              color: colors.textWhite,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
{loading ? (editingUser ? 'Updating...' : 'Adding...') : (editingUser ? `Update ${activeTab.slice(0, -1)}` : `Add ${activeTab.slice(0, -1)}`)}
          </button>
        </form>
      </div>
    );
  };

  const renderUsersList = () => {
    if (activeTab === 'config') return null;

    return (
      <div style={{ 
        background: colors.bgCard,
        borderRadius: '16px',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08)',
        border: `1px solid ${colors.borderDark}`,
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '20px 24px',
          borderBottom: `1px solid ${colors.borderDark}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ 
            color: colors.textPrimary,
            margin: 0,
            fontSize: '18px',
            fontWeight: '700'
          }}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({users.length})
          </h3>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '10px 16px',
              background: colors.bgPrimary,
              color: colors.textWhite,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            + Add New
          </button>
        </div>

        <div style={{ padding: '0' }}>
          {loading ? (
            <div style={{ 
              padding: '40px',
              textAlign: 'center',
              color: colors.textSecondary
            }}>
              Loading...
            </div>
          ) : users.length === 0 ? (
            <div style={{ 
              padding: '40px',
              textAlign: 'center',
              color: colors.textSecondary
            }}>
              No {activeTab} found. Add your first {activeTab.slice(0, -1)} to get started.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {users.map((user, index) => (
                <div
                  key={user.id}
                  style={{
                    padding: '16px 24px',
                    borderBottom: index < users.length - 1 ? `1px solid ${colors.borderDark}` : 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '16px',
                        fontWeight: '600',
                        color: colors.textPrimary,
                        marginBottom: '4px'
                      }}>
                        {user.firstName || user.first_name} {user.lastName || user.last_name}
                      </div>
                      <div style={{ 
                        fontSize: '14px',
                        color: colors.textSecondary,
                        marginBottom: '8px'
                      }}>
                        📧 {user.email} {user.phone && `• 📞 ${user.phone}`}
                      </div>
                      
                      {/* Role-specific information */}
                      {activeTab === 'doctors' && (
                        <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                          🏥 {user.specialization} • 📄 License: {user.licenseNumber || user.license_number} • 💰 Fee: ₹{user.consultationFee || user.consultation_fee}
                        </div>
                      )}
                      {activeTab === 'employees' && (
                        <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                          🆔 {user.employeeId || user.employee_id} • 🏢 {user.department} • 💰 Salary: ₹{user.salary}
                        </div>
                      )}
                      {activeTab === 'partners' && (
                        <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                          📊 Profit Share: {user.profitSharePercentage || user.profit_share_percentage}% • 💰 Investment: ₹{user.investmentAmount || user.investment_amount}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(user)}
                        style={{
                          padding: '6px 12px',
                          background: colors.primary,
                          color: colors.textWhite,
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id, user.isActive || user.is_active || false)}
                        style={{
                          padding: '6px 12px',
                          background: (user.isActive || user.is_active) ? colors.warning : colors.success,
                          color: colors.textWhite,
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {(user.isActive || user.is_active) ? '⏸️ Deactivate' : '▶️ Activate'}
                      </button>
                      <div style={{ 
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: (user.isActive || user.is_active) ? colors.success : colors.error,
                        color: colors.textWhite
                      }}>
                        {(user.isActive || user.is_active) ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          color: colors.textPrimary,
          marginBottom: '4px',
          fontSize: '28px',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          Admin Panel
        </h2>
        <p style={{ 
          color: colors.textSecondary,
          fontSize: '16px',
          margin: 0
        }}>
          Manage users, settings, and configure your pharmacy
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
          color: messageType === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ 
        display: 'flex',
        gap: '4px',
        marginBottom: '24px',
        background: colors.bgCard,
        padding: '4px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        border: `1px solid ${colors.borderDark}`
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === tab.id ? colors.bgPrimary : 'transparent',
              color: activeTab === tab.id ? colors.textWhite : colors.textSecondary,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '16px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderForm()}
      {renderUsersList()}
    </div>
  );
};

export default AdminPanel;