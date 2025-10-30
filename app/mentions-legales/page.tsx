import React from 'react';

export const metadata = {
    title: 'Mentions légales - Association Whitefox',
    description: 'Mentions légales de l&apos;association Whitefox - Cheerleading et Pom-pom girls à Brive-la-Gaillarde',
};

export default function MentionsLegales() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 relative inline-block">
                Mentions légales
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 animate-underline"></span>
            </h1>

            <div className="prose prose-lg max-w-none space-y-8">
                {/* Éditeur du site */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary-500">Éditeur du site</h2>
                    <div className="bg-muted/30 p-6 rounded-lg">
                        <p><strong>Nom :</strong> Association Whitefox</p>
                        <p><strong>Statut :</strong> Association loi 1901</p>
                        <p><strong>Siège social :</strong><br />
                        [Adresse à compléter]<br />
                        19100 Brive-la-Gaillarde<br />
                        France</p>
                        <p><strong>Email :</strong> foxcheer1@gmail.com</p>
                        <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
                        <p><strong>RNA :</strong> [Numéro d'enregistrement à compléter]</p>
                        <p><strong>SIRET :</strong> [Si applicable]</p>
                    </div>
                </section>

                {/* Directeur de publication */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary-500">Directeur de publication</h2>
                    <div className="bg-muted/30 p-6 rounded-lg">
                        <p><strong>Nom :</strong> [Nom du Président de l'association]</p>
                        <p><strong>Qualité :</strong> Président de l'association Whitefox</p>
                        <p><strong>Contact :</strong> foxcheer1@gmail.com</p>
                    </div>
                </section>

                {/* Hébergement */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary-500">Hébergement</h2>
                    <div className="bg-muted/30 p-6 rounded-lg">
                        <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                        <p><strong>Adresse :</strong><br />
                        340 S Lemon Ave #4133<br />
                        Walnut, CA 91789<br />
                        États-Unis</p>
                        <p><strong>Site web :</strong> <a href="https://vercel.com" className="text-primary-500 hover:underline" target="_blank" rel="noopener noreferrer">vercel.com</a></p>
                    </div>
                </section>

                {/* Propriété intellectuelle */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary-500">Propriété intellectuelle</h2>
                    <div className="space-y-4">
                        <p>
                            L&apos;ensemble de ce site relève de la législation française et internationale sur le droit d&apos;auteur 
                            et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour 
                            les documents téléchargeables et les représentations iconographiques et photographiques.
                        </p>
                        <p>
                            La reproduction de tout ou partie de ce site sur un support électronique quel qu&apos;il soit est 
                            formellement interdite sauf autorisation expresse du directeur de publication.
                        </p>
                        <p>
                            Les marques et logos figurant sur le site sont la propriété exclusive de l&apos;association Whitefox.
                        </p>
                    </div>
                </section>

                {/* Données personnelles */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary-500">Données personnelles</h2>
                    <div className="space-y-4">
                        <p>
                            <strong>Site vitrine :</strong> Ce site est un site vitrine qui présente les activités de 
                            l&apos;association Whitefox. Aucune donnée personnelle n&apos;est collectée automatiquement lors de 
                            votre navigation sur ce site.
                        </p>
                        <p>
                            Pour tout contact, veuillez utiliser l&apos;adresse email mentionnée ci-dessus. Toute correspondance 
                            sera traitée dans le respect de votre vie privée et ne sera pas transmise à des tiers.
                        </p>
                    </div>
                </section>

                {/* Cookies */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary-500">Cookies</h2>
                    <div className="space-y-4">
                        <p>
                            Ce site peut utiliser des cookies techniques nécessaires à son bon fonctionnement. 
                            Ces cookies ne collectent aucune donnée personnelle et ne sont pas transmis à des tiers.
                        </p>
                        <p>
                            Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter 
                            certaines fonctionnalités du site.
                        </p>
                    </div>
                </section>

                {/* Responsabilité */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary-500">Limitation de responsabilité</h2>
                    <div className="space-y-4">
                        <p>
                            L&apos;association Whitefox s&apos;efforce de fournir des informations exactes et à jour sur ce site. 
                            Toutefois, elle ne peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations 
                            mises à disposition.
                        </p>
                        <p>
                            L&apos;association Whitefox ne pourra être tenue responsable des dommages directs ou indirects 
                            causés au matériel de l&apos;utilisateur lors de l&apos;accès au site.
                        </p>
                    </div>
                </section>

                {/* Droit applicable */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-primary-500">Droit applicable</h2>
                    <div className="space-y-4">
                        <p>
                            Les présentes mentions légales sont régies par le droit français. En cas de litige, 
                            les tribunaux français seront seuls compétents.
                        </p>
                    </div>
                </section>

                {/* Contact */}
                <section className="border-t pt-8">
                    <h2 className="text-2xl font-semibold mb-4 text-primary-500">Contact</h2>
                    <div className="bg-primary-50 dark:bg-primary-950 p-6 rounded-lg">
                        <p>
                            Pour toute question relative aux présentes mentions légales ou au site en général, 
                            vous pouvez nous contacter :
                        </p>
                        <p className="mt-2">
                            <strong>Email :</strong> foxcheer1@gmail.com<br />
                            <strong>Téléphone :</strong> +33 1 23 45 67 89
                        </p>
                    </div>
                </section>
            </div>

            <div className="mt-12 text-sm text-muted-foreground">
                <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
        </div>
    );
}