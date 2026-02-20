"use client";

import Link from 'next/link';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { TikTokIcon } from '@/components/icons/TikTokIcon';

const FloatingSocialIcons = () => {
    return (
        <>
            <style>{`
                .floating-social-icons {
                    position: fixed;
                    bottom: 0;
                    right: 0;
                    z-index: 40;
                    display: flex;
                    gap: 1rem;
                    padding: 1rem;
                    padding-bottom: max(1rem, env(safe-area-inset-bottom));
                }

                @media (max-width: 1023px) {
                    .floating-social-icons {
                        display: flex;
                    }
                }

                @media (min-width: 1024px) {
                    .floating-social-icons {
                        display: none;
                    }
                }
            `}</style>
            <div className="floating-social-icons">
                <Link
                    href="https://www.instagram.com/whitefox_cheer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-colors shadow-lg hover:shadow-xl"
                    aria-label="Instagram"
                >
                    <InstagramIcon size={24} />
                </Link>
                <Link
                    href="https://www.tiktok.com/@whitefox_cheer_poms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-colors shadow-lg hover:shadow-xl"
                    aria-label="TikTok"
                >
                    <TikTokIcon size={24} />
                </Link>
            </div>
        </>
    );
};

export default FloatingSocialIcons;
