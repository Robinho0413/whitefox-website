import { CategoryCard } from '@/components/card/CategoryCard';
import React from 'react';

export default function Page() {
    return (
        <div className="mt-10 px-4 py-12 md:p-16">
            <h1 className="text-3xl font-semibold mb-8 relative inline-block">
                Inscriptions
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
            </h1>
            <div className='flex gap-8 mb-16 justify-center flex-wrap'>
                <CategoryCard title="Chouchou" ageRange="5-8 ans" />
                <CategoryCard title="Minigaill" ageRange="9-16 ans" />
                <CategoryCard title="Gaillard" ageRange="16 ans et +" />
            </div>
        </div>
    );
}