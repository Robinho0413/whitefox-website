import { DispoCard } from '@/components/card/dispoCard';
import { EmailCard } from '@/components/card/emailCard';
import { MapCard } from '@/components/card/mapCard';
import { PhoneCard } from '@/components/card/phoneCard';
import React from 'react';

export default function Page() {
    return (
        <div className="p-16">
            <h1 className="text-3xl font-semibold mb-8 relative inline-block">
                Contactez-nous
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
            </h1>
            <div className="flex flex-row gap-3 w-full mx-auto">
                <div className='flex flex-col gap-3'>
                    <PhoneCard />
                    <EmailCard />
                    <DispoCard />
                </div>
                <MapCard />
            </div>
        </div>
    );
}