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

export function PhoneCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Téléphone</CardTitle>
        <CardDescription>Notre numéro de téléphone</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">+33 1 23 45 67 89</Label>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
