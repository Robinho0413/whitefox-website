"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ui/themeToggle';
import MenuIcon from '../icons/MenuIcon';
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: 'Accueil', path: '/' },
        { name: 'Inscription', path: '/inscription' },
        { name: 'Club', path: '/club' },
        { name: 'Sponsors', path: '/sponsors' },
        { name: 'Galerie', path: '/gallery' },
        { name: 'Contact', path: '/contact' },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-background shadow-md">
            <style>{`
                .mobile-menu-backdrop {
                    -webkit-backdrop-filter: blur(12px);
                    backdrop-filter: blur(12px);
                }
            `}</style>
            <div className="relative flex flex-row items-center justify-between h-16 px-4 md:px-8">
                <Link href="/" className="text-2xl font-bold">
                    <Image src="/images/logo-black.png" alt="Whitefox" width={48} height={48} />
                </Link>
                <div className='flex items-center gap-4 lg:gap-6'>
                    <div className="hidden lg:flex flex-row gap-10">
                        {navItems.map((item) => (
                            <div key={item.path} className="flex flex-col justify-center items-center group">
                                <Link
                                    href={item.path}
                                    className={`${pathname === item.path
                                        ? 'text-primary-500'
                                        : 'text-foreground hover:text-primary-500'
                                        } p-3 duration-300 font-semibold`}
                                >
                                    {item.name}
                                </Link>
                                <span
                                    className={`${pathname === item.path
                                        ? 'w-[110%]'
                                        : 'w-0 group-hover:w-[110%]'
                                        } h-0.5 bg-primary-500 duration-300 ease-in-out`}
                                ></span>
                            </div>
                        ))}
                    </div>
                    <ThemeToggle />
                    <Button onClick={toggleMenu} variant={"icon"} size={"icon"} className="lg:hidden flex items-center justify-center self-center">
                        <MenuIcon />
                    </Button>
                </div>
                <div className='hidden fixed right-0 top-1/2 -translate-y-1/2 lg:flex flex-col gap-2 bg-card/30 border-l border-y p-2 rounded-l-lg backdrop-blur-md z-50' style={{ boxShadow: "0 10px 25px -3px rgba(59, 165, 155, 0.1), 0 4px 6px -2px rgba(59, 165, 155, 0.05)" }}>
                    <Link
                        href="https://www.instagram.com/whitefox_cheer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-colors shadow-lg"
                        aria-label="Instagram"
                    >
                        <InstagramIcon size={24} />
                    </Link>
                    <Link
                        href="https://www.tiktok.com/@whitefox_cheer_poms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-colors shadow-lg"
                        aria-label="TikTok"
                    >
                        <TikTokIcon size={24} />
                    </Link>
                </div>
            </div>
            <div
                className={`lg:hidden absolute h-screen left-0 w-full mobile-menu-backdrop bg-background/60 flex flex-col gap-4 p-4 text-2xl transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
            >
                {navItems.map((item) => (
                    <div key={item.path} className="flex flex-col justify-center items-center group sm:px-4">
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${
                                pathname === item.path
                                    ? 'text-primary-500'
                                    : 'text-foreground hover:text-primary-500'
                            } p-3 duration-300 font-semibold`}
                            onClick={toggleMenu}
                        >
                            {item.name}
                        </Link>
                        <span
                            className={`${pathname === item.path
                                ? 'w-full'
                                : 'w-0 group-hover:w-full'
                                } h-0.5 bg-primary-500 duration-300 ease-in-out`}
                        ></span>
                    </div>
                ))}
                <div className='flex justify-center gap-4 mt-8 pb-24'>
                    <Link
                        href="https://www.instagram.com/whitefox_cheer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-colors shadow-lg"
                        aria-label="Instagram"
                    >
                        <InstagramIcon size={24} />
                    </Link>
                    <Link
                        href="https://www.tiktok.com/@whitefox_cheer_poms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-colors shadow-lg"
                        aria-label="TikTok"
                    >
                        <TikTokIcon size={24} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
