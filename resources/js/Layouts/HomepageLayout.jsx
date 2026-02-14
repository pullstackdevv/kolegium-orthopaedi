import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { 
    Menu,
    X,
    ChevronDown,
    Phone,
    Mail,
    MapPin,
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    ArrowRight
} from "lucide-react";
import { Icon } from "@iconify/react";
import { AuthProvider } from "../contexts/AuthContext";

// Navigation Components
const NavLink = ({ href, active, children }) => (
    <Link 
        href={href}
        className={`p-2 text-[13px] font-semibold tracking-wide uppercase transition-all duration-200 ${
            active 
                ? 'text-primary' 
                : 'text-slate-600 hover:text-secondary'
        }`}
    >
        {children}
    </Link>
);

const NavDropdown = ({ label, active, children }) => (
    <div className="relative group">
        <button 
            className={`flex items-center gap-1 px-4 py-2 text-[13px] font-semibold tracking-wide uppercase transition-all duration-200 ${
                active 
                    ? 'text-primary' 
                    : 'text-slate-600 hover:text-secondary'
            }`}
        >
            {label}
            <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
        </button>
        <div className="absolute left-0 mt-[18px] w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white rounded-none shadow-2xl border border-primary/10 border-t-[6px] border-t-primary py-3 z-50">
            <div className="space-y-0">
                {children}
            </div>
        </div>
    </div>
);

const DropdownLink = ({ href, children }) => (
    <Link 
        href={href}
        className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-secondary/10 hover:text-secondary transition"
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
            <header className="bg-white shadow-md sticky top-0 z-50">
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
                                <DropdownLink href="/profile-study-program/ppds1">PPDS 1</DropdownLink>
                                <DropdownLink href="/profile-study-program/clinical-fellowship">Clinical Fellowship</DropdownLink>
                                <DropdownLink href="/profile-study-program/subspesialis">Subspecialist</DropdownLink>
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
                            className="lg:hidden p-2 rounded-md text-slate-600 hover:text-secondary hover:bg-secondary/10 transition"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="lg-hidden border-t border-gray-200 bg-white text-slate-700">
                        <div className="px-4 pt-2 pb-3 space-y-1">
                            <Link 
                                href="/" 
                                className={`block px-3 py-3 rounded-lg font-semibold tracking-wide uppercase transition ${
                                    isActive('/') && url === '/' 
                                        ? 'text-primary bg-primary/10 border border-primary/20' 
                                        : 'text-slate-600 hover:text-secondary hover:bg-secondary/10 border border-transparent'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            
                            {/* Mobile Profile Study Program */}
                            <div>
                                <button
                                    onClick={() => toggleDropdown('profile')}
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg font-semibold tracking-wide uppercase text-[#254D95] hover:text-[#34A1F4] hover:bg-[#34A1F4]/10 transition"
                                >
                                    Profile Study Program
                                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'profile' ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === 'profile' && (
                                    <div className="pl-6 space-y-1 mt-1">
                                        <Link href="/profile-study-program/ppds1" className="block px-3 py-2 text-sm text-slate-600 hover:text-[#34A1F4] hover:bg-[#34A1F4]/10 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>PPDS 1</Link>
                                        <Link href="/profile-study-program/clinical-fellowship" className="block px-3 py-2 text-sm text-slate-600 hover:text-[#34A1F4] hover:bg-[#34A1F4]/10 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Clinical Fellowship</Link>
                                        <Link href="/profile-study-program/subspecialist" className="block px-3 py-2 text-sm text-slate-600 hover:text-[#34A1F4] hover:bg-[#34A1F4]/10 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Subspecialist</Link>
                                        <Link href="/profile-study-program/ppds1" className="block px-3 py-2 text-sm text-slate-600 hover:text-secondary hover:bg-secondary/10 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>PPDS 1</Link>
                                        <Link href="/profile-study-program/clinical-fellowship" className="block px-3 py-2 text-sm text-slate-600 hover:text-secondary hover:bg-secondary/10 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Clinical Fellowship</Link>
                                        <Link href="/profile-study-program/subspecialist" className="block px-3 py-2 text-sm text-slate-600 hover:text-secondary hover:bg-secondary/10 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Subspecialist</Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Database Members */}
                            <div>
                                <button
                                    onClick={() => toggleDropdown('database')}
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg font-semibold tracking-wide uppercase text-primary hover:text-secondary hover:bg-secondary/10 transition"
                                >
                                    Resident/Fellow/Trainee
                                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'database' ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === 'database' && (
                                    <div className="pl-6 space-y-1 mt-1">
                                        <Link href="/database-residents" className="block px-3 py-2 text-sm text-slate-600 hover:text-secondary hover:bg-secondary/10 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Residents</Link>
                                        <Link href="/database-fellows" className="block px-3 py-2 text-sm text-slate-600 hover:text-secondary hover:bg-secondary/10 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Fellows</Link>
                                        <Link href="/database-trainees" className="block px-3 py-2 text-sm text-slate-600 hover:text-secondary hover:bg-secondary/10 rounded-lg transition" onClick={() => setIsMobileMenuOpen(false)}>Trainees</Link>
                                    </div>
                                )}
                            </div>
                            <Link href="/peer-group" className="block px-3 py-3 rounded-lg font-semibold tracking-wide uppercase text-slate-600 hover:text-secondary hover:bg-secondary/10 transition" onClick={() => setIsMobileMenuOpen(false)}>Peer Group</Link>
                            <Link href="/calendar-academic" className="block px-3 py-3 rounded-lg font-semibold tracking-wide uppercase text-slate-600 hover:text-secondary hover:bg-secondary/10 transition" onClick={() => setIsMobileMenuOpen(false)}>Academic Calendar</Link>
                            <Link href="/about-us" className="block px-3 py-3 rounded-lg font-semibold tracking-wide uppercase text-slate-600 hover:text-secondary hover:bg-secondary/10 transition" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                            
                            {auth?.user && (
                                <Link 
                                    href="/cms" 
                                    className="flex items-center gap-2 px-3 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-secondary transition mt-2"
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
            <footer className="bg-gradient-to-b from-primary/90 via-primary to-gray-900">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        {/* Logo & Address Column */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6 px-4 py-3">
                                <img src="/assets/icons/poboi.svg" alt="POBOI Logo" className="h-14 w-auto" 
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <img src="/assets/images/logos/kolegium.svg" alt="Kolegium Logo" className="h-14 w-auto"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                            <div className="text-sm text-white/85 space-y-3 leading-relaxed">
                                <div>
                                    <p>Gedung Menara Era, Lantai 8, Unit 8-04 Jl. Senen Raya 135 – 137, Jakarta 10410, INDONESIA</p>
                                </div>
                                <div>
                                    <p>Jl. Hang Jebat Blok F3, RT.5/RW.8, Gunung, Kec. Kby. Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12120, Indonesia</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Column */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b-2 border-secondary/50">Menu</h3>
                            <ul className="space-y-3 text-sm text-white/80">
                                <li><Link href="/" className="hover:text-secondary transition duration-300 font-medium">Home</Link></li>
                                <li><Link href="/profile-study-program/ppds1" className="hover:text-secondary transition duration-300 font-medium">Study Program Profile</Link></li>
                                <li><Link href="/database-residents" className="hover:text-secondary transition duration-300 font-medium">Residents</Link></li>
                                <li><Link href="/database-fellows" className="hover:text-secondary transition duration-300 font-medium">Fellows</Link></li>
                                <li><Link href="/database-trainees" className="hover:text-secondary transition duration-300 font-medium">Trainees</Link></li>
                                <li><Link href="/calendar-academic" className="hover:text-secondary transition duration-300 font-medium">Academic Calendar</Link></li>
                                <li><Link href="/peer-group" className="hover:text-secondary transition duration-300 font-medium">Peer Group</Link></li>
                                <li><Link href="/about-us" className="hover:text-secondary transition duration-300 font-medium">About Us</Link></li>
                                <li><Link href="/cms" className="hover:text-secondary transition duration-300 font-medium">Login</Link></li>
                            </ul>
                        </div>

                        {/* Program Column */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b-2 border-secondary/50">Program</h3>
                            <ul className="space-y-3 text-sm text-white/80">
                                <li><Link href="/profile-study-program/ppds1" className="hover:text-secondary transition duration-300 font-medium">PPDS 1</Link></li>
                                <li><Link href="/profile-study-program/clinical-fellowship" className="hover:text-secondary transition duration-300 font-medium">Clinical Fellowship</Link></li>
                                <li><Link href="/profile-study-program/subspecialist" className="hover:text-secondary transition duration-300 font-medium">Subspecialist</Link></li>
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b-2 border-secondary/50">Contact</h3>
                            <ul className="space-y-3 text-sm text-white/80">
                                <li>
                                    <a href="tel:+622138319351" className="hover:text-secondary transition duration-300 font-medium flex items-center gap-2">
                                        <Icon icon="mdi:phone" className="w-4 h-4" />
                                        +62 21 383 9351
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+6281283839351" className="hover:text-secondary transition duration-300 font-medium flex items-center gap-2">
                                        <Icon icon="mdi:phone" className="w-4 h-4" />
                                        +62 812 8383 9351
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+622138318658" className="hover:text-secondary transition duration-300 font-medium flex items-center gap-2">
                                        <Icon icon="mdi:phone" className="w-4 h-4" />
                                        +62 21 383 18658
                                    </a>
                                </li>
                                <li className="mt-4">
                                    <a href="mailto:kolegiumorthopaediindonesia@gmail.com" className="hover:text-secondary transition duration-300 font-medium flex items-center gap-2 break-all">
                                       <span>
                                        kolegiumorthopaediindonesia@gmail.com
                                       </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/20 my-8"></div>

                    {/* Copyright & Social Media */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm text-white/75 text-center md:text-left">
                            © 2025 E-Dashboard Indonesian Orthopaedic and Traumatology Education. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-white/70 hover:text-secondary transition duration-300 hover:scale-110 transform">
                                <Icon icon="mdi:facebook" className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-white/70 hover:text-secondary transition duration-300 hover:scale-110 transform">
                                <Icon icon="mdi:youtube" className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-white/70 hover:text-secondary transition duration-300 hover:scale-110 transform">
                                <Icon icon="mdi:instagram" className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-white/70 hover:text-secondary transition duration-300 hover:scale-110 transform">
                                <Icon icon="mdi:twitter" className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
            </div>
        </AuthProvider>
    );
}