import React, { useState, useEffect } from 'react';
import './App.css';
import AdminPanel from './components/AdminPanel';

// Modern color palette and design system
const colors = {
  primary: '#667eea',
  primaryDark: '#5a67d8',
  secondary: '#764ba2',
  accent: '#f093fb',
  success: '#48bb78',
  warning: '#ed8936',
  error: '#f56565',
  
  // Backgrounds
  bgPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  bgCard: 'rgba(255, 255, 255, 0.95)',
  bgOverlay: 'rgba(255, 255, 255, 0.1)',
  
  // Text
  textPrimary: '#2d3748',
  textSecondary: '#4a5568',
  textLight: '#a0aec0',
  textWhite: '#ffffff',
  
  // Borders
  border: 'rgba(255, 255, 255, 0.2)',
  borderDark: '#e2e8f0'
};

// Simple Login Component
const LoginForm = ({ onLogin, loading }: { onLogin: (email: string, password: string) => void, loading: boolean }) => {
  const [email, setEmail] = useState('admin@pharmacy.com');
  const [password, setPassword] = useState('password');
  const [connectionStatus, setConnectionStatus] = useState('');

  const testConnection = async () => {
    setConnectionStatus('Testing...');
    try {
      const response = await fetch('http://localhost:5001/health');
      const data = await response.json();
      setConnectionStatus(`✅ Backend connected: ${data.status}`);
    } catch (err) {
      setConnectionStatus('❌ Backend not reachable');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: colors.bgPrimary,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '20px'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '80px',
        height: '80px',
        background: colors.bgOverlay,
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '120px',
        height: '120px',
        background: colors.bgOverlay,
        borderRadius: '50%',
        animation: 'float 4s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '20%',
        width: '100px',
        height: '100px',
        background: colors.bgOverlay,
        borderRadius: '50%',
        animation: 'float 5s ease-in-out infinite'
      }} />

      <div style={{ 
        background: colors.bgCard,
        padding: '50px 40px', 
        borderRadius: '24px', 
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        width: '100%',
        maxWidth: '420px',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            background: colors.bgPrimary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🏥
          </div>
          <h1 style={{ 
            color: colors.textPrimary, 
            marginBottom: '8px',
            fontSize: '28px',
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            Pharmacy Management
          </h1>
          <p style={{ 
            color: colors.textSecondary, 
            fontSize: '16px',
            fontWeight: '400'
          }}>
            Welcome back! Please sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              color: colors.textPrimary, 
              fontWeight: '600', 
              marginBottom: '8px',
              fontSize: '14px',
              letterSpacing: '0.5px'
            }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: `2px solid ${colors.borderDark}`,
                borderRadius: '12px',
                fontSize: '16px',
                color: colors.textPrimary,
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = `0 0 0 3px rgba(102, 126, 234, 0.1)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.borderDark;
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              color: colors.textPrimary, 
              fontWeight: '600', 
              marginBottom: '8px',
              fontSize: '14px',
              letterSpacing: '0.5px'
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: `2px solid ${colors.borderDark}`,
                borderRadius: '12px',
                fontSize: '16px',
                color: colors.textPrimary,
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = `0 0 0 3px rgba(102, 126, 234, 0.1)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.borderDark;
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? colors.textLight : colors.bgPrimary,
              color: colors.textWhite,
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              transition: 'all 0.3s ease',
              transform: loading ? 'none' : 'translateY(-2px)',
              boxShadow: loading ? 'none' : '0 8px 25px rgba(102, 126, 234, 0.3)'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={{ 
          marginTop: '32px', 
          padding: '20px', 
          background: colors.bgOverlay,
          borderRadius: '12px',
          fontSize: '14px',
          color: colors.textSecondary,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ color: colors.textPrimary, fontWeight: '600', marginBottom: '8px' }}>
            Demo Credentials:
          </div>
          <div style={{ fontFamily: 'Monaco, Consolas, monospace', fontSize: '13px' }}>
            Email: admin@pharmacy.com<br />
            Password: password
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            type="button"
            onClick={testConnection}
            style={{
              padding: '12px 24px',
              background: `linear-gradient(135deg, ${colors.success} 0%, #38a169 100%)`,
              color: colors.textWhite,
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '12px',
              transition: 'all 0.3s ease',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(72, 187, 120, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(72, 187, 120, 0.3)';
            }}
          >
            🔗 Test Backend Connection
          </button>
          {connectionStatus && (
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              color: connectionStatus.includes('✅') ? colors.success : colors.error,
              marginTop: '8px'
            }}>
              {connectionStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'admin'>('dashboard');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        background: colors.bgCard,
        padding: '16px 32px', 
        borderBottom: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            fontSize: '28px',
            background: colors.bgPrimary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🏥
          </div>
          <h1 style={{ 
            color: colors.textPrimary, 
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            Pharmacy Management
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Navigation for Admin */}
          {user.role === 'admin' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveView('dashboard')}
                style={{
                  padding: '8px 16px',
                  background: activeView === 'dashboard' ? colors.bgPrimary : 'transparent',
                  color: activeView === 'dashboard' ? colors.textWhite : colors.textSecondary,
                  border: activeView === 'dashboard' ? 'none' : `1px solid ${colors.borderDark}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveView('admin')}
                style={{
                  padding: '8px 16px',
                  background: activeView === 'admin' ? colors.bgPrimary : 'transparent',
                  color: activeView === 'admin' ? colors.textWhite : colors.textSecondary,
                  border: activeView === 'admin' ? 'none' : `1px solid ${colors.borderDark}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                ⚙️ Admin
              </button>
            </div>
          )}
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              color: colors.textPrimary, 
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Welcome, {user.firstName} {user.lastName}
            </div>
            <div style={{ 
              color: colors.textSecondary, 
              fontSize: '12px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {user.role}
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: `linear-gradient(135deg, ${colors.error} 0%, #e53e3e 100%)`,
              color: colors.textWhite,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(245, 101, 101, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(245, 101, 101, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(245, 101, 101, 0.3)';
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeView === 'admin' ? (
        <AdminPanel />
      ) : (
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ 
              color: colors.textPrimary, 
              marginBottom: '4px',
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}>
              Dashboard
            </h2>
            <p style={{ 
              color: colors.textSecondary, 
              fontSize: '14px',
              margin: 0
            }}>
              Overview of your pharmacy operations
            </p>
          </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { title: 'Today\'s Sales', value: '₹0', icon: '💰', color: colors.success, subtitle: 'vs yesterday' },
            { title: 'Consultations', value: '0', icon: '👨‍⚕️', color: colors.primary, subtitle: 'scheduled today' },
            { title: 'Low Stock Items', value: '0', icon: '📦', color: colors.warning, subtitle: 'need reorder' },
            { title: 'Pending Orders', value: '0', icon: '⏳', color: colors.secondary, subtitle: 'awaiting delivery' }
          ].map((item, index) => (
            <div key={item.title} style={{ 
              background: colors.bgCard,
              padding: '20px 16px', 
              borderRadius: '16px',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.borderDark}`,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.08)';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ 
                  fontSize: '24px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}40 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </div>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: '700', 
                  color: colors.textPrimary,
                  letterSpacing: '-0.5px'
                }}>
                  {item.value}
                </div>
              </div>
              <h3 style={{ 
                color: colors.textPrimary, 
                fontSize: '14px', 
                marginBottom: '2px', 
                fontWeight: '600',
                letterSpacing: '0px'
              }}>
                {item.title}
              </h3>
              <p style={{ 
                color: colors.textSecondary, 
                fontSize: '12px', 
                margin: 0,
                fontWeight: '500'
              }}>
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px'
        }}>
          {/* Quick Actions */}
          <div style={{ 
            background: colors.bgCard,
            padding: '24px', 
            borderRadius: '16px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${colors.borderDark}`
          }}>
            <h3 style={{ 
              color: colors.textPrimary, 
              marginBottom: '16px',
              fontSize: '18px',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}>
              Quick Actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              {[
                { name: 'New Sale', icon: '🛒', color: colors.primary },
                { name: 'Add Product', icon: '📝', color: colors.success },
                { name: 'Book Consultation', icon: '🩺', color: colors.secondary },
                { name: 'View Reports', icon: '📊', color: colors.warning }
              ].map((action) => (
                <button
                  key={action.name}
                  style={{
                    padding: '14px 18px',
                    background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}CC 100%)`,
                    color: colors.textWhite,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0px)',
                    boxShadow: `0 4px 16px ${action.color}30`
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = `0 6px 20px ${action.color}40`;
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = `0 4px 16px ${action.color}30`;
                  }}
                  onClick={() => alert(`${action.name} - Coming soon!`)}
                >
                  <span style={{ fontSize: '18px' }}>{action.icon}</span>
                  {action.name}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ 
            background: colors.bgCard,
            padding: '24px', 
            borderRadius: '16px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${colors.borderDark}`
          }}>
            <h3 style={{ 
              color: colors.textPrimary, 
              marginBottom: '16px',
              fontSize: '18px',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}>
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { action: 'Sale completed', time: '2 min ago', type: 'success' },
                { action: 'New patient registered', time: '5 min ago', type: 'info' },
                { action: 'Stock low alert', time: '10 min ago', type: 'warning' },
                { action: 'Consultation scheduled', time: '15 min ago', type: 'info' }
              ].map((activity, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '8px 0',
                  borderBottom: index < 3 ? `1px solid ${colors.borderDark}` : 'none'
                }}>
                  <div style={{ 
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: activity.type === 'success' ? colors.success : 
                                   activity.type === 'warning' ? colors.warning : colors.primary,
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: '500',
                      color: colors.textPrimary 
                    }}>
                      {activity.action}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: colors.textSecondary 
                    }}>
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login to:', 'http://localhost:5001/api/auth/login');
      console.log('Request data:', { email, password: '***' });

      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success && data.data) {
        setUser(data.data.user);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        console.log('Login successful!');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to server. Please check if backend is running on port 5001.');
      } else {
        setError(err.message || 'Connection to server failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Check for existing login on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div>
      <LoginForm onLogin={handleLogin} loading={loading} />
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#e74c3c',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default App;
