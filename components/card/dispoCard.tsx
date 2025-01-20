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

export function DispoCard() {
  return (
    <Card className="md:w-[350px]">
      <CardHeader>
        <CardTitle>Horaires d'ouverture</CardTitle>
        <CardDescription>Horaires à laquelle vous pouvez nous joindre</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Lundi - Vendredi : 9h00 - 18h00</Label>
              <Label htmlFor="name">Samedi : 10h00 - 14h00</Label>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
