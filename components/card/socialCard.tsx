import * as React from "react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { InstagramIcon } from "@/components/icons/InstagramIcon"
import { TikTokIcon } from "@/components/icons/TikTokIcon"

export function SocialCard() {
  return (
    <Card className="h-full md:w-[350px]" style={{ boxShadow: "0 10px 25px -3px rgba(59, 165, 155, 0.1), 0 4px 6px -2px rgba(59, 165, 155, 0.05)" }}>
      <CardHeader>
        <CardTitle>Réseaux sociaux</CardTitle>
        <CardDescription>Suivez-nous !</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-3">
          <Link
            href="https://www.instagram.com/whitefox_cheer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-primary-500 transition-colors"
          >
            <InstagramIcon size={20} />
            <span>@whitefox_cheer</span>
          </Link>
          <Link
            href="https://www.tiktok.com/@whitefox_cheer_poms"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-primary-500 transition-colors"
          >
            <TikTokIcon size={20} />
            <span>@whitefox_cheer_poms</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
