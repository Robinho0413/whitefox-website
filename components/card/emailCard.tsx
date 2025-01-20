import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function EmailCard() {
  return (
    <Card className="md:w-[350px]">
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>Notre adresse email</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">contact@club-sportif.fr</Label>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
