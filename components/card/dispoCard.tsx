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
    <Card className="md:w-[350px]" style={{ boxShadow: "0 10px 25px -3px rgba(59, 165, 155, 0.1), 0 4px 6px -2px rgba(59, 165, 155, 0.05)" }}>
      <CardHeader>
        <CardTitle>Horaires d'ouverture</CardTitle>
        <CardDescription>Horaires de nos entraînements</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Samedi : 9h00 - 13h00</Label>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
