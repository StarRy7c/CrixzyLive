import React from 'react';
import { motion } from 'framer-motion';
import { Section, Heading, Button, Reveal } from '../components/Components';
import { CONTACT } from '../constants';

export const Contact = () => {
    const address = "6R69+CQ6 Shopping Center, H.A.L. Korwa, Hindustan Aeronautics Limited Korwa, Uttar Pradesh 227412";
    const mapQuery = encodeURIComponent(address);
    const mapUrl = `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=B&output=embed`;

    return (
        <div className="pt-20 min-h-screen bg-slate-950">
            <Section>
                <Heading title="Get in Touch" subtitle="Contact Us" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
                    {/* Contact Info */}
                    <Reveal>
                        <div className="space-y-8">
                            <h3 className="text-3xl font-display text-white">Let's discuss your event</h3>
                            <p className="text-slate-400 leading-relaxed">
                                We recommend booking at least 2-3 weeks in advance for bridal bookings, especially during the wedding season. Feel free to reach out for a consultation.
                            </p>

                            {/* Address Block */}
                            <div className="flex items-start p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all">
                                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm text-slate-400 font-medium uppercase tracking-wide">Visit Studio</div>
                                    <div className="text-lg font-medium text-white mt-1">Shopping Center, H.A.L. Korwa</div>
                                    <div className="text-slate-400 text-sm mt-1 leading-relaxed">Hindustan Aeronautics Limited<br/>Amethi, Uttar Pradesh 227412</div>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-amber-500 text-sm hover:underline">Get Directions →</a>
                                </div>
                            </div>
                            
                            <div className="space-y-6 pt-4">
                                <a href={CONTACT.whatsappLink} className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all group">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.001.572 1.936.87 2.807.87 3.181 0 5.767-2.586 5.767-5.766.001-3.18-2.585-5.767-5.766-5.767zm6.141 8.657c-.197.555-1.025 1.013-1.408 1.077-.487.081-.663.096-1.558.106-2.516.026-4.329-1.503-4.444-1.657-.116-.155-1.059-1.407-1.059-2.682s.661-1.902.897-2.158c.205-.222.449-.279.601-.279.152 0 .304.004.436.008.139.004.326-.053.513.394.19.453.649 1.583.706 1.698.057.116.095.251.016.402-.079.152-.119.245-.233.38-.114.136-.242.302-.344.407-.116.118-.236.246-.101.478.134.232.595.98 1.278 1.588.882.787 1.627 1.052 1.859 1.168.232.116.368.099.505-.057.137-.156.59-6.85.748-.921.157-.235.332-.196.557-.113.225.084 1.431.674 1.676.795.245.121.408.181.466.281.058.1.058.58-.139 1.135z"/></svg>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm text-slate-400">WhatsApp (Recommended)</div>
                                        <div className="text-lg font-medium text-white">{CONTACT.whatsapp}</div>
                                    </div>
                                </a>
                                
                                <a href={`mailto:${CONTACT.email}`} className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all group">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm text-slate-400">Email</div>
                                        <div className="text-lg font-medium text-white">{CONTACT.email}</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </Reveal>

                    {/* Simple Form */}
                    <Reveal delay={0.2}>
                        <form className="bg-slate-900 p-8 rounded-3xl border border-white/5 shadow-2xl" onSubmit={(e) => { e.preventDefault(); alert("Please message on WhatsApp for faster response!"); }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                                    <input type="text" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all" placeholder="Your Name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                                    <input type="tel" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all" placeholder="Mobile Number" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Event Date</label>
                                    <input type="date" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                                    <textarea rows={4} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all" placeholder="Tell us about your event..."></textarea>
                                </div>
                                <Button className="w-full">Send Message</Button>
                            </div>
                        </form>
                    </Reveal>
                </div>
            </Section>

            {/* Map Section */}
            <Section className="!pt-0 !pb-0">
                <Reveal>
                    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                        {/* 
                            Using CSS filters to create a 'Dark Mode' map effect from a standard iframe 
                            grayscale(100%) -> removes color
                            invert(90%) -> turns white backgrounds dark
                            contrast(85%) -> softens the harsh contrast
                        */}
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src={mapUrl}
                            title="Raju Art Location"
                            style={{ filter: 'grayscale(100%) invert(90%) contrast(85%)' }}
                            allowFullScreen
                            loading="lazy"
                            className="w-full h-full border-0"
                        ></iframe>
                        
                        {/* Overlay Button */}
                        <div className="absolute bottom-6 right-6 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
                            <Button href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} className="shadow-xl !bg-white !text-slate-900 hover:!bg-amber-400">
                                Open in Google Maps
                            </Button>
                        </div>
                    </div>
                </Reveal>
            </Section>

            <div className="h-24"></div>
        </div>
    );
};
