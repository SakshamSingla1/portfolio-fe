import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import { ADMIN_ROUTES } from '../utils/constant';
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
import { useColors } from '../utils/types';

interface INavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  colors: any;
}

const NavItem: React.FC<INavItemProps> = ({ to, icon, label, active, collapsed, colors}) => (
  <Link
    to={to}
    className={`group relative flex items-center p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]`}
    style={{
      background: active
        ? `linear-gradient(to right, ${colors.primary50}, ${colors.primary100})`
        : undefined,
      color: active ? colors.primary700 : colors.neutral800,
      justifyContent: collapsed ? 'center' : 'flex-start',
      borderLeft: active ? `4px solid ${colors.primary500}` : undefined,
    }}
    title={collapsed ? label : ''}
  >
    <div style={{ marginRight: collapsed ? 0 : '12px', position: 'relative' }}>
      <div
        style={{
          padding: '8px',
          borderRadius: '8px',
          background: active ? `${colors.primary500}20` : `${colors.neutral200}50`,
          color: active ? colors.primary700 : colors.neutral800,
          transform: active ? 'scale(1.1)' : undefined,
          transition: 'all 0.3s',
        }}
      >
        {icon}
      </div>
      {active && (
        <div
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 12,
            height: 12,
            backgroundColor: colors.primary500,
            borderRadius: '50%',
            border: `2px solid ${colors.neutral50}`,
            animation: 'pulse 1s infinite',
          }}
        />
      )}
    </div>
    {!collapsed && (
      <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 500, color: active ? colors.primary700 : colors.neutral800 }}>
          {label}
        </span>
        {active && (
          <div style={{ display: 'flex', gap: 2 }}>
            <div style={{ width: 4, height: 4, backgroundColor: colors.primary500, borderRadius: '50%', animation: 'pulse 1s infinite' }} />
            <div style={{ width: 4, height: 4, backgroundColor: colors.primary500, borderRadius: '50%', animation: 'pulse 1s infinite', animationDelay: '0.2s' }} />
            <div style={{ width: 4, height: 4, backgroundColor: colors.primary500, borderRadius: '50%', animation: 'pulse 1s infinite', animationDelay: '0.4s' }} />
          </div>
        )}
      </div>
    )}
  </Link>
);

const AdminLayout: React.FC = () => {
  const colors = useColors();
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
      setSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  const renderAddButton = () => {
    const currentPath = location.pathname;
    const currentNav = navItems.find(item => currentPath.startsWith(item.to));
    const showAddButton = ['Education', 'Experience', 'Projects', 'Skill'].includes(currentNav?.label || '');
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

  const getAddIcon = (path: string) => {
    if (path.startsWith('/admin/education')) return <FaGraduationCap />;
    if (path.startsWith('/admin/experience')) return <FaBriefcase />;
    if (path.startsWith('/admin/projects')) return <FaCode />;
    if (path.startsWith('/admin/skill')) return <FaDumbbell />;
    return <FiPlus />;
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: colors.neutral50 }}>
      {/* Mobile backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 20,
          opacity: sidebarOpen && isMobile ? 1 : 0,
          pointerEvents: sidebarOpen && isMobile ? 'auto' : 'none',
          transition: 'opacity 0.3s',
          backgroundColor: 'rgba(0,0,0,0.2)',
        }}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 30,
          width: collapsed ? 80 : 256,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'all 0.3s ease-in-out',
          backgroundColor: colors.neutral50,
          boxShadow: `0 4px 12px ${colors.neutral200}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <div style={{ height: 64, backgroundColor: colors.primary500, padding: 16, display: 'flex', alignItems: 'center' }}>
          <FaHome size={28} color={colors.neutral50} />
          {!collapsed && (
            <div style={{ marginLeft: 12, color: colors.neutral50 }}>
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>Admin</div>
              <div style={{ fontSize: 12 }}>Dashboard Portal</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {navItems.map((item) => (
            <div key={item.to} style={{ marginBottom: 8 }}>
              <NavItem
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname.startsWith(item.to)}
                collapsed={collapsed}
                colors={colors}
              />
            </div>
          ))}
        </nav>

        {/* User info & logout */}
        <div style={{ padding: 16, borderTop: `1px solid ${colors.neutral200}` }}>
          {!collapsed && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 500, color: colors.primary700 }}>{user?.fullName}</div>
              <div style={{ fontSize: 12, color: colors.primary700 }}>{user?.email}</div>
            </div>
          )}
        </div>

        {/* Collapse button */}
        {!isMobile && (
          <button
            onClick={toggleCollapse}
            style={{
              position: 'absolute',
              top: '50%',
              right: -12,
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: colors.neutral50,
              border: `1px solid ${colors.neutral200}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transform: 'translateY(-50%)',
            }}
          >
            {collapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
          </button>
        )}
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: collapsed ? 80 : 256, transition: 'margin 0.3s' }}>
        {/* Topbar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64, padding: '0 16px', borderBottom: `1px solid ${colors.neutral200}`, backgroundColor: colors.neutral50 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={toggleSidebar}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}
            >
              <FaBars color={colors.neutral800} />
            </button>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: colors.primary700 }}>
              {navItems.find(item => location.pathname.startsWith(item.to))?.label || 'Dashboard'}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {location.pathname.startsWith(ADMIN_ROUTES.PROFILE) && (
              <Button
                variant="primaryContained"
                label="Edit Profile"
                onClick={() => navigate(`${ADMIN_ROUTES.PROFILE}?mode=EDIT`)}
              />
            )}
            {renderAddButton()}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 24, overflowY: 'auto', background: `linear-gradient(to bottom right, ${colors.primary50}, ${colors.primary100}, ${colors.primary500})` }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
