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
  FaMoon, 
  FaSun,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import { ADMIN_ROUTES, MAIN_ROUTES } from '../utils/constant';
import LogoutButton from '../components/atoms/LogoutButton/LogoutButton';
import Button from '../components/atoms/Button/Button';


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
    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
      active
        ? 'bg-[#E7F6FE] text-[#2743A0]'  
        : 'text-gray-700 hover:bg-[#F2F2F2]'  
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
    { to: ADMIN_ROUTES.PROFILE, icon: <FaUser />, label: 'Profile' },
    { to: ADMIN_ROUTES.EDUCATION, icon: <FaGraduationCap />, label: 'Education' },
    { to: ADMIN_ROUTES.EXPERIENCE, icon: <FaBriefcase />, label: 'Experience' },
    { to: ADMIN_ROUTES.PROJECTS, icon: <FaCode />, label: 'Projects' },
    { to: ADMIN_ROUTES.SKILL, icon: <FaCode />, label: 'Skills' },
    { to: ADMIN_ROUTES.CONTACT_US, icon: <FaEnvelope />, label: 'Contact Us' },
    { to: MAIN_ROUTES.HOME, icon: <FaHome />, label: 'Main Site' },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <div className="flex h-screen bg-white transition-colors duration-200">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 bg-[#2743A0]">
            {!collapsed && (
              <div className="flex items-center">
                <FaHome className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold text-white">Admin</span>
              </div>
            )}
            {!collapsed && (
              <button
                className="rounded-lg p-1 text-white hover:bg-[#1E347B]"  
                onClick={toggleSidebar}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <div key={item.to} className="mb-2">
                <NavItem
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname === item.to}
                  collapsed={collapsed}
                />
              </div>
            ))}
          </nav>

          {/* User profile and settings */}
          <div className="border-t border-gray-200 p-4">
            {!collapsed && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <LogoutButton collapsed={collapsed} />
            </div>
          </div>
        </div>
        
        {/* Collapse button */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-1/2 h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center text-[#2743A0] hover:bg-[#E7F6FE] transition-colors duration-200"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main content */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
          <div className="flex items-center">
            <button
              className="mr-4 rounded-lg p-2 text-gray-500 hover:bg-[#E7F6FE] lg:hidden"
              onClick={toggleSidebar}
            >
              <FaBars />
            </button>
            <h1 className="text-xl font-semibold text-[#2743A0]">
              {navItems.find((item) => location.pathname.startsWith(item.to))?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {['Education', 'Experience', 'Projects', 'Skills'].includes(
              navItems.find((item) => location.pathname.startsWith(item.to))?.label || ''
            ) && (
              <Button
                variant="primaryContained"
                label={`+ Add ${
                  navItems.find((item) => location.pathname.startsWith(item.to))?.label
                }`}
                onClick={() =>
                  navigate(
                    `${navItems.find((item) => location.pathname.startsWith(item.to))?.to}/add`
                  )
                }
                className="px-4 py-2"
              />
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
