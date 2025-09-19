import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import { ADMIN_ROUTES } from '../utils/constant';
import LogoutButton from '../components/atoms/LogoutButton/LogoutButton';
import Button from '../components/atoms/Button/Button';
import {
  FaHome,
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaCog,
  FaEnvelope,
  FaUser,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaDumbbell,
  FaGlobe,
} from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';

interface INavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
}

const NavItem: React.FC<INavItemProps> = ({
  to,
  icon,
  label,
  active,
  collapsed
}) => (
  <Link
    to={to}
    className={`group relative flex items-center p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${active
        ? 'bg-gradient-to-r from-[#D1F2EB] to-[#E8F8F5] text-[#0E6655] shadow-lg shadow-[#1ABC9C]/10 border-l-4 border-[#1ABC9C]'
        : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#E8F8F5] hover:to-gray-50 hover:shadow-md hover:border-l-4 hover:border-[#1ABC9C]/30'
      } ${collapsed ? 'justify-center' : ''}`}
    title={collapsed ? label : ''}
  >
    <div className={`${!collapsed ? 'mr-3' : ''} relative`}>
      <div className={`p-2 rounded-lg transition-all duration-300 ${active
          ? 'bg-[#1ABC9C]/10 text-[#0E6655] scale-110'
          : 'bg-gray-100/50 text-gray-600 group-hover:bg-[#1ABC9C]/5 group-hover:text-[#0E6655] group-hover:scale-110'
        }`}>
        <span className="text-base">{icon}</span>
      </div>
      {active && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#1ABC9C] rounded-full animate-pulse border-2 border-white"></div>
      )}
    </div>
    {!collapsed && (
      <div className="flex-1 flex items-center justify-between">
        <span className={`font-medium transition-colors ${active ? 'text-[#0E6655]' : 'text-gray-700 group-hover:text-[#0E6655]'
          }`}>{label}</span>
        {active && (
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-[#1ABC9C] rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-[#1ABC9C] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-[#1ABC9C] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>
    )}
  </Link>
);

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthenticatedUser();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const navItems = [
    { to: ADMIN_ROUTES.PROFILE, icon: <FaUser />, label: 'Profile Information' },
    { to: ADMIN_ROUTES.EDUCATION, icon: <FaGraduationCap />, label: 'Education' },
    { to: ADMIN_ROUTES.EXPERIENCE, icon: <FaBriefcase />, label: 'Experience' },
    { to: ADMIN_ROUTES.PROJECTS, icon: <FaCode />, label: 'Projects' },
    { to: ADMIN_ROUTES.SKILL, icon: <FaDumbbell />, label: 'Skill' },
    { to: ADMIN_ROUTES.CONTACT_US, icon: <FaEnvelope />, label: 'Contact Us' },
    { to: ADMIN_ROUTES.SETTINGS, icon: <FaCog />, label: 'Settings' },
    { to: ADMIN_ROUTES.MAIN_SITE, icon: <FaGlobe />, label: 'Main Site' },
  ];

  const toggleSidebar = (): void => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = (): void => setCollapsed(!collapsed);

  const renderAddButton = (): React.ReactNode => {
    const currentPath = location.pathname;
    const currentNav = navItems.find(item => currentPath.startsWith(item.to));
    const showAddButton = ['Education', 'Experience', 'Projects', 'Skill']
      .includes(currentNav?.label || '');

    if (!showAddButton) return null;

    return (
      <Button
        variant="primaryContained"
        label={`Add ${currentNav?.label}`}
        onClick={() => navigate(`${currentNav?.to}/add`)}
        startIcon={getAddIcon(currentPath)}
        className="px-4 py-2"
      />
    );
  };

  const getAddIcon = (path: string): React.ReactNode => {
    if (path.startsWith('/admin/education')) return <FaGraduationCap />;
    if (path.startsWith('/admin/experience')) return <FaBriefcase />;
    if (path.startsWith('/admin/projects')) return <FaCode />;
    if (path.startsWith('/admin/skill')) return <FaDumbbell />;
    return <FiPlus />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-20 transition-opacity duration-300 ${sidebarOpen && isMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } lg:hidden`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="bg-[#1ABC9C] p-4 h-16 flex items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent"></div>
            <div className="ml-3 flex items-center w-full relative z-10">
              <div className="p-1 bg-white/10 rounded-lg">
                <FaHome className="text-2xl text-white" />
              </div>
              {!collapsed && (
                <div className="ml-4 flex flex-col">
                  <span className="text-2xl font-bold text-white tracking-wide drop-shadow-lg">Admin</span>
                  <span className="text-white/80 text-xs font-medium tracking-wider uppercase">Dashboard Portal</span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-transparent to-gray-50/30">
            {!collapsed && (
              <div className="mb-6 px-2">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-[#1ABC9C] rounded-full animate-pulse"></div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Navigation Menu
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <div
                  key={item.to}
                  className="transform transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'slideInLeft 0.6s ease-out forwards'
                  }}
                >
                  <NavItem
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    active={location.pathname.startsWith(item.to)}
                    collapsed={collapsed}
                  />
                </div>
              ))}
            </div>
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-gray-200 p-4 mt-auto bg-gray-50/50">
            {!collapsed && (
              <div className="mb-3 p-2 bg-white rounded-lg border-2 border-[#1ABC9C]/10 shadow-lg shadow-[#1ABC9C]/10">
                <div className="font-medium text-[#0E6655] truncate text-sm">
                  {user?.fullName}
                </div>
                <div className="text-xs text-[#0E6655] truncate">
                  {user?.email}
                </div>
              </div>
            )}
            <LogoutButton collapsed={collapsed} />
          </div>

          {/* Collapse button */}
          {!isMobile && <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0E6655] shadow-md transition-all duration-200 hover:bg-[#D1F2EB] hover:shadow-lg border border-gray-100"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <div className="transition-transform duration-200 hover:scale-110">
              {collapsed ? (
                <FaChevronRight size={12} />
              ) : (
                <FaChevronLeft size={12} />
              )}
            </div>
          </button>}
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center">
            <button
              className="mr-4 rounded-lg p-2 text-gray-500 hover:bg-[#E8F8F5] transition-colors duration-200 lg:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <FaBars />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-6 bg-[#1ABC9C] rounded-full"></div>
              <h1 className="text-xl font-semibold text-[#0E6655] tracking-wide">
                {navItems.find((item) => location.pathname.startsWith(item.to))
                  ?.label || 'Dashboard'}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {location.pathname.startsWith(ADMIN_ROUTES.PROFILE) && (
              <Button
                variant="primaryContained"
                label="Edit Profile"
                onClick={() => navigate(`${ADMIN_ROUTES.PROFILE}?mode=edit`)}
                className="px-4 py-2 transition-transform duration-200 hover:scale-105"
                startIcon={<FaUser />}
              />
            )}
            {renderAddButton()}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#D1F2EB] via-[#E8F8F5] to-[#1ABC9C] p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;