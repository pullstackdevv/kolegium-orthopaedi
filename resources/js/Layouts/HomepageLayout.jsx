import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { 
    Menu,
    X,
    ChevronDown,
    Phone,
    Mail,
    MapPin,
    LayoutDashboard
} from "lucide-react";
import { Icon } from "@iconify/react";
import { AuthProvider } from "../contexts/AuthContext";

// Navigation Components
const NavLink = ({ href, active, children }) => (
    <Link 
        href={href}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            active 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
        }`}
    >
        {children}
    </Link>
);

const NavDropdown = ({ label, active, children }) => (
    <div className="relative group">
        <button 
            className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                active 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
        >
            {label}
            <ChevronDown className="w-4 h-4" />
        </button>
        <div className="absolute left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
            {children}
        </div>
    </div>
);

const DropdownLink = ({ href, children }) => (
    <Link 
        href={href}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
    >
        {children}
    </Link>
);

export default function MarketplaceLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const { url, props } = usePage();
    const { auth } = props;

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
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                            <img 
                                src="/assets/icons/koti-logo.svg" 
                                alt="POBOI Logo" 
                                className="h-14 w-auto" 
                                onError={(e) => e.target.style.display = 'none'}
                            />
                            <img 
                                src="/assets/images/logos/kolegium.svg" 
                                alt="Kolegium Logo" 
                                className="h-14 w-auto"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            <NavLink href="/" active={isActive('/') && url === '/'}>
                                Home
                            </NavLink>
                            
                            <NavDropdown 
                                label="Study Program Profile" 
                                active={isActive('/profile-study-program')}
                            >
                                {/* <DropdownLink href="/profile-study-program/ppds1">PPDS 1</DropdownLink>
                                <DropdownLink href="/profile-study-program/clinical-fellowship">Fellow</DropdownLink>
                                <DropdownLink href="/profile-study-program/subspesialis">Trainee</DropdownLink> */}
                                <DropdownLink href="/profile-study-program/ppds1">PPDS 1</DropdownLink>
                                <DropdownLink href="/profile-study-program/clinical-fellowship">Clinical Fellowship</DropdownLink>
                                <DropdownLink href="/profile-study-program/subspesialis">Subspesialis</DropdownLink>
                            </NavDropdown>

                            <NavDropdown 
                                label="Resident/Fellow/Trainee" 
                                active={isActive('/database-residents') || isActive('/database-fellows') || isActive('/database-trainees')}
                            >
                                <DropdownLink href="/database-residents">Residents</DropdownLink>
                                <DropdownLink href="/database-fellows">Fellows</DropdownLink>
                                <DropdownLink href="/database-trainees">Trainees</DropdownLink>
                            </NavDropdown>

                            <NavLink href="/peer-group" active={isActive('/peer-group')}>
                                Peer Group
                            </NavLink>

                            <NavLink href="/calendar-academic" active={isActive('/calendar-academic')}>
                                Academic Calendar
                            </NavLink>

                            <NavLink href="/about-us" active={isActive('/about-us')}>
                                About Us
                            </NavLink>

                            {auth?.user && (
                                <Link 
                                    href="/cms"
                                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors ml-2"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>CMS</span>
                                </Link>
                            )}
                        </nav>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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

                            {/* Mobile Database Members */}
                            <div>
                                <button
                                    onClick={() => toggleDropdown('database')}
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition"
                                >
                                    Resident/Fellow/Trainee
                                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'database' ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === 'database' && (
                                    <div className="pl-6 space-y-1 mt-1">
                                        <Link href="/database-residents" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Residents</Link>
                                        <Link href="/database-fellows" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Fellows</Link>
                                        <Link href="/database-trainees" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Trainees</Link>
                                    </div>
                                )}
                            </div>
                            <Link href="/peer-group" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-lg font-medium transition" onClick={() => setIsMobileMenuOpen(false)}>Peer Group</Link>
                            <Link href="/calendar-academic" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-lg font-medium transition" onClick={() => setIsMobileMenuOpen(false)}>Academic Calendar</Link>
                            <Link href="/about-us" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-lg font-medium transition" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                            
                            {auth?.user && (
                                <Link 
                                    href="/cms" 
                                    className="flex items-center gap-2 px-3 py-3 rounded-lg font-medium bg-gray-900 text-white hover:bg-gray-800 transition mt-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>CMS Dashboard</span>
                                </Link>
                            )}
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
                                <p>Gedung Menara Era, Lantai 8, Unit 8-04Jl. Senen Raya 135 – 137, Jakarta 10410, INDONESIA</p>
                            </div>
                            <div className="text-sm text-gray-700 space-y-1">
                                <p>Jl. Hang Jebat Blok F3, RT.5/RW.8, Gunung, Kec. Kby. Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12120, Indonesia</p>
                            </div>
                        </div>

                        {/* Menu Column */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Menu</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li><Link href="/" className="hover:text-blue-600 transition">Home</Link></li>
                                <li><Link href="/profile-study-program/ppds1" className="hover:text-blue-600 transition">Study Program Profile</Link></li>
                                <li><Link href="/database-residents" className="hover:text-blue-600 transition">Residents</Link></li>
                                <li><Link href="/database-fellows" className="hover:text-blue-600 transition">Fellows</Link></li>
                                <li><Link href="/database-trainees" className="hover:text-blue-600 transition">Trainees</Link></li>
                                <li><Link href="/calendar-academic" className="hover:text-blue-600 transition">Academic Calendar</Link></li>
                                <li><Link href="/peer-group" className="hover:text-blue-600 transition">Peer Group</Link></li>
                                <li><Link href="/about-us" className="hover:text-blue-600 transition">About Us</Link></li>
                                <li><Link href="/cms" className="hover:text-blue-600 transition">Login</Link></li>
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
                            ©️2025 E-Dashboard Indonesian Orthopaedic and Traumatology Education. All rights reserved.
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