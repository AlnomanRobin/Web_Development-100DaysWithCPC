import React, { useState } from 'react';
import { Link } from 'react-scroll';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-80 backdrop-blur-lg text-white z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                <div className="text-2xl font-bold">
                    <Link to="hero" smooth={true} duration={500}>
                        AL Noman Robin
                    </Link>
                </div>
                <nav className={`md:flex md:items-center ${isOpen ? 'block' : 'hidden'} md:block`}>
                    <ul className="flex flex-col md:flex-row md:space-x-6">
                        <li>
                            <Link to="projects" smooth={true} duration={500} className="hover:text-cyan-400">
                                Projects
                            </Link>
                        </li>
                        <li>
                            <Link to="about" smooth={true} duration={500} className="hover:text-cyan-400">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="contact" smooth={true} duration={500} className="hover:text-cyan-400">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>
                <button className="md:hidden" onClick={toggleMenu}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;