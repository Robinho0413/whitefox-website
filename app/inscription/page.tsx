import { Cat1Card } from '@/components/card/cat1Card';
import PricingTable from '@/components/sections/pricingTable';
import React from 'react';

export default function Page() {
    return (
        <div className="mt-10 p-16">
            <h1 className="text-3xl font-semibold mb-8 relative inline-block">
                Inscriptions
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
            </h1>
            <div className='flex flex-col md:flex-row gap-8 mb-16 justify-center'>
                <Cat1Card />
                <Cat1Card />
                <Cat1Card />

            </div>
        </div>
    );
}