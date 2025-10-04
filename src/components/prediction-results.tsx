import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, AlertTriangle, CheckCircle, FileText, Download } from "lucide-react"
import { useEffect, useState } from "react"
import { AISuggestionsPanel } from "./ai-suggestions-panel"

interface PredictionResult {
  riskLevel: "Low" | "Medium" | "High"
  confidence: number
  probability: number
  recommendations: string[]
  factors: Array<{ name: string; impact: number }>
}

interface PredictionResultsProps {
  result: PredictionResult
  patientName: string
  species: string
  breed: string
  age: number
  weight: number
  gender: string
  symptoms: string
  labValues: {
    hb: number
    pcv: number
    tec: number
    tlc: number
    platelet: number
    mcv: number
    mchc: number
    reticulocyte: number
    bun: number
    creatinine: number
    alt: number
    ast: number
    glucose: number
  }
}

export function PredictionResults({ result, patientName, species, breed, age, weight, gender, symptoms, labValues }: PredictionResultsProps) {
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string>("")
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

  const RiskIcon = getRiskIcon(result.riskLevel)

  // Persist the latest prediction for AI suggestions
  useEffect(() => {
    try {
      const severity = result.recommendations.find(r => r.startsWith('Severity:'))?.split(': ').pop() || ''
      const anemia_type = result.recommendations.find(r => r.startsWith('Type:'))?.split(': ').pop() || ''
      const regeneration = result.recommendations.find(r => r.startsWith('Regeneration:'))?.split(': ').pop() || ''
      const prognosis = result.recommendations.find(r => r.startsWith('Prognosis:'))?.split(': ').pop() || ''
      const predictionPayload = {
        probability: (typeof result.probability === 'number' ? result.probability : Number(result.probability)) / 100,
        severity,
        anemia_type,
        regeneration,
        prognosis,
        lab_parameters: {
          hb: labValues.hb,
          pcv: labValues.pcv,
          tec: labValues.tec,
          tlc: labValues.tlc,
          platelet: labValues.platelet,
          mcv: labValues.mcv,
          mchc: labValues.mchc,
          reticulocyte: labValues.reticulocyte,
          bun: labValues.bun,
          creatinine: labValues.creatinine,
          alt: labValues.alt,
          ast: labValues.ast,
          glucose: labValues.glucose,
        }
      }
      localStorage.setItem('last_prediction', JSON.stringify(predictionPayload))
    } catch {
      // ignore persist errors
    }
  }, [result, labValues])

  return (
    <div className="space-y-4">
      {/* Main Result */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            AI Prediction Results
          </CardTitle>
          <CardDescription>Analysis for {patientName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div
                className={`p-3 rounded-full ${result.riskLevel === "High"
                  ? "bg-destructive/10"
                  : result.riskLevel === "Medium"
                    ? "bg-secondary/10"
                    : "bg-green-100"
                  }`}
              >
                <RiskIcon
                  className={`h-8 w-8 ${result.riskLevel === "High"
                    ? "text-destructive"
                    : result.riskLevel === "Medium"
                      ? "text-secondary-foreground"
                      : "text-green-600"
                    }`}
                />
              </div>
            </div>

            <div>
              <Badge variant={getRiskColor(result.riskLevel)} className="text-lg px-4 py-2">
                {result.riskLevel} Risk
              </Badge>
              <p className="text-2xl font-bold mt-2">{result.probability}%</p>
              <p className="text-sm text-muted-foreground">Anemia Probability</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Model Confidence</span>
              <span>{result.confidence.toFixed(1)}%</span>
            </div>
            <Progress value={result.confidence} />
          </div>

          {result.riskLevel === "High" && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                High anemia risk detected. Immediate veterinary attention recommended.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Contributing Factors</CardTitle>
          <CardDescription>Key factors influencing the prediction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.factors.map((factor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{factor.name}</span>
                <span>{factor.impact}% impact</span>
              </div>
              <Progress value={factor.impact} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Lab Parameters Pie */}
      <Card>
        <CardHeader>
          <CardTitle>Lab Parameters Breakdown</CardTitle>
          <CardDescription>Relative contribution of selected lab values</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={result.factors.map((f) => ({ name: f.name, value: Math.max(1, f.impact) }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  label
                >
                  {result.factors.map((_, idx) => (
                    <Cell key={`c-${idx}`} fill={["#ef4444", "#f59e0b", "#10b981", "#3b82f6"][idx % 4]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions Panel */}
      <AISuggestionsPanel
        key={`${result.riskLevel}-${result.probability}-${labValues.hb}-${labValues.pcv}`}
        patientData={{
          species,
          age,
          riskLevel: result.riskLevel,
          labValues: {
            hemoglobin: labValues.hb,
            hematocrit: labValues.pcv,
          },
        }}
      />

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>Suggested next steps based on the analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" disabled={saving} onClick={async () => {
            try {
              setSaving(true)
              setSaveMsg("")
              const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
              if (!token) {
                setSaveMsg('Please login first')
                setSaving(false)
                return
              }
              // We only have partial context in this component; send essentials
              const payload = {
                patientName: patientName,
                species,
                breed,
                age,
                weight,
                gender,
                symptoms,
                riskLevel: result.riskLevel,
                probability: result.probability,
                severity: result.recommendations.find(r => r.startsWith('Severity:'))?.split(': ').pop() || '',
                anemia_type: result.recommendations.find(r => r.startsWith('Type:'))?.split(': ').pop() || '',
                regeneration: result.recommendations.find(r => r.startsWith('Regeneration:'))?.split(': ').pop() || '',
                prognosis: result.recommendations.find(r => r.startsWith('Prognosis:'))?.split(': ').pop() || '',
                labValues: {
                  hb: labValues.hb,
                  pcv: labValues.pcv,
                  tec: labValues.tec,
                  tlc: labValues.tlc,
                  platelet: labValues.platelet,
                  mcv: labValues.mcv,
                  mchc: labValues.mchc,
                  reticulocyte: labValues.reticulocyte,
                  bun: labValues.bun,
                  creatinine: labValues.creatinine,
                  alt: labValues.alt,
                  ast: labValues.ast,
                  glucose: labValues.glucose,
                },
              }
              const resp = await fetch('http://localhost:8000/api/cases/create/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload),
              })
              if (!resp.ok) {
                const e = await resp.json().catch(() => ({}))
                throw new Error(e.detail || `Save failed (${resp.status})`)
              }
              setSaveMsg('Saved to Case History')
            } catch {
              setSaveMsg('Save failed')
            } finally {
              setSaving(false)
            }
          }}>
            <FileText className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save to Case History'}
          </Button>
          {saveMsg && <p className="text-xs text-muted-foreground text-center">{saveMsg}</p>}
          <Button variant="outline" className="w-full bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}
