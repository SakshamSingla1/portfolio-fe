import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import { ADMIN_ROUTES, MAIN_ROUTES } from '../utils/constant';
import LogoutButton from '../components/atoms/LogoutButton/LogoutButton';
import Button from '../components/atoms/Button/Button';
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
    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
      active
        ? 'bg-[#D1F2EB] text-[#0E6655]'
        : 'text-gray-700 hover:bg-[#E8F8F5]'
    } ${collapsed ? 'justify-center' : ''}`}
    title={collapsed ? label : ''}
  >
    <span className={`${!collapsed ? 'mr-3' : ''} text-lg`}>{icon}</span>
    {!collapsed && <span className="font-medium">{label}</span>}
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
    { to: MAIN_ROUTES.HOME, icon: <FaGlobe />, label: 'Main Site' },
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
        className={`fixed inset-0 z-20 transition-opacity duration-300 ${
          sidebarOpen && isMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } lg:hidden`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="bg-[#1ABC9C] p-4 h-16 flex items-center">
            <div className="ml-3 flex items-center w-full">
              <FaHome className="text-2xl text-white" />
              {!collapsed && (
                <span className="ml-3 text-xl font-bold text-white">Admin</span>
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
                <div className="font-medium text-gray-800 truncate">
                  {user?.fullName}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {user?.email}
                </div>
              </div>
            )}
            <LogoutButton collapsed={collapsed} />
          </div>

          {/* Collapse button */}
          { !isMobile && <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0E6655] shadow-md transition-colors duration-200 hover:bg-[#D1F2EB]"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <FaChevronRight size={12} />
            ) : (
              <FaChevronLeft size={12} />
            )}
          </button>}
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          collapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
          <div className="flex items-center">
            <button
              className="mr-4 rounded-lg p-2 text-gray-500 hover:bg-[#E8F8F5] lg:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <FaBars />
            </button>
            <h1 className="text-xl font-semibold text-[#0E6655]">
              {navItems.find((item) => location.pathname.startsWith(item.to))
                ?.label || 'Dashboard'}
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