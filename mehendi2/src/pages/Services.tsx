
import React from 'react';
import { Section, Heading, Reveal, Button } from '../components/Components';
import { CONTACT } from '../constants';

const ServiceCard = ({ title, description, features, recommended = false }: { title: string, description: string, features: string[], recommended?: boolean }) => (
    <div className={`relative p-8 rounded-3xl border ${recommended ? 'border-amber-500 bg-amber-500/5' : 'border-white/10 bg-white/5'} flex flex-col h-full hover:transform hover:-translate-y-2 transition-transform duration-300 group`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500"><path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z"/></svg>
        </div>
        <h3 className="text-2xl font-display text-white mb-3">{title}</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed min-h-[40px]">{description}</p>
        <div className="w-full h-px bg-gradient-to-r from-amber-500/50 to-transparent mb-6"></div>
        <ul className="space-y-3 mb-8 flex-grow">
            {features.map((f, i) => (
                <li key={i} className="flex items-start text-slate-300 text-sm">
                    <span className="text-amber-500 mr-3 text-lg leading-none">•</span>
                    {f}
                </li>
            ))}
        </ul>
        <Button variant={recommended ? 'primary' : 'outline'} href={CONTACT.whatsappLink} className="w-full">Book Consultation</Button>
    </div>
);

export const Services = () => {
    return (
        <div className="pt-20">
            <Section>
                <Heading title="Artistic Services" subtitle="Our Expertise" />
                <p className="text-center text-slate-400 max-w-2xl mx-auto mb-16 -mt-10">
                    We don't just apply Henna; we create masterpieces. Explore our diverse range of artistic styles tailored for every personality and occasion.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Reveal delay={0.1}>
                        <ServiceCard 
                            title="Bridal Portraits" 
                            description="Our signature specialty. Highly detailed, hyper-realistic portraits of the Bride and Groom embedded into the palm design."
                            recommended={true}
                            features={[
                                'Lifelike face shading',
                                'Intricate detailing',
                                'Personalized love story motifs',
                                'Requires 4-6 hours of precision work'
                            ]}
                        />
                    </Reveal>
                    <Reveal delay={0.2}>
                        <ServiceCard 
                            title="Traditional Rajasthani" 
                            description="Timeless patterns featuring Dulha-Dulhan figures, peacocks, elephants, and musical instruments."
                            features={[
                                'Classic mirror-image symmetry',
                                'Dense, rich staining patterns',
                                'Full arms and legs coverage',
                                'Cultural storytelling elements'
                            ]}
                        />
                    </Reveal>
                    <Reveal delay={0.3}>
                        <ServiceCard 
                            title="Modern Arabic" 
                            description="Contemporary designs focusing on flow, negative space, and bold floral outlines."
                            features={[
                                'Elegant & free-flowing',
                                'Thick outlines with shading',
                                'Leaves skin breathing space',
                                'Perfect for Sangeet & Guests'
                            ]}
                        />
                    </Reveal>
                    <Reveal delay={0.4}>
                        <ServiceCard 
                            title="Jewelry & Minimalist" 
                            description="Sophisticated designs that mimic hand ornaments, bracelets, and rings."
                            features={[
                                'Clean lines & geometric shapes',
                                'Ornamental aesthetics',
                                'Modern and chic look',
                                'Ideal for engagement parties'
                            ]}
                        />
                    </Reveal>
                    <Reveal delay={0.5}>
                        <ServiceCard 
                            title="Leg & Feet Artistry" 
                            description="Often overlooked, feet mehendi completes the bridal look with grace and balance."
                            features={[
                                'Ankle to knee intricate work',
                                'Matching motifs with hands',
                                'Net/Jaali patterns',
                                'Payal (Anklet) style designs'
                            ]}
                        />
                    </Reveal>
                    <Reveal delay={0.6}>
                        <ServiceCard 
                            title="Event & Party Groups" 
                            description="Speed and beauty combined for large gatherings like Karwa Chauth, Teej, or Weddings."
                            features={[
                                'Quick stylish strips',
                                'Mandala back-hand designs',
                                'Hourly package rates',
                                'Multiple artist availability'
                            ]}
                        />
                    </Reveal>
                </div>
            </Section>
            
            <Section className="bg-slate-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-3xl font-display text-white mb-6">Custom Design Requests</h3>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Have a specific design in mind? Whether it's a copy of a celebrity design, a specific logo, or a fusion of different styles, 
                        Raju's steady hand can replicate and adapt any pattern to suit your preference.
                    </p>
                    <Button href={CONTACT.whatsappLink} variant="primary">Discuss Your Design</Button>
                </div>
            </Section>
        </div>
    );
};
