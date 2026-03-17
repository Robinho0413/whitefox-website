import AnimatedCategoryCards from './AnimatedCategoryCards';
import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Inscriptions",
    description:
        "Retrouvez les categories, tarifs et informations pour s'inscrire chez Whitefox Cheer.",
    alternates: {
        canonical: "/inscription",
    },
};

export default function Page() {
    return (
        <div className="mt-10 px-4 py-12 md:p-16">
            <h1 className="text-3xl font-semibold mb-8 relative inline-block">
                Inscriptions
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
            </h1>
            <AnimatedCategoryCards />
        </div>
    );
}