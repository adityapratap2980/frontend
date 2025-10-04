import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, Bell } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "critical",
    title: "High Risk Patient",
    message: "Buddy (Golden Retriever) shows 92% anemia probability",
    time: "5 min ago",
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: "warning",
    title: "Model Update Available",
    message: "New ML model version 2.1 ready for deployment",
    time: "1 hour ago",
    icon: Clock,
  },
  {
    id: 3,
    type: "success",
    title: "Prediction Confirmed",
    message: "Luna's anemia diagnosis confirmed by lab results",
    time: "2 hours ago",
    icon: CheckCircle,
  },
]

export function AlertsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alerts & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
            <div
              className={`p-1 rounded-full ${
                alert.type === "critical"
                  ? "bg-destructive/10"
                  : alert.type === "warning"
                    ? "bg-accent/10"
                    : "bg-green-100"
              }`}
            >
              <alert.icon
                className={`h-4 w-4 ${
                  alert.type === "critical"
                    ? "text-destructive"
                    : alert.type === "warning"
                      ? "text-accent"
                      : "text-green-600"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{alert.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full bg-transparent" size="sm">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  )
}
