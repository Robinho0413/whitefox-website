import { SponsorsCard } from '@/components/card/sponsorsCard';
import React from 'react';

export default function Page() {
    return (
        <div className="mt-10 px-4 py-12 md:p-16">
            <h1 className="text-3xl font-semibold mb-8 relative inline-block">
                Sponsors
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
            </h1>
            <div className="flex flex-col justify-center gap-6 w-full mx-auto lg:px-16">
                <div className='flex flex-col md:flex-row gap-6 flex-1'>
                    <SponsorsCard title="La noix Gaillarde" adresse="77 Route de Confolens, Gare d’Aubazine, 19560 Saint-Hilaire-Peyroux" image="/images/sponsors-noix-gaillarde.png" date="2025" url="https://www.lanoixgaillarde.com/" btn="Site web" />
                    <SponsorsCard title="Brown Europe" adresse="6 Rue Jean Allary, 19100 Brive-la-Gaillarde" image="/images/sponsors-brown-europe.png" date="2025" url="https://brown-europe.com/" btn="Site web" />
                </div>
                <div className='flex flex-col md:flex-row gap-6 flex-1'>
                    <SponsorsCard title="SARL TCM19" adresse="41 Rue de la Reine, 19270 Ussac" image="/images/sponsors-tcm.jpg" date="2025" url="https://www.tcm19.fr/" btn="Site web" />
                    <SponsorsCard title="???" adresse="Adresse inconnue" image="/images/bg-image.jpg" date="?" url="#" btn="Site web" />
                </div>
            </div>
        </div>
    );
}