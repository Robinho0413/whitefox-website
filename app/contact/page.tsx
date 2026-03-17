import { DispoCard } from '@/components/card/dispoCard';
import { EmailCard } from '@/components/card/emailCard';
import { MapCard } from '@/components/card/mapCard';
import { SocialCard } from '@/components/card/socialCard';
import { FadeInUp } from '@/components/animations/FadeInUp';
import { ContactForm } from '@/components/forms/ContactForm';
import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Contactez l'association Whitefox Cheer a Brive-la-Gaillarde pour toute question sur les entrainements, inscriptions et evenements.",
    alternates: {
        canonical: "/contact",
    },
};

export default function Page() {
    return (
        <div className="mt-10 px-4 py-12 md:p-16">
            <FadeInUp>
                <h1 className="text-3xl font-semibold mb-8 relative inline-block">
                    Contactez-nous
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
                </h1>
            </FadeInUp>
            <div className="flex flex-col md:flex-row gap-3 w-full mx-auto">
                <div className='flex flex-col gap-3'>
                    <FadeInUp delay={0.08}>
                        <SocialCard />
                    </FadeInUp>
                    <FadeInUp delay={0.16}>
                        <EmailCard />
                    </FadeInUp>
                    <FadeInUp delay={0.24}>
                        <DispoCard />
                    </FadeInUp>
                </div>
                <FadeInUp delay={0.32} className='w-full'>
                    <MapCard />
                </FadeInUp>
            </div>
            <FadeInUp delay={0.4} className='mt-3'>
                <section className='rounded-lg border bg-card text-card-foreground shadow-sm p-6 md:p-8'>
                    <h2 className='text-xl md:text-2xl font-semibold mb-2'>Envoyez-nous un message</h2>
                    <p className='text-muted-foreground mb-6'>
                        Une question ? Nous vous repondrons rapidement.
                    </p>
                    <ContactForm />
                </section>
            </FadeInUp>
        </div>
    );
}