import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function EmailCard() {
  return (
    <Card className="h-full md:w-[350px]" style={{ boxShadow: "0 10px 25px -3px rgba(59, 165, 155, 0.1), 0 4px 6px -2px rgba(59, 165, 155, 0.05)" }}>
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>Notre adresse email</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">foxcheer1@gmail.com</Label>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
