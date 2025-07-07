import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  FaHome,
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaEnvelope,
  FaUser,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaDumbbell,
  FaGlobe,
} from 'react-icons/fa';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import { ADMIN_ROUTES, MAIN_ROUTES } from '../utils/constant';
import LogoutButton from '../components/atoms/LogoutButton/LogoutButton';
import Button from '../components/atoms/Button/Button';
import { FiPlus } from 'react-icons/fi';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active, collapsed }) => (
  <Link
    to={to}
    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${active
        ? 'bg-[#D1F2EB] text-[#0E6655]'  // primary100 for bg, primary800 for text
        : 'text-gray-700 hover:bg-[#E8F8F5]'  // primary50 for hover
      } ${collapsed ? 'justify-center' : ''}`}
    title={collapsed ? label : ''}
  >
    <span className={`${!collapsed ? 'mr-3' : ''} text-lg`}>{icon}</span>
    {!collapsed && <span className="font-medium">{label}</span>}
  </Link>
);

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const { user } = useAuthenticatedUser();
  const location = useLocation();

  const navItems = [
    { to: ADMIN_ROUTES.PROFILE, icon: <FaUser />, label: 'Profile Information' },
    { to: ADMIN_ROUTES.EDUCATION, icon: <FaGraduationCap />, label: 'Education' },
    { to: ADMIN_ROUTES.EXPERIENCE, icon: <FaBriefcase />, label: 'Experience' },
    { to: ADMIN_ROUTES.PROJECTS, icon: <FaCode />, label: 'Projects' },
    { to: ADMIN_ROUTES.SKILL, icon: <FaDumbbell />, label: 'Skills' },
    { to: ADMIN_ROUTES.CONTACT_US, icon: <FaEnvelope />, label: 'Contact Us' },
    { to: MAIN_ROUTES.HOME, icon: <FaGlobe />, label: 'Main Site' },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="bg-[#1ABC9C] p-4 h-16">
            <div className="flex items-center">
              <FaHome className="text-2xl text-white" />
              {!collapsed && (
                <span className="ml-2 text-xl font-bold text-white">Admin</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {navItems.map((item) => (
              <div key={item.to} className="mb-2">
                <NavItem
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname.startsWith(item.to)}
                  collapsed={collapsed}
                />
              </div>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-gray-200 p-4 mt-auto">
            {!collapsed && (
              <div className="mb-3">
                <div className="font-medium text-gray-800 truncate">{user?.fullName}</div>
                <div className="text-sm text-gray-500 truncate">{user?.email}</div>
              </div>
            )}
            <LogoutButton collapsed={collapsed} />
          </div>

          {/* Collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0E6655] shadow-md transition-colors duration-200 hover:bg-[#D1F2EB]"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}>
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
          <div className="flex items-center">
            <button
              className="mr-4 rounded-lg p-2 text-gray-500 hover:bg-[#E8F8F5] lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>
            <h1 className="text-xl font-semibold text-[#0E6655]">
              {navItems.find((item) => location.pathname.startsWith(item.to))?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {location.pathname.startsWith(ADMIN_ROUTES.PROFILE) && (
              <Button
                variant="primaryContained"
                label="Edit Profile"
                onClick={() => navigate(`${ADMIN_ROUTES.PROFILE}?mode=edit`)}
                className="px-4 py-2"
                startIcon={<FaUser />}
              />
            )}
            {['Education', 'Experience', 'Projects', 'Skills'].includes(
              navItems.find((item) => location.pathname.startsWith(item.to))?.label || ''
            ) && (
                <Button
                  variant="primaryContained"
                  label={`Add ${navItems.find((item) => location.pathname.startsWith(item.to))?.label
                    }`}
                  onClick={() =>
                    navigate(
                      `${navItems.find((item) => location.pathname.startsWith(item.to))?.to}/add`
                    )
                  }
                  startIcon={<FiPlus />}
                  className="px-4 py-2"
                />
              )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#E8F8F5] via-white to-[#D1F2EB] p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
