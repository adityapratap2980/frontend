import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"

export interface RecentCaseItem {
  id: string
  patientName: string
  species: string
  breed: string
  prediction: "High Risk" | "Medium Risk" | "Low Risk"
  confidence: number
  date: string
  status: string
}

export function RecentCases({ items = [] as RecentCaseItem[] }: { items?: RecentCaseItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((case_) => (
        <div key={case_.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`/abstract-geometric-shapes.png?height=40&width=40&query=${case_.species.toLowerCase()}`} />
              <AvatarFallback>{case_.patientName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{case_.patientName}</p>
              <p className="text-sm text-muted-foreground">
                {case_.breed} • {case_.species}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <Badge
                variant={
                  case_.prediction === "High Risk"
                    ? "destructive"
                    : case_.prediction === "Medium Risk"
                      ? "secondary"
                      : "default"
                }
              >
                {case_.prediction}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">{case_.confidence}% confidence</p>
            </div>

          </div>
        </div>
      ))}

      <Button variant="outline" className="w-full bg-transparent">
        <Link to="/dashboard/cases" className="w-full block">
        View All Cases
         </Link>
      </Button>
    </div>
  )
}
