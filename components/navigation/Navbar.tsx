"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ui/themeToggle';

const Navbar = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'Accueil', path: '/' },
        { name: 'Actualités', path: '/news' },
        { name: 'Inscription', path: '/register' },
        { name: 'Club', path: '/club' },
        { name: 'Galerie', path: '/gallery' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <div className="fixed top-0 left-0 w-full z-50 flex flex-row items-center justify-between bg-background h-16 px-8">
            <Link href="/" className="text-2xl font-bold">
                WHITE<span className='text-primary-500'>FOX</span>
            </Link>
            <div className="flex flex-row gap-10">
                {navItems.map((item) => (
                    <div key={item.path} className="flex flex-col justify-center items-center group">
                        <Link
                            href={item.path}
                            className={`${
                                pathname === item.path
                                    ? 'text-primary-500'
                                    : 'text-foreground hover:text-primary-500'
                            } p-3 duration-300`}
                        >
                            {item.name}
                        </Link>
                        <span
                            className={`${
                                pathname === item.path
                                    ? 'w-[110%]'
                                    : 'w-0 group-hover:w-[110%]'
                            } h-0.5 bg-primary-500 duration-300 ease-in-out`}
                        ></span>
                    </div>
                ))}
                <ThemeToggle />
            </div>
        </div>
    );
};

export default Navbar;
