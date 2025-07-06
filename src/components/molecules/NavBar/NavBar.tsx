import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles((theme:any)=>({
    title:{
        color: theme.palette.text.primary.primary200,
        '&:hover':{
            color: theme.palette.text.primary.primary300
        }
    },
    link:{
        backgroundColor: theme.palette.background.primary.primary400,
        color: theme.palette.text.primary.primary200,
        '&:hover':{
            color: theme.palette.text.primary.primary960
        }
    },
    tabs:{
        color: theme.palette.text.primary.primary200,
        '&:hover':{
            color: theme.palette.text.primary.primary300
        },
        '&.active':{
            color: theme.palette.text.primary.primary500
        }
    },
    navBar:{
        backgroundColor: theme.palette.background.primary.primary500,
        color: theme.palette.text.primary.primary200,
        '&:hover':{
            color: theme.palette.text.primary.primary960
        }
    }
}));

interface NavLinkProps {
    href: string;
    text: string;
    onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, text }) => {
    const location = useLocation();
    const classes = useStyles();
    const isActive = location.pathname === href;
    
    return (
        <RouterLink
            to={href}
            className={`relative text-lg font-medium transition-colors duration-300 ease-in-out px-3 py-2 ${
                isActive ? 'text-white' : 'text-gray-300 hover:text-white'
            }`}
        >
            {text}
            {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
            )}
        </RouterLink>
    );
};

const MobileNavLink: React.FC<NavLinkProps> = ({ href, text, onClick }) => {
    const location = useLocation();
    const classes = useStyles();
    const isActive = location.pathname === href;
    
    return (
        <RouterLink
            to={href}
            onClick={onClick}
            className={`block text-lg font-medium px-4 py-3 transition-colors duration-300 ease-in-out ${
                isActive 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
        >
            {text}
        </RouterLink>
    );
};

const NavBar: React.FC = () => {
    const classes = useStyles();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    const publicNavItems = [
        { href: '/', text: 'Home' },
        { href: '/projects', text: 'Projects' },
        { href: '/skills', text: 'Skills' },
        { href: '/about', text: 'About' },
    ];

    const adminNavItems = [
        { href: '/admin', text: 'Dashboard' },
        { href: '/admin/projects', text: 'Projects' },
        { href: '/admin/education', text: 'Education' },
        { href: '/admin/experience', text: 'Experience' },
        { href: '/admin/skill', text: 'Skills' },
        { href: '/admin/contact-us', text: 'Contact Us' },
    ];

    const navItems = isAdminRoute ? adminNavItems : publicNavItems;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    return (
        <nav 
            className={`${classes.navBar} p-4 shadow-2xl rounded-b-xl border-b mobile-menu-container`} 
        >
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <RouterLink 
                        to={isAdminRoute ? '/admin' : '/'} 
                        className={`${classes.title} text-3xl font-extrabold tracking-tight transition-colors duration-300 ease-in-out`} 
                    >
                        <span className="inline-block transform hover:scale-105 transition-transform duration-200">
                            {isAdminRoute ? 'Admin Panel' : 'YourName'}
                        </span>
                    </RouterLink>
                </div>

                <div className="md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className={`${classes.tabs} focus:outline-none transition-colors duration-300 ease-in-out p-2`}
                        aria-label="Toggle menu"
                    >
                        <svg 
                            className="w-6 h-6" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>

                <div className="hidden md:flex md:items-center space-x-8">
                    {navItems.map((item) => (
                        <NavLink key={item.href} href={item.href} text={item.text} />
                    ))}
                    
                    {!isAdminRoute && (
                        <RouterLink 
                            to="/contact" 
                            className={`${classes.link} ml-6 px-6 py-2 font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
                        >
                            Contact Me
                        </RouterLink>
                    )}
                    
                    {isAdminRoute && (
                        <RouterLink 
                            to="/" 
                            className={`${classes.link} ml-6 px-6 py-2 font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
                        >
                            View Site
                        </RouterLink>
                    )}
                </div>
            </div>

            <div
                className={`md:hidden mt-4 rounded-lg shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
                    isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                style={{ backgroundColor: '#27272a' }}
            >
                {navItems.map((item) => (
                    <MobileNavLink 
                        key={item.href} 
                        href={item.href} 
                        text={item.text} 
                        onClick={toggleMobileMenu} 
                    />
                ))}
                
                {!isAdminRoute ? (
                    <div className="px-4 py-3">
                        <RouterLink 
                            to="/contact" 
                            className={`${classes.link} block w-full text-center px-6 py-3 font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
                            onClick={toggleMobileMenu}
                        >
                            Contact Me
                        </RouterLink>
                    </div>
                ) : (
                    <div className="px-4 py-3">
                        <RouterLink 
                            to="/" 
                            className={`${classes.link} block w-full text-center px-6 py-3 font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
                            onClick={toggleMobileMenu}
                        >
                            View Site
                        </RouterLink>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;