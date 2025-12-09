
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button, Section, Reveal, Heading } from '../components/Components';
import { ASSETS, CONTACT } from '../constants';

const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    return (
        <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Parallax Background */}
            <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-slate-950/60 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                {/* Dynamically loads the first background from ASSETS */}
                <img src={ASSETS.backgrounds[0]} alt="Background" className="w-full h-full object-cover opacity-60" />
            </motion.div>

            {/* Content */}
            <motion.div style={{ opacity }} className="relative z-20 text-center px-6 max-w-4xl mx-auto mt-20">
                <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block py-1 px-3 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs tracking-[0.2em] uppercase mb-6"
                >
                    Since 2012
                </motion.span>
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-display text-white mb-6 leading-tight"
                >
                    Adorning Hands <br /> With <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">Elegance</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-300 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto"
                >
                    Experience the finest artistry with Raju Mehendi. From intricate bridal patterns to contemporary Arabic designs, we bring your celebrations to life.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Button href={CONTACT.whatsappLink}>Book Appointment</Button>
                    <Button variant="ghost" to="/gallery">View Gallery</Button>
                </motion.div>
            </motion.div>
        </div>
    );
};

const ServicesPreview = () => {
    const services = [
        { title: "Bridal Mehendi", desc: "Intricate, story-telling designs for your special day.", img: ASSETS.services.bridal },
        { title: "Arabic Designs", desc: "Flowing floral patterns with bold outlines.", img: ASSETS.services.arabic },
        { title: "Event Guests", desc: "Quick yet beautiful designs for family and friends.", img: ASSETS.services.guest },
        { title: "Feet Artistry", desc: "Elegant and traditional patterns to adorn your feet.", img: ASSETS.gallery.Feet[0] },
        { title: "Figurine Mehendi", desc: "Featuring artistic figures and characters in your design.", img: ASSETS.gallery.Bridal[0] },
        { title: "Heavy Designs", desc: "Full-coverage, dense patterns for a rich look.", img: ASSETS.gallery.Hand[10] },
    ];

    return (
        <Section>
            <Heading title="Our Artistry" subtitle="Services" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services.map((s, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                        <div className="group relative h-[400px] overflow-hidden rounded-2xl cursor-pointer border border-white/5 hover:border-amber-500/30 transition-colors">
                            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-all duration-500 z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-20" />
                            <img src={s.img} alt={s.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 z-30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-2xl font-display text-white mb-2">{s.title}</h3>
                                <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{s.desc}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
            <div className="text-center mt-12">
                <Button variant="outline" to="/services">View All Services</Button>
            </div>
        </Section>
    );
};

const AboutSnippet = () => (
    <Section className="bg-slate-900/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
                <div className="relative">
                    <div className="absolute -inset-4 border border-amber-500/30 rounded-full opacity-60 animate-[spin_10s_linear_infinite]" />
                    <img src={ASSETS.branding.artist} alt="Raju Artist" className="rounded-full w-full max-w-sm mx-auto shadow-2xl shadow-black/50 grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
            </Reveal>
            <Reveal delay={0.2}>
                <span className="text-amber-500 text-sm tracking-widest uppercase mb-4 block">The Artist</span>
                <h2 className="text-4xl md:text-5xl font-display text-white mb-6">Master of <span className="text-amber-400">Tradition</span></h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                    With over a decade of experience, Raju has mastered the delicate art of Henna. Believing that every line tells a story, he combines traditional Rajasthani motifs with modern aesthetics to create unique masterpieces for every client.
                </p>
                <ul className="space-y-4 mb-8">
                    {['1000+ Happy Brides', 'Organic Henna Used', 'Sanitized & Professional'].map((item, i) => (
                        <li key={i} className="flex items-center text-slate-200">
                            <span className="w-2 h-2 bg-amber-500 rounded-full mr-3" />
                            {item}
                        </li>
                    ))}
                </ul>
                <div className="flex gap-4">
                    <Button to="/contact">Get in Touch</Button>
                </div>
            </Reveal>
        </div>
    </Section>
);

const LocationSnippet = () => {
    const address = "6R69+CQ6 Shopping Center, H.A.L. Korwa, Hindustan Aeronautics Limited Korwa";
    const mapQuery = encodeURIComponent(address);
    
    return (
        <Section className="py-12">
            <Reveal>
                <div className="rounded-3xl bg-white/5 border border-white/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-amber-500/30 transition-colors">
                    <div className="text-center md:text-left">
                        <span className="text-amber-500 text-xs tracking-[0.2em] uppercase font-bold mb-2 block">Visit Us</span>
                        <h3 className="text-2xl md:text-3xl font-display text-white mb-2">Locate Our Studio</h3>
                        <p className="text-slate-400 max-w-md">
                            Come visit us at Shopping Center, H.A.L. Korwa for a consultation.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} variant="outline">
                            Get Directions
                        </Button>
                        <Button to="/contact" variant="ghost">View on Map</Button>
                    </div>
                </div>
            </Reveal>
        </Section>
    );
};

export const Home = () => (
    <>
        <Hero />
        <ServicesPreview />
        <AboutSnippet />
        <LocationSnippet />
        <Section>
            <div className="bg-slate-900/50 rounded-3xl border border-white/10 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                    <h2 className="text-3xl md:text-4xl font-display text-white mb-4">Ready to adorn your hands?</h2>
                    <p className="text-slate-300">Bookings open for the wedding season. Secure your dates early.</p>
                </div>
                <div className="flex-shrink-0">
                    <Button className="bg-amber-600 text-slate-900 hover:bg-amber-500 shadow-xl" href={CONTACT.whatsappLink}>
                        Book via WhatsApp
                    </Button>
                </div>
            </div>
        </Section>
    </>
);
