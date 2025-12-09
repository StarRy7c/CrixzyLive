import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- BUTTONS ---
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    to?: string;
    variant?: 'primary' | 'outline' | 'ghost';
    className?: string;
    href?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, to, variant = 'primary', className = '', href }) => {
    const baseStyle = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0";
    
    const variants = {
        primary: "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 border border-transparent",
        outline: "bg-transparent border border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500",
        ghost: "bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white backdrop-blur-sm",
    };

    const combinedClass = `${baseStyle} ${variants[variant]} ${className}`;

    if (to) return <Link to={to} className={combinedClass}>{children}</Link>;
    if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClass}>{children}</a>;
    return <button onClick={onClick} className={combinedClass}>{children}</button>;
};

// --- REVEAL CONTAINER ---
export const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            {children}
        </motion.div>
    );
};

// --- SECTION WRAPPER ---
export const Section: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = "", id }) => (
    <section id={id} className={`py-24 relative overflow-hidden ${className}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            {children}
        </div>
    </section>
);

// --- HEADING ---
export const Heading: React.FC<{ title: string; subtitle?: string; align?: 'left' | 'center' }> = ({ title, subtitle, align = 'center' }) => (
    <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
        {subtitle && (
            <motion.span 
                initial={{ opacity: 0 }} 
                whileInView={{ opacity: 1 }}
                className="block text-amber-500 font-sans text-sm tracking-[0.2em] uppercase mb-3"
            >
                {subtitle}
            </motion.span>
        )}
        <h2 className="text-4xl md:text-5xl font-display font-medium text-slate-100 leading-tight">
            {title.split(" ").map((word, i) => (
                <span key={i} className={word.toLowerCase().includes('art') || word.toLowerCase().includes('raju') ? "text-amber-200" : ""}>
                    {word} 
                </span>
            ))}
        </h2>
        <div className={`h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-6 ${align === 'center' ? 'mx-auto' : ''} opacity-60`} />
    </div>
);
