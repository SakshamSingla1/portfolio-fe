import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { FaBars, FaTimes } from 'react-icons/fa';

interface NavLink {
    id: string;
    name: string;
    target: string;
}

const navLinks: NavLink[] = [
    { id: 'home', name: '01. Home', target: 'home' },
    { id: 'about', name: '02. About', target: 'about' },
    { id: 'projects', name: '03. Projects', target: 'projects' },
    { id: 'skills', name: '04. Skills', target: 'skills' },
    { id: 'contact', name: '05. Contact', target: 'contact' },
];

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Close mobile menu when clicking on a nav item
    const closeMobileMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                    ? 'bg-gray-900/90 backdrop-blur-md py-3 shadow-lg shadow-gray-900/50'
                    : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <ScrollLink
                        to="home"
                        spy={true}
                        smooth={true}
                        duration={500}
                        className="cursor-pointer flex-shrink-0"
                        onClick={closeMobileMenu}
                    >
                        <div className="w-10 h-10">
                            {/* <img
                                src={logo}
                                alt="Logo"
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                            /> */}
                        </div>
                    </ScrollLink>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <ScrollLink
                                    key={link.id}
                                    to={link.target}
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-70}
                                    className="font-mono text-sm text-gray-300 hover:text-teal-400 transition-colors duration-200 cursor-pointer relative group"
                                    activeClass="text-teal-400"
                                    onClick={closeMobileMenu}
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
                                </ScrollLink>
                            ))}
                            <a
                                href="/resume.pdf"
                                download
                                className="ml-6 px-4 py-2 font-mono text-sm border border-teal-400 text-teal-400 rounded hover:bg-teal-400/10 transition-all duration-200 hover:shadow-lg hover:shadow-teal-400/10 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:ring-offset-2 focus:ring-offset-gray-900/90"
                            >
                                RESUME
                            </a>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-300 hover:text-teal-400 focus:outline-none transition-colors duration-200"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <FaTimes size={24} />
                            ) : (
                                <FaBars size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/95">
                    {navLinks.map((link) => (
                        <ScrollLink
                            key={link.id}
                            to={link.target}
                            spy={true}
                            smooth={true}
                            duration={500}
                            offset={-70}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-teal-400 hover:bg-gray-800 transition-colors duration-200"
                            activeClass="text-teal-400 bg-gray-800"
                            onClick={closeMobileMenu}
                        >
                            {link.name}
                        </ScrollLink>
                    ))}
                    <a
                        href="/resume.pdf"
                        download
                        className="block px-3 py-2 rounded-md text-base font-medium text-center text-teal-400 border border-teal-400 hover:bg-teal-400/10 transition-colors duration-200 mt-2"
                        onClick={closeMobileMenu}
                    >
                        RESUME
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
