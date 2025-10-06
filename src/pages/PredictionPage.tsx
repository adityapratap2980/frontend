"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PredictionResults } from "@/components/prediction-results"
import { Brain, Stethoscope, AlertTriangle, Loader2 } from "lucide-react"

interface PredictionData {
  patientName: string
  species: string
  breed: string
  age: string
  weight: string
  gender: string
  symptoms: string
  labValues: {
    hemoglobin: string
    hematocrit: string
    redBloodCells: string
    mcv: string
    mch: string
    mchc: string
    tlc?: string
    platelet?: string
    reticulocyte?: string
    bun?: string
    creatinine?: string
    alt?: string
    ast?: string
    glucose?: string
  }
}

interface PredictionResult {
  riskLevel: "Low" | "Medium" | "High"
  confidence: number
  probability: number
  recommendations: string[]
  factors: Array<{ name: string; impact: number }>
}

export default function PredictionPage() {
  const [formData, setFormData] = useState<PredictionData>({
    patientName: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    gender: "",
    symptoms: "",
    labValues: {
      hemoglobin: "",
      hematocrit: "",
      redBloodCells: "",
      mcv: "",
      mch: "",
      mchc: "",
      tlc: "",
      platelet: "",
      reticulocyte: "",
      bun: "",
      creatinine: "",
      alt: "",
      ast: "",
      glucose: "",
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState("")

  const updateFormData = (field: string, value: string) => {
    if (field.startsWith("labValues.")) {
      const labField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        labValues: { ...prev.labValues, [labField]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const payload = {
        patient_id: formData.patientName,
        age: Number.parseFloat(formData.age),
        sex: formData.gender,
        body_weight: formData.weight ? Number.parseFloat(formData.weight) : 0,
        hb: Number.parseFloat(formData.labValues.hemoglobin),
        pcv: Number.parseFloat(formData.labValues.hematocrit),
        tec: Number.parseFloat(formData.labValues.redBloodCells),
        tlc: Number.parseFloat(formData.labValues.tlc || "0"),
        platelet: Number.parseFloat(formData.labValues.platelet || "0"),
        mcv: Number.parseFloat(formData.labValues.mcv),
        mchc: Number.parseFloat(formData.labValues.mchc),
        reticulocyte: Number.parseFloat(formData.labValues.reticulocyte || "0"),
        bun: Number.parseFloat(formData.labValues.bun || "0"),
        creatinine: Number.parseFloat(formData.labValues.creatinine || "0"),
        alt: Number.parseFloat(formData.labValues.alt || "0"),
        ast: Number.parseFloat(formData.labValues.ast || "0"),
        glucose: Number.parseFloat(formData.labValues.glucose || "0"),
      }

      const resp = await fetch(`${import.meta.env.VITE_BACKEND_SERVER}/api/predict/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!resp.ok) {
        throw new Error(`Server error: ${resp.status}`)
      }

      const data = await resp.json()

      const riskLevel: "Low" | "Medium" | "High" =
        data.severity === "Severe" || data.severity === "Moderate"
          ? data.probability >= 0.7
            ? "High"
            : "Medium"
          : data.probability >= 0.4
            ? "Medium"
            : "Low"

      const mapped: PredictionResult = {
        riskLevel,
        confidence: Math.round((1 - Math.abs(0.5 - (data.probability ?? 0.5)) * 2) * 100),
        probability: Math.round((data.probability ?? 0.0) * 100),
        recommendations: [
          `Severity: ${data.severity}`,
          `Type: ${data.anemia_type}`,
          `Regeneration: ${data.regeneration}`,
          `Prognosis: ${data.prognosis}`,
        ],
        factors: [
          { name: "MCV", impact: Math.min(100, Math.abs(70 - Number(payload.mcv || 0))) },
          { name: "MCHC", impact: Math.min(100, Math.abs(33 - Number(payload.mchc || 0)) * 2) },
          { name: "Hemoglobin", impact: Math.min(100, Math.abs(12 - Number(payload.hb || 0)) * 8) },
          { name: "Hematocrit", impact: Math.min(100, Math.abs(36 - Number(payload.pcv || 0)) * 3) },
        ],
      }

      setResult(mapped)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Prediction failed")
      } else {
        setError("Prediction failed")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      patientName: "",
      species: "",
      breed: "",
      age: "",
      weight: "",
      gender: "",
      symptoms: "",
      labValues: {
        hemoglobin: "",
        hematocrit: "",
        redBloodCells: "",
        mcv: "",
        mch: "",
        mchc: "",
      },
    })
    setResult(null)
    setError("")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Anemia Prediction</h1>
            <p className="text-muted-foreground">AI-powered anemia risk assessment for veterinary patients</p>
          </div>
          <Button variant="outline" onClick={resetForm}>
            New Assessment
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Patient Information & Lab Values
                </CardTitle>
                <CardDescription>Enter patient details and laboratory test results for ML analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Patient Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="patientName">Patient Name</Label>
                        <Input
                          id="patientName"
                          placeholder="e.g., Buddy"
                          value={formData.patientName}
                          onChange={(e) => updateFormData("patientName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="species">Species</Label>
                        <Select onValueChange={(value) => updateFormData("species", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select species" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dog">Dog</SelectItem>
                            <SelectItem value="cat">Cat</SelectItem>
                            <SelectItem value="rabbit">Rabbit</SelectItem>
                            <SelectItem value="bird">Bird</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="breed">Breed</Label>
                        <Input
                          id="breed"
                          placeholder="e.g., Golden Retriever"
                          value={formData.breed}
                          onChange={(e) => updateFormData("breed", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age (years)</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="e.g., 5"
                          value={formData.age}
                          onChange={(e) => updateFormData("age", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 25.5"
                          value={formData.weight}
                          onChange={(e) => updateFormData("weight", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select onValueChange={(value) => updateFormData("gender", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="neutered-male">Neutered Male</SelectItem>
                            <SelectItem value="spayed-female">Spayed Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Laboratory Values */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Laboratory Values</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
                        <Input
                          id="hemoglobin"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 12.5"
                          value={formData.labValues.hemoglobin}
                          onChange={(e) => updateFormData("labValues.hemoglobin", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hematocrit">Hematocrit (%)</Label>
                        <Input
                          id="hematocrit"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 37.5"
                          value={formData.labValues.hematocrit}
                          onChange={(e) => updateFormData("labValues.hematocrit", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="redBloodCells">RBC (×10⁶/μL)</Label>
                        <Input
                          id="redBloodCells"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 6.25"
                          value={formData.labValues.redBloodCells}
                          onChange={(e) => updateFormData("labValues.redBloodCells", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tlc">TLC (Thousand/μL)</Label>
                        <Input
                          id="tlc"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 11.5"
                          value={formData.labValues.tlc}
                          onChange={(e) => updateFormData("labValues.tlc", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="platelet">Platelets (×10³/μL)</Label>
                        <Input
                          id="platelet"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 250"
                          value={formData.labValues.platelet}
                          onChange={(e) => updateFormData("labValues.platelet", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mcv">MCV (fL)</Label>
                        <Input
                          id="mcv"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 68.5"
                          value={formData.labValues.mcv}
                          onChange={(e) => updateFormData("labValues.mcv", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mch">MCH (pg)</Label>
                        <Input
                          id="mch"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 22.3"
                          value={formData.labValues.mch}
                          onChange={(e) => updateFormData("labValues.mch", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mchc">MCHC (g/dL)</Label>
                        <Input
                          id="mchc"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 32.5"
                          value={formData.labValues.mchc}
                          onChange={(e) => updateFormData("labValues.mchc", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reticulocyte">Reticulocyte (×10³/μL)</Label>
                        <Input
                          id="reticulocyte"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 80"
                          value={formData.labValues.reticulocyte}
                          onChange={(e) => updateFormData("labValues.reticulocyte", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bun">BUN (mg/dL)</Label>
                        <Input
                          id="bun"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 21"
                          value={formData.labValues.bun}
                          onChange={(e) => updateFormData("labValues.bun", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
                        <Input
                          id="creatinine"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 1.0"
                          value={formData.labValues.creatinine}
                          onChange={(e) => updateFormData("labValues.creatinine", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alt">ALT (U/L)</Label>
                        <Input
                          id="alt"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 98"
                          value={formData.labValues.alt}
                          onChange={(e) => updateFormData("labValues.alt", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ast">AST (U/L)</Label>
                        <Input
                          id="ast"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 67"
                          value={formData.labValues.ast}
                          onChange={(e) => updateFormData("labValues.ast", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="glucose">Glucose (mg/dL)</Label>
                        <Input
                          id="glucose"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 95"
                          value={formData.labValues.glucose}
                          onChange={(e) => updateFormData("labValues.glucose", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clinical Symptoms */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Clinical Observations</h3>
                    <div className="space-y-2">
                      <Label htmlFor="symptoms">Symptoms & Clinical Notes</Label>
                      <Textarea
                        id="symptoms"
                        placeholder="Describe any observed symptoms, behavior changes, or clinical findings..."
                        value={formData.symptoms}
                        onChange={(e) => updateFormData("symptoms", e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Run AI Prediction
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
        {/* Results Panel */}
        <div>
          {isLoading && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-accent" />
                  AI Analysis in Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing lab values...</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Our ML model is analyzing the patient data and laboratory results to provide an accurate anemia risk
                  assessment.
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <PredictionResults
              result={result}
              patientName={formData.patientName}
              species={formData.species}
              breed={formData.breed}
              age={Number.parseFloat(formData.age || "0")}
              weight={Number.parseFloat(formData.weight || "0")}
              gender={formData.gender}
              symptoms={formData.symptoms}
              labValues={{
                hb: Number.parseFloat(formData.labValues.hemoglobin || "0"),
                pcv: Number.parseFloat(formData.labValues.hematocrit || "0"),
                tec: Number.parseFloat(formData.labValues.redBloodCells || "0"),
                tlc: Number.parseFloat(formData.labValues.tlc || "0"),
                platelet: Number.parseFloat(formData.labValues.platelet || "0"),
                mcv: Number.parseFloat(formData.labValues.mcv || "0"),
                mchc: Number.parseFloat(formData.labValues.mchc || "0"),
                reticulocyte: Number.parseFloat(formData.labValues.reticulocyte || "0"),
                bun: Number.parseFloat(formData.labValues.bun || "0"),
                creatinine: Number.parseFloat(formData.labValues.creatinine || "0"),
                alt: Number.parseFloat(formData.labValues.alt || "0"),
                ast: Number.parseFloat(formData.labValues.ast || "0"),
                glucose: Number.parseFloat(formData.labValues.glucose || "0"),
              }}
            />
          )}

          {!isLoading && !result && (
            <Card>
              <CardHeader>
                <CardTitle>AI Prediction Results</CardTitle>
                <CardDescription>Results will appear here after running the analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Enter patient information and lab values, then click "Run AI Prediction" to get started.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
