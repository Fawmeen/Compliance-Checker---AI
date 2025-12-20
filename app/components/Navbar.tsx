'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ShieldCheck, Home, FileText } from 'lucide-react';
import gsap from 'gsap';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const navRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial entrance animation
        gsap.fromTo(
            navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
        );
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Opening menu
            gsap.fromTo(mobileMenuRef.current,
                { height: 0, opacity: 0 },
                { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        } else {
            // Closing menu
            gsap.to(mobileMenuRef.current,
                { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }
            );
        }
    };

    const navLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/policies', label: 'Policies', icon: FileText },
    ];

    return (
        <nav
            ref={navRef}
            className={cn(
                'fixed top-0 left-0 right-0 z-50',
                'border-b border-slate-200/50',
                'bg-white/80',
                'backdrop-blur-md',
                'transition-all duration-300'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-violet-600 p-2 rounded-lg group-hover:bg-violet-500 transition-colors">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                            ComplianceAI
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'flex items-center gap-2 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'text-violet-600'
                                            : 'text-slate-600 hover:text-violet-600'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                        <Link
                            href="/upload"
                            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-transform hover:scale-105 shadow-md shadow-violet-500/20"
                        >
                            Upload Policy
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                ref={mobileMenuRef}
                className={cn(
                    "md:hidden overflow-hidden bg-white/90 backdrop-blur-md border-b border-indigo-100",
                    !isOpen && "hidden"
                )}
            >
                <div className="px-4 pt-2 pb-6 space-y-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium',
                                    isActive
                                        ? 'bg-violet-50 text-violet-600'
                                        : 'text-slate-600 hover:bg-violet-50 hover:text-violet-600'
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {link.label}
                            </Link>
                        );
                    })}
                    <Link
                        href="/upload"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-violet-600 hover:bg-violet-50"
                    >
                        <div className='w-5 h-5' />
                        Upload Policy
                    </Link>
                </div>
            </div>
        </nav>
    );
}
