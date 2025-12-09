import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CONTACT, NAV_LINKS } from '../constants';
import { Button } from './Components';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => setMobileOpen(false), [location]);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <NavLink to="/" className="text-2xl font-display font-bold text-white tracking-widest uppercase">
                        RAJU MEHENDI<span className="text-amber-500">.</span>ARTIST
                    </NavLink>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map(link => (
                            <NavLink 
                                key={link.path} 
                                to={link.path}
                                className={({isActive}) => `text-sm uppercase tracking-widest transition-colors ${isActive ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <Button variant="outline" className="ml-4 !px-4 !py-2 text-xs" href={CONTACT.whatsappLink}>
                            Book Now
                        </Button>
                    </div>

                    {/* Mobile Toggle */}
                    <button 
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-white p-2 focus:outline-none"
                    >
                        <div className="w-6 h-5 relative flex flex-col justify-between">
                            <span className={`w-full h-0.5 bg-current transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`w-full h-0.5 bg-current transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-full h-0.5 bg-current transition-all ${mobileOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
                        </div>
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed inset-0 z-40 bg-slate-950 pt-24 px-6 md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col gap-6 text-center">
                            {NAV_LINKS.map(link => (
                                <NavLink 
                                    key={link.path} 
                                    to={link.path}
                                    className="text-2xl font-display text-slate-200 hover:text-amber-400 transition-colors"
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                            <div className="mt-8">
                                <Button href={CONTACT.whatsappLink}>Chat on WhatsApp</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const Footer = () => (
    <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div>
                <h3 className="text-2xl font-display font-bold text-white mb-6">RAJU MEHENDI<span className="text-amber-500">.</span>ARTIST</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                    Transforming traditions into timeless art. Specialized in Bridal, Arabic, and custom detailed Mehendi designs for every auspicious occasion.
                </p>
            </div>
            <div>
                <h4 className="text-lg font-serif text-white mb-6">Explore</h4>
                <ul className="space-y-3 text-slate-400 text-sm">
                    {NAV_LINKS.map(l => (
                        <li key={l.path}><NavLink to={l.path} className="hover:text-amber-400 transition-colors">{l.name}</NavLink></li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="text-lg font-serif text-white mb-6">Contact</h4>
                <ul className="space-y-3 text-slate-400 text-sm">
                    <li><a href={`tel:${CONTACT.phone}`} className="hover:text-amber-400">+91 99180 48575</a></li>
                    <li><a href={`tel:${CONTACT.whatsapp}`} className="hover:text-amber-400">+91 99189 28267</a> (WhatsApp)</li>
                    <li><a href={`mailto:${CONTACT.email}`} className="hover:text-amber-400">{CONTACT.email}</a></li>
                    <li className="flex gap-4 mt-6">
                        {/* Social Icons Placeholder */}
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 hover:text-slate-900 transition-all cursor-pointer">IG</div>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 hover:text-slate-900 transition-all cursor-pointer">FB</div>
                    </li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center border-t border-white/5 pt-8">
            <p className="text-slate-600 text-xs">© 2025 Raju Mehendi Artist. All rights reserved. Created by <a href="https://instagram.com/nixx.curse" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">nixx</a> ❤️</p>
        </div>
    </footer>
);

export const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-950">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};