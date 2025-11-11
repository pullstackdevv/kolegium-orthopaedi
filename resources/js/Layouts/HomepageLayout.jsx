import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { 
    Menu,
    X,
    ChevronDown,
    Phone,
    Mail,
    MapPin
} from "lucide-react";
import { Icon } from "@iconify/react";
import { AuthProvider } from "../contexts/AuthContext";

export default function MarketplaceLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const { url } = usePage();

    const isActive = (path) => {
        return url === path || url.startsWith(path + '/');
    };

    const toggleDropdown = (dropdownName) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    return (
        <AuthProvider>
            <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <header className="bg-gray-50 shadow-sm sticky top-0 z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200">
                                <img src="/assets/icons/poboi.svg" alt="POBOI Logo" className="h-12 w-auto" 
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <img src="/assets/images/logos/kolegium.svg" alt="Kolegium Logo" className="h-12 w-auto"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            <Link 
                                href="/" 
                                className={`text-base font-medium transition-colors ${
                                    isActive('/') && url === '/' 
                                        ? 'text-blue-600' 
                                        : 'text-gray-700 hover:text-blue-600'
                                }`}
                            >
                                Home
                            </Link>
                            
                            {/* Profile Study Program Dropdown */}
                            <div className="relative group">
                                <button 
                                    className={`flex items-center gap-1 text-base font-medium transition-colors ${
                                        isActive('/profile-study-program') 
                                            ? 'text-blue-600' 
                                            : 'text-gray-700 hover:text-blue-600'
                                    }`}
                                >
                                    Profile Study Program
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <Link href="/profile-study-program/ppds1" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">PPDS 1</Link>
                                    <Link href="/profile-study-program/clinical-fellowship" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">Clinical Fellowship</Link>
                                    <Link href="/profile-study-program/subspesialis" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">Subspesialis</Link>
                                </div>
                            </div>

                            {/* <Link 
                                href="/resident" 
                                className={`text-base font-medium transition-colors ${
                                    isActive('/resident') 
                                        ? 'text-blue-600' 
                                        : 'text-gray-700 hover:text-blue-600'
                                }`}
                            >
                                Resident/Fellow/Trainee
                            </Link> */}

                            <Link 
                                href="/calendar-academic" 
                                className={`text-base font-medium transition-colors ${
                                    isActive('/calendar-academic') 
                                        ? 'text-blue-600' 
                                        : 'text-gray-700 hover:text-blue-600'
                                }`}
                            >
                                Calender Academic
                            </Link>

                            <Link 
                                href="/peer-group" 
                                className={`text-base font-medium transition-colors ${
                                    isActive('/peer-group') 
                                        ? 'text-blue-600' 
                                        : 'text-gray-700 hover:text-blue-600'
                                }`}
                            >
                                Peer Group
                            </Link> 

                            {/* About Us Dropdown */}
                            <div className="relative group">
                                <button 
                                    className={`flex items-center gap-1 text-base font-medium transition-colors ${
                                        isActive('/about') 
                                            ? 'text-blue-600' 
                                            : 'text-gray-700 hover:text-blue-600'
                                    }`}
                                >
                                    About Us
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                    <Link href="#vision-mission" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">Vision & Mission</Link>
                                    <Link href="#structure" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">Organization Structure</Link>
                                    <Link href="#contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">Contact Us</Link>
                                </div>
                            </div>
                        </nav>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 bg-white">
                        <div className="px-4 pt-2 pb-3 space-y-1">
                            <Link 
                                href="/" 
                                className={`block px-3 py-3 rounded-lg font-medium transition ${
                                    isActive('/') && url === '/' 
                                        ? 'text-blue-600 bg-blue-50' 
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            
                            {/* Mobile Profile Study Program */}
                            <div>
                                <button
                                    onClick={() => toggleDropdown('profile')}
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition"
                                >
                                    Profile Study Program
                                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'profile' ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === 'profile' && (
                                    <div className="pl-6 space-y-1 mt-1">
                                        <Link href="/profile-study-program/ppds1" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>PPDS 1</Link>
                                        <Link href="/profile-study-program/clinical-fellowship" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Clinical Fellowship</Link>
                                        <Link href="/profile-study-program/subspesialis" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Subspesialis</Link>
                                    </div>
                                )}
                            </div>

                            <Link href="#resident" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-lg font-medium transition" onClick={() => setIsMobileMenuOpen(false)}>Resident</Link>
                            <Link href="#calendar" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-lg font-medium transition" onClick={() => setIsMobileMenuOpen(false)}>Calender Academic</Link>
                            <Link href="/peer-group" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-lg font-medium transition" onClick={() => setIsMobileMenuOpen(false)}>Peer Group</Link>
                            
                            {/* Mobile About Us */}
                            <div>
                                <button
                                    onClick={() => toggleDropdown('about')}
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition"
                                >
                                    About Us
                                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'about' ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === 'about' && (
                                    <div className="pl-6 space-y-1 mt-1">
                                        <Link href="#vision-mission" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Vision & Mission</Link>
                                        <Link href="#structure" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Organization Structure</Link>
                                        <Link href="#contact" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-blue-100 to-blue-200">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Logo & Address Column */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <img src="/assets/icons/poboi.svg" alt="POBOI Logo" className="h-12 w-auto" 
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <img src="/assets/images/logos/kolegium.svg" alt="Kolegium Logo" className="h-12 w-auto"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                            <div className="text-sm text-gray-700 space-y-1">
                                <p className="font-semibold">Gedung Menara BCA, Lantai 8, Unit B</p>
                                <p>Jl. Senen Raya No 135-137, Senen</p>
                                <p>Jakarta Pusat 10410, INDONESIA</p>
                            </div>
                            <div className="text-sm text-gray-700 space-y-1">
                                <p className="font-semibold">Sekretariat:</p>
                                <p>H.T.R.I.K.M.M. (Gedung Kec. Kby, Baru, Kota Jakarta Selatan, Jakarta 12710, Indonesia</p>
                            </div>
                        </div>

                        {/* Menu Column */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Menu</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li><Link href="/" className="hover:text-blue-600 transition">Home</Link></li>
                                <li><Link href="#profile-study-program" className="hover:text-blue-600 transition">Profile Study Program</Link></li>
                                <li><Link href="#resident" className="hover:text-blue-600 transition">Resident</Link></li>
                                <li><Link href="#calendar-academic" className="hover:text-blue-600 transition">Calender Academic</Link></li>
                                <li><Link href="/peer-group" className="hover:text-blue-600 transition">Peer Group</Link></li>
                                <li><Link href="#about-us" className="hover:text-blue-600 transition">About Us</Link></li>
                                <li><Link href="/cms/login" className="hover:text-blue-600 transition">Login</Link></li>
                            </ul>
                        </div>

                        {/* Program Column */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Program</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li><Link href="/profile-study-program/ppds1" className="hover:text-blue-600 transition">PPDS 1</Link></li>
                                <li><Link href="/profile-study-program/clinical-fellowship" className="hover:text-blue-600 transition">Clinical Fellowship</Link></li>
                                <li><Link href="/profile-study-program/subspesialis" className="hover:text-blue-600 transition">Subspesialis</Link></li>
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li><a href="tel:+622138319351" className="hover:text-blue-600 transition">+62 21 383 9351</a></li>
                                <li><a href="tel:+6281283839351" className="hover:text-blue-600 transition">+62 812 8383 9351</a></li>
                                <li><a href="tel:+622138318658" className="hover:text-blue-600 transition">+62 21 383 18658</a></li>
                                <li className="mt-4"><a href="mailto:kolegiumorthopaediindonesia@gmail.com" className="hover:text-blue-600 transition break-all">kolegiumorthopaediindonesia@gmail.com</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright & Social Media */}
                    <div className="pt-6 border-t border-blue-300 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-700">
                            ©2025 E-Dashboard Pendidikan Orthopaedi dan Traumatologi Indonesia. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-700 hover:text-blue-600 transition">
                                <Icon icon="mdi:facebook" className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-700 hover:text-blue-600 transition">
                                <Icon icon="mdi:youtube" className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-700 hover:text-blue-600 transition">
                                <Icon icon="mdi:instagram" className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-700 hover:text-blue-600 transition">
                                <Icon icon="mdi:twitter" className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
            </div>
        </AuthProvider>
    );
}