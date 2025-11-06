import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { 
    Menu,
    X,
    Phone,
    Mail,
    MapPin,
    Award,
    Users,
    BookOpen,
    Heart
} from "lucide-react";
import { Icon } from "@iconify/react";
import { AuthProvider } from "../contexts/AuthContext";

export default function MarketplaceLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <AuthProvider>
            <div className="min-h-screen bg-white">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-6 text-center sm:text-left">
                            <a href="tel:+62274515151" className="flex items-center justify-center sm:justify-start gap-2 hover:opacity-80 transition">
                                <Phone className="h-4 w-4" />
                                <span>(0274) 515151</span>
                            </a>
                            <a href="mailto:info@kolegium.ac.id" className="flex items-center justify-center sm:justify-start gap-2 hover:opacity-80 transition">
                                <Mail className="h-4 w-4" />
                                <span>info@kolegium.ac.id</span>
                            </a>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="hover:opacity-80 transition"><Icon icon="mdi:facebook" className="w-5 h-5" /></a>
                            <a href="#" className="hover:opacity-80 transition"><Icon icon="mdi:instagram" className="w-5 h-5" /></a>
                            <a href="#" className="hover:opacity-80 transition"><Icon icon="mdi:twitter" className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
                                <div className="flex items-center gap-2">
                                    <img src="/assets/icons/poboi.svg" alt="POBOI Logo" className="h-10 sm:h-12 w-auto" />
                                    <img src="/assets/images/logos/kolegium.svg" alt="Kolegium Logo" className="h-10 sm:h-12 w-auto" />
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Beranda</Link>
                            <Link href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition">Tentang</Link>
                            <Link href="#programs" className="text-gray-700 hover:text-blue-600 font-medium transition">Program</Link>
                            <Link href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition">Kontak</Link>
                        </nav>

                        {/* Right side - Auth Links */}
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="hidden sm:block text-gray-700 hover:text-blue-600 font-medium transition">
                                Masuk
                            </Link>
                            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                                Daftar
                            </Link>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 transition-colors"
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
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200">
                        <div className="px-4 pt-2 pb-3 space-y-1 bg-white">
                            <Link href="/" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-lg font-medium transition" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
                            <Link href="#about" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-lg font-medium transition" onClick={() => setIsMobileMenuOpen(false)}>Tentang</Link>
                            <Link href="#programs" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-lg font-medium transition" onClick={() => setIsMobileMenuOpen(false)}>Program</Link>
                            <Link href="#contact" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-lg font-medium transition" onClick={() => setIsMobileMenuOpen(false)}>Kontak</Link>
                            <Link href="/login" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-lg font-medium transition" onClick={() => setIsMobileMenuOpen(false)}>Masuk</Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Kolegium Orthopaedi</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Organisasi profesional dokter spesialis orthopaedi dan traumatologi terkemuka di Indonesia.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-gray-400 hover:text-white transition"><Icon icon="mdi:facebook" className="w-5 h-5" /></a>
                                <a href="#" className="text-gray-400 hover:text-white transition"><Icon icon="mdi:instagram" className="w-5 h-5" /></a>
                                <a href="#" className="text-gray-400 hover:text-white transition"><Icon icon="mdi:twitter" className="w-5 h-5" /></a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Menu</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/" className="text-gray-400 hover:text-white transition">Beranda</Link></li>
                                <li><Link href="#about" className="text-gray-400 hover:text-white transition">Tentang Kami</Link></li>
                                <li><Link href="#programs" className="text-gray-400 hover:text-white transition">Program</Link></li>
                                <li><Link href="#contact" className="text-gray-400 hover:text-white transition">Kontak</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Informasi</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="tel:+62274515151" className="text-gray-400 hover:text-white transition flex items-center gap-2"><Phone className="w-4 h-4" /> (0274) 515151</a></li>
                                <li><a href="mailto:info@kolegium.ac.id" className="text-gray-400 hover:text-white transition flex items-center gap-2"><Mail className="w-4 h-4" /> info@kolegium.ac.id</a></li>
                                <li className="text-gray-400 flex items-start gap-2"><MapPin className="w-4 h-4 mt-1 flex-shrink-0" /> Yogyakarta, Indonesia</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Akun</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/login" className="text-gray-400 hover:text-white transition">Masuk</Link></li>
                                <li><Link href="/register" className="text-gray-400 hover:text-white transition">Daftar</Link></li>
                                <li><Link href="/profile" className="text-gray-400 hover:text-white transition">Profil</Link></li>
                                <li><Link href="/settings" className="text-gray-400 hover:text-white transition">Pengaturan</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Kolegium Orthopaedi & Traumatologi Indonesia. All rights reserved.</p>
                    </div>
                </div>
            </footer>
            </div>
        </AuthProvider>
    );
}