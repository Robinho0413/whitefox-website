import { SponsorsCard } from '@/components/card/sponsorsCard';
import { createClient } from '@/lib/supabase/client';
import React from 'react';

type Sponsor = {
    id: string;
    title: string;
    description: string;
    adress: string;
    image_url: string;
    btn_url: string;
    btn_text: string;
    created_at: string | null;
};

export default async function Page() {
    const supabase = await createClient();

    const { data: sponsorsData } = await supabase
        .from("sponsors")
        .select("id, title, description, adress, image_url, btn_url, btn_text")
        .order("created_at", { ascending: true });

    const sponsors = (sponsorsData ?? []) as Sponsor[];


    return (
        <div className="mt-10 px-4 py-12 md:p-16">
            <h1 className="text-3xl font-semibold mb-8 relative inline-block">
                Sponsors
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
            </h1>
            {sponsors.length === 0 ? (
                <div className="rounded-lg border border-secondary/60 bg-secondary/40 px-4 py-6 text-muted-foreground">
                    Aucun sponsor disponible.
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    {sponsors.map((sponsor, index) => (
                        <SponsorsCard
                            key={sponsor.id}
                            title={sponsor.title}
                            description={sponsor.description}
                            adresse={sponsor.adress}
                            image={sponsor.image_url}
                            url={sponsor.btn_url}
                            btn={sponsor.btn_text}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}