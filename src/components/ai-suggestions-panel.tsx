"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Lightbulb, TrendingUp, CheckCircle, Clock, Stethoscope, Activity } from "lucide-react"

interface AISuggestion {
  id: string
  type: "diagnostic" | "treatment" | "monitoring" | "preventive"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  reasoning: string
  confidence: number
  timeframe: string
  relatedFactors: string[]
}

interface AISuggestionsProps {
  patientData?: {
    species: string
    age: number
    riskLevel: string
    labValues: {
      hemoglobin: number
      hematocrit: number
    }
  }
  showAll?: boolean
}

export function AISuggestionsPanel({ patientData, showAll = false }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = useState(true)



  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const predictionRaw = localStorage.getItem('last_prediction')
    if (!token || !predictionRaw) {
      setSuggestions([])
      setIsLoading(false)
      return
    }
    const prediction = JSON.parse(predictionRaw)
    fetch(`${import.meta.env.VITE_BACKEND_SERVER}/api/ai/suggestions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ prediction, patient: patientData }),
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        const items = (data?.suggestions || []) as AISuggestion[]
        setSuggestions(showAll ? items : items.slice(0, 5))
      })
      .catch(() => setSuggestions([]))
      .finally(() => setIsLoading(false))
  }, [patientData, showAll])



  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-lime-600 animate-pulse" />
            Generating AI Suggestions...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const groupedSuggestions = suggestions.reduce(
    (acc, suggestion) => {
      if (!acc[suggestion.type]) {
        acc[suggestion.type] = []
      }
      acc[suggestion.type].push(suggestion)
      return acc
    },
    {} as Record<string, AISuggestion[]>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-lime-600" />
          AI Clinical Suggestions
        </CardTitle>
        <CardDescription>
          Personalized recommendations based on ML analysis and veterinary best practices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showAll ? (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
              <TabsTrigger value="treatment">Treatment</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="preventive">Preventive</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {suggestions.map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </TabsContent>

            {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
              <TabsContent key={type} value={type} className="space-y-4">
                {typeSuggestions.map((suggestion) => (
                  <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} compact />
            ))}


          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface SuggestionCardProps {
  suggestion: AISuggestion
  compact?: boolean
}

function SuggestionCard({ suggestion, compact = false }: SuggestionCardProps) {
  const TypeIcon = getTypeIcon(suggestion.type)
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg bg-muted ${getTypeColor(suggestion.type)}`}>
            <TypeIcon className="h-4 w-4" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-foreground">{suggestion.title}</h4>
              <Badge variant={getPriorityColor(suggestion.priority)} className="text-xs">
                {suggestion.priority} priority
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {suggestion.type}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">{suggestion.description}</p>

            {!compact && (
              <>
                <div className="bg-muted/50 p-3 rounded text-xs">
                  <p className="font-medium mb-1">Clinical Reasoning:</p>
                  <p className="text-muted-foreground">{suggestion.reasoning}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {suggestion.timeframe}
                  </div>
                  <div className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    {suggestion.confidence}% confidence
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {compact && (
          <div className="text-right text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {suggestion.timeframe}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Brain className="h-3 w-3" />
              {suggestion.confidence}%
            </div>
          </div>
        )}
      </div>

      {!compact && suggestion.relatedFactors.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {suggestion.relatedFactors.map((factor, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {factor}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function getTypeIcon(type: string) {
  switch (type) {
    case "diagnostic":
      return Stethoscope
    case "treatment":
      return Activity
    case "monitoring":
      return TrendingUp
    case "preventive":
      return CheckCircle
    default:
      return Lightbulb
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "diagnostic":
      return "text-blue-600"
    case "treatment":
      return "text-red-600"
    case "monitoring":
      return "text-amber-600"
    case "preventive":
      return "text-green-600"
    default:
      return "text-lime-600"
  }
}
