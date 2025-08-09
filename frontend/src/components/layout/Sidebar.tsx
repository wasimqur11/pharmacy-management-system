import React from 'react';
import { UserRole } from '../../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  userRole: UserRole;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: '📊',
    roles: [UserRole.ADMIN, UserRole.PHARMACIST, UserRole.DOCTOR, UserRole.PARTNER],
  },
  {
    id: 'consultations',
    label: 'Consultations',
    icon: '👨‍⚕️',
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PHARMACIST],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: '📦',
    roles: [UserRole.ADMIN, UserRole.PHARMACIST],
  },
  {
    id: 'sales',
    label: 'Point of Sale',
    icon: '🛒',
    roles: [UserRole.ADMIN, UserRole.PHARMACIST],
  },
  {
    id: 'patients',
    label: 'Patients',
    icon: '👥',
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PHARMACIST],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: '📈',
    roles: [UserRole.ADMIN, UserRole.PARTNER],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    roles: [UserRole.ADMIN],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, userRole }) => {
  const allowedItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-lg font-semibold">Navigation</h2>
      </div>
      
      <nav className="space-y-2">
        {allowedItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-3 ${
              activeView === item.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="mt-8 pt-8 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Role: <span className="capitalize text-gray-300">{userRole}</span>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;