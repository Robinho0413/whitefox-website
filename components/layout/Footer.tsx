import Link from 'next/link';
import React from 'react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { TikTokIcon } from '@/components/icons/TikTokIcon';

const Footer: React.FC = () => {
    return (
        <footer className="bg-secondary mt-16">
            <div className="container mx-auto px-4 py-12 md:px-16">
                {/* Section principale */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* À propos */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Whitefox Cheer</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Association sportive de cheerleading et danse pom-pom basée à Brive-la-Gaillarde (19).
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact</h3>
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>📧 foxcheer1@gmail.com</p>
                            <Link
                                href="https://www.instagram.com/whitefox_cheer"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-primary-500 transition-colors"
                            >
                                <InstagramIcon size={16} />
                                <span>@whitefox_cheer</span>
                            </Link>
                            <Link
                                href="https://www.tiktok.com/@whitefox_cheer_poms"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-primary-500 transition-colors"
                            >
                                <TikTokIcon size={16} />
                                <span>@whitefox_cheer_poms</span>
                            </Link>
                        </div>
                    </div>

                    {/* Informations légales */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Informations légales</h3>
                        <div className="text-xs text-muted-foreground space-y-2">
                            <p><strong>Association loi 1901</strong></p>
                            <p>
                                <strong>Hébergeur :</strong><br />
                                Vercel Inc.<br />
                                340 S Lemon Ave #4133<br />
                                Walnut, CA 91789
                            </p>
                        </div>
                    </div>

                    {/* Liens utiles */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Liens utiles</h3>
                        <div className="text-sm space-y-2">
                            <Link href="/inscription" className="block hover:text-primary-500 transition-colors">
                                Inscriptions
                            </Link>
                            <Link href="/club" className="block hover:text-primary-500 transition-colors">
                                Notre club
                            </Link>
                            <Link href="/sponsors" className="block hover:text-primary-500 transition-colors">
                                Sponsors
                            </Link>
                            <Link href="/gallery" className="block hover:text-primary-500 transition-colors">
                                Galerie
                            </Link>
                            <Link href="/contact" className="block hover:text-primary-500 transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Séparateur */}
                <div className="border-t border-border pt-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <div className="text-sm text-muted-foreground">
                            <p>&copy; {new Date().getFullYear()} Association Whitefox Cheer. Tous droits réservés.</p>
                        </div>

                        {/* Liens légaux */}
                        <div className="flex flex-row gap-4 text-sm">
                            <Link href="/mentions-legales" className="hover:text-primary-500 transition-colors">
                                Mentions légales
                            </Link>
                            <Link href="/plan-du-site" className="hover:text-primary-500 transition-colors">
                                Plan du site
                            </Link>
                        </div>
                    </div>

                    {/* Disclaimer légal simplifié */}
                    <div className="mt-6 text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg">
                        <p>
                            Ce site présente les activités de l&apos;association Whitefox Cheer.
                            Ce site utilise un outil de mesure d&apos;audience respectueux de la vie privée (Umami).
                            Aucun cookie n&apos;est utilisé et aucune donnée personnelle n&apos;est stockée.
                            Les statistiques sont collectées de manière anonyme afin d&apos;améliorer l&apos;expérience utilisateur.
                            Pour tout contact, utilisez l&apos;adresse email indiquée ci-dessus.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;