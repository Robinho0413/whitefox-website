import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre club",
  description:
    "Decouvrez l'association Whitefox Cheer a Brive-la-Gaillarde: valeurs, encadrement et activites de cheerleading et danse pompom.",
  alternates: {
    canonical: "/club",
  },
};

export default function ClubLayout({ children }: { children: React.ReactNode }) {
  return children;
}
