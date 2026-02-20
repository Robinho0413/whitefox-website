import Link from 'next/link';
import React from 'react';
import { albums } from '@/lib/albums-data';

export const metadata = {
    title: 'Plan du site - Association Whitefox',
    description: 'Plan du site de l&apos;association Whitefox - Navigation complète du site de cheerleading et pom-pom girls',
};

export default function PlanDuSite() {
    const navigationStructure = [
        {
            title: 'Pages principales',
            items: [
                { name: 'Accueil', href: '/', description: 'Page d&apos;accueil de l&apos;association Whitefox' },
                { name: 'Notre club', href: '/club', description: 'Présentation de l&apos;association et de nos activités' },
                { name: 'Nos sponsors', href: '/sponsors', description: 'Liste de nos partenaires et sponsors' },
                { name: 'Inscriptions', href: '/inscription', description: 'Informations sur les inscriptions et tarifs' },
                { name: 'Contact', href: '/contact', description: 'Nous contacter et informations pratiques' },
            ]
        },
        {
            title: 'Galerie photo',
            items: [
                { name: 'Galerie principale', href: '/gallery', description: 'Vue d&apos;ensemble de tous nos albums photo' },
                ...albums.map(album => ({
                    name: album.title,
                    href: `/gallery/${album.id}`,
                    description: album.description
                }))
            ]
        },
        {
            title: 'Pages légales',
            items: [
                { name: 'Mentions légales', href: '/mentions-legales', description: 'Informations légales obligatoires' },
                { name: 'Plan du site', href: '/plan-du-site', description: 'Architecture complète du site' },
            ]
        }
    ];

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            <h1 className="text-4xl font-bold mb-8 relative inline-block">
                Plan du site
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
            </h1>

            <div className="mb-8">
                <p className="text-lg text-muted-foreground">
                    Retrouvez ci-dessous l&apos;ensemble des pages et sections de notre site internet. 
                    Cette page vous aide à naviguer facilement dans tous les contenus de l&apos;association Whitefox.
                </p>
            </div>

            <div className="space-y-12">
                {navigationStructure.map((section, sectionIndex) => (
                    <section key={sectionIndex} className="space-y-6">
                        <h2 className="text-2xl font-semibold text-primary-500 border-b border-border pb-2">
                            {section.title}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {section.items.map((item, itemIndex) => (
                                <Link 
                                    key={itemIndex}
                                    href={item.href}
                                    className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-300 hover:border-primary-500/50 group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold group-hover:text-primary-500 transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {item.description}
                                            </p>
                                        </div>
                                        <svg 
                                            className="w-5 h-5 text-muted-foreground group-hover:text-primary-500 transition-colors ml-4 flex-shrink-0" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Section d'aide à la navigation */}
            <div className="mt-16 bg-muted/30 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Besoin d&apos;aide pour naviguer ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium mb-2">🏠 Vous êtes nouveaux ?</h4>
                        <p className="text-sm text-muted-foreground">
                            Commencez par la page <Link href="/club" className="text-primary-500 hover:underline">Notre club</Link> pour 
                            découvrir nos activités, puis consultez les <Link href="/inscription" className="text-primary-500 hover:underline">Inscriptions</Link> pour 
                            nous rejoindre.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">📸 Vous cherchez des photos ?</h4>
                        <p className="text-sm text-muted-foreground">
                            Rendez-vous dans notre <Link href="/gallery" className="text-primary-500 hover:underline">Galerie</Link> pour 
                            voir toutes nos photos organisées par événements et compétitions.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">📰 Vous voulez suivre notre actualité ?</h4>
                        <p className="text-sm text-muted-foreground">
                            Consultez nos actualités sur la page  <Link href="/" className="text-primary-500 hover:underline">Accueil</Link> pour 
                            rester informé de nos derniers événements.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">📞 Vous avez des questions ?</h4>
                        <p className="text-sm text-muted-foreground">
                            N&apos;hésitez pas à nous écrire via notre page <Link href="/contact" className="text-primary-500 hover:underline">Contact</Link> ou 
                            directement à l&apos;adresse foxcheer1@gmail.com.
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistiques du site */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="bg-primary-50 dark:bg-primary-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary-500">5</div>
                    <div className="text-sm text-muted-foreground">Pages principales</div>
                </div>
                <div className="bg-primary-50 dark:bg-primary-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary-500">{albums.length}</div>
                    <div className="text-sm text-muted-foreground">Albums photo</div>
                </div>
                <div className="bg-primary-50 dark:bg-primary-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary-500">2</div>
                    <div className="text-sm text-muted-foreground">Pages légales</div>
                </div>
                <div className="bg-primary-50 dark:bg-primary-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary-500">{5 + albums.length + 2}</div>
                    <div className="text-sm text-muted-foreground">Total pages</div>
                </div>
            </div>

            <div className="mt-12 text-sm text-muted-foreground text-center">
                <p>Dernière mise à jour du plan du site : {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
        </div>
    );
}