"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Stethoscope, Activity, FileText, Download, AlertTriangle, CheckCircle } from "lucide-react"

interface CaseRecord {
  id: string
  patientName: string
  species: string
  breed: string
  age: number
  owner: string
  date: string
  riskLevel: "Low" | "Medium" | "High"
  confidence: number
  probability: number
  status: "completed" | "pending" | "reviewed"
  labValues: {
    hemoglobin: number
    hematocrit: number
    redBloodCells: number
  }
  symptoms: string
  recommendations: string[]
  followUp?: string
}

interface CaseDetailsModalProps {
  case_: CaseRecord
  isOpen: boolean
  onClose: () => void
}

export function CaseDetailsModal({ case_, isOpen, onClose }: CaseDetailsModalProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "default"
      default:
        return "default"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "High":
        return AlertTriangle
      case "Medium":
        return AlertTriangle
      case "Low":
        return CheckCircle
      default:
        return CheckCircle
    }
  }

  const RiskIcon = getRiskIcon(case_.riskLevel)

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString()
    } catch {
      return iso
    }
  }

  const downloadClinicReport = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>VetAnemia - Case ${case_.id} Report</title>
  <style>
    @page { margin: 24mm; }
    body { font-family: Arial, Helvetica, sans-serif; color: #111827; line-height: 1.4; }
    .header { display:flex; align-items:center; justify-content:space-between; padding:0 0 12px 0; border-bottom:3px solid #e5e7eb; }
    .brand { display:flex; align-items:center; gap:12px; }
    .brand-logo { width:38px; height:38px; background:#eef2ff; color:#4338ca; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:800; }
    .title { font-size:22px; font-weight:700; }
    .subtitle { color:#6b7280; font-size:12px; }
    .section { margin:22px 0; }
    .section h2 { font-size:15px; margin:0 0 10px 0; color:#1f2937; border-left:4px solid #6366f1; padding-left:8px; }
    table { width:100%; border-collapse: separate; border-spacing: 0; }
    th, td { padding:10px 12px; font-size:13px; }
    th { text-align:left; background:#f3f4f6; color:#374151; border-top:1px solid #e5e7eb; border-bottom:1px solid #e5e7eb; }
    tr + tr td { border-top:1px solid #f1f5f9; }
    tr:nth-child(even) td { background:#fafafa; }
    .kv { width:38%; color:#6b7280; }
    .val { width:62%; font-weight:600; color:#111827; }
    .pill { display:inline-block; padding:4px 10px; border-radius:9999px; font-size:12px; font-weight:700; }
    .pill-high { background:#fee2e2; color:#991b1b; }
    .pill-med { background:#fef3c7; color:#92400e; }
    .pill-low { background:#dcfce7; color:#166534; }
    .card { border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; }
    .card-header { background:#f8fafc; padding:10px 12px; font-weight:700; color:#334155; border-bottom:1px solid #e5e7eb; }
    .card-body { padding:12px; }
    .muted { color:#6b7280; font-size:12px; }
    .footer { margin-top:24px; padding-top:10px; border-top:1px solid #e5e7eb; color:#6b7280; font-size:11px; display:flex; justify-content:space-between; }
  </style>
  </head>
  <body>
    <div class="header">
      <div class="brand">
        <div class="brand-logo">VA</div>
        <div>
          <div class="title">VetAnemia • Clinic Report</div>
          <div class="subtitle">Case ${case_.id} • ${formatDate(case_.date)}</div>
        </div>
      </div>
      <div class="subtitle">Generated ${new Date().toLocaleString()}</div>
    </div>

    <div class="section card">
      <div class="card-header">Patient Information</div>
      <div class="card-body">
        <table>
          <tbody>
            <tr><td class="kv">Patient</td><td class="val">${case_.patientName}</td></tr>
            <tr><td class="kv">Species</td><td class="val">${case_.species}</td></tr>
            <tr><td class="kv">Breed</td><td class="val">${case_.breed}</td></tr>
            <tr><td class="kv">Age</td><td class="val">${case_.age} years</td></tr>
            <tr><td class="kv">Status</td><td class="val">${case_.status}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="section card">
      <div class="card-header">AI Prediction Summary</div>
      <div class="card-body">
        <table>
          <thead>
            <tr><th>Metric</th><th>Value</th></tr>
          </thead>
          <tbody>
            <tr><td class="kv">Risk Level</td><td class="val">${case_.riskLevel}</td></tr>
            <tr><td class="kv">Anemia Probability</td><td class="val">${case_.probability}%</td></tr>
            <tr><td class="kv">Model Confidence</td><td class="val">${case_.confidence}%</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="section card">
      <div class="card-header">Laboratory Values</div>
      <div class="card-body">
        <table>
          <thead>
            <tr><th>Parameter</th><th>Result</th></tr>
          </thead>
          <tbody>
            <tr><td class="kv">Hemoglobin</td><td class="val">${case_.labValues.hemoglobin} g/dL</td></tr>
            <tr><td class="kv">Hematocrit</td><td class="val">${case_.labValues.hematocrit}%</td></tr>
            <tr><td class="kv">Red Blood Cells</td><td class="val">${case_.labValues.redBloodCells} ×10⁶/μL</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="section card">
      <div class="card-header">Clinical Notes & Recommendations</div>
      <div class="card-body">
        <div class="subtitle" style="margin-bottom:8px">Symptoms / Notes</div>
        <div style="border:1px solid #e5e7eb; border-radius:8px; padding:10px; background:#f8fafc">${case_.symptoms || '—'}</div>
        ${(case_.recommendations || []).length ? `<div class="subtitle" style="margin:14px 0 6px 0">Recommendations</div>` : ''}
        ${(case_.recommendations || []).length ? `<table><thead><tr><th>#</th><th>Recommendation</th></tr></thead><tbody>${(case_.recommendations || []).map((r, i) => `<tr><td class="kv">${i + 1}</td><td class="val">${r}</td></tr>`).join('')}</tbody></table>` : ''}
      </div>
    </div>

    ${case_.followUp ? `<div class="section card"><div class="card-header">Follow-up</div><div class="card-body"><table><tbody><tr><td class="kv">Scheduled</td><td class="val">${formatDate(case_.followUp)}</td></tr></tbody></table></div></div>` : ''}

    <div class="footer">
      <div>VetAnemia • ML Diagnostics</div>
      <div>Confidential clinical document</div>
    </div>
  </body>
</html>`

    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `VetAnemia_Case_${case_.id}_Report.doc`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1100px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`/ceholder-svg-key-modal-.jpg?key=modal-${case_.id}&height=40&width=40&query=${case_.species.toLowerCase()}`}
              />
              <AvatarFallback>{case_.patientName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <span>
                {case_.patientName} - Case {case_.id}
              </span>
              <p className="text-sm text-muted-foreground font-normal">
                {case_.breed} • {case_.species} • {case_.age} years old
              </p>
            </div>
          </DialogTitle>
          <DialogDescription>Detailed anemia prediction analysis and case information</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-1">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Owner</p>
                  <p className="text-foreground">{case_.owner}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Date</p>
                  <p className="text-foreground">{new Date(case_.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Species</p>
                  <p className="text-foreground">{case_.species}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Breed</p>
                  <p className="text-foreground">{case_.breed}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Age</p>
                  <p className="text-foreground">{case_.age} years</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Status</p>
                  <Badge variant="outline">{case_.status}</Badge>
                </div>
              </div>

              {case_.followUp && (
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium text-accent-foreground">Follow-up Scheduled</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(case_.followUp).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prediction Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                AI Prediction Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div
                    className={`p-3 rounded-full ${case_.riskLevel === "High"
                      ? "bg-destructive/10"
                      : case_.riskLevel === "Medium"
                        ? "bg-secondary/10"
                        : "bg-green-100"
                      }`}
                  >
                    <RiskIcon
                      className={`h-8 w-8 ${case_.riskLevel === "High"
                        ? "text-destructive"
                        : case_.riskLevel === "Medium"
                          ? "text-secondary-foreground"
                          : "text-green-600"
                        }`}
                    />
                  </div>
                </div>

                <div>
                  <Badge variant={getRiskColor(case_.riskLevel)} className="text-lg px-4 py-2">
                    {case_.riskLevel} Risk
                  </Badge>
                  <p className="text-2xl font-bold mt-2">{case_.probability}%</p>
                  <p className="text-sm text-muted-foreground">Anemia Probability</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Model Confidence</span>
                  <span>{case_.confidence}%</span>
                </div>
                <Progress value={case_.confidence} />
              </div>
            </CardContent>
          </Card>

          {/* Laboratory Values */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Laboratory Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="font-medium">Hemoglobin</span>
                  <span
                    className={`font-bold ${case_.labValues.hemoglobin < 10 ? "text-destructive" : "text-foreground"}`}
                  >
                    {case_.labValues.hemoglobin} g/dL
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="font-medium">Hematocrit</span>
                  <span
                    className={`font-bold ${case_.labValues.hematocrit < 30 ? "text-destructive" : "text-foreground"}`}
                  >
                    {case_.labValues.hematocrit}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="font-medium">Red Blood Cells</span>
                  <span
                    className={`font-bold ${case_.labValues.redBloodCells < 5.5 ? "text-destructive" : "text-foreground"}`}
                  >
                    {case_.labValues.redBloodCells} ×10⁶/μL
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Notes & Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Clinical Notes & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Symptoms Observed</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{case_.symptoms}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">AI Recommendations</h4>
                <ul className="space-y-2">
                  {case_.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={downloadClinicReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>

          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
