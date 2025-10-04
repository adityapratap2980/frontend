"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useEffect } from "react"
import { Brain, Search, TrendingUp, Lightbulb, Activity, Stethoscope } from "lucide-react"
import { useState } from "react"

interface CaseItem {
    id: string | number
    patientName: string
    species: string
    breed: string
    age: number
    riskLevel: "Low" | "Medium" | "High" | string
    probability: number
    severity?: string
    anemia_type?: string
    regeneration?: string
    prognosis?: string
    labValues?: Record<string, number>
}

interface SuggestionItem {
    id: string
    type: "diagnostic" | "treatment" | "monitoring" | "preventive" | string
    priority: "high" | "medium" | "low" | string
    title: string
    description: string
    reasoning: string
    confidence: number
    timeframe: string
    relatedFactors: string[]
}

export default function AISuggestionsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [filterPriority, setFilterPriority] = useState("all")
    const [stats, setStats] = useState({ totalSuggestions: 0, highPriority: 0, implemented: 0, avgAccuracy: 0 })
    const [cases, setCases] = useState<CaseItem[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [modalSuggestions, setModalSuggestions] = useState<SuggestionItem[]>([])

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        if (!token) return
            ; (async () => {
                try {
                    const [s, c] = await Promise.all([
                        fetch('http://localhost:8000/api/ai/stats/', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : Promise.reject(r.status)),
                        fetch('http://localhost:8000/api/cases/', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : Promise.reject(r.status)),
                    ])
                    setStats(s)
                    setCases((c.results || []) as CaseItem[])
                } catch {
                    // ignore
                }
            })()
    }, [])

    const generateForCase = async (c: CaseItem) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
            if (!token) return
            setModalLoading(true)
            setModalOpen(true)
            const prediction = {
                probability: c.probability,
                severity: c.severity,
                anemia_type: c.anemia_type,
                regeneration: c.regeneration,
                prognosis: c.prognosis,
                lab_parameters: c.labValues || {},
            }
            const resp = await fetch('http://localhost:8000/api/ai/suggestions/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ prediction, patient: { species: c.species, age: c.age, riskLevel: c.riskLevel } }),
            })
            const data = await resp.json()
            setModalSuggestions((data.suggestions || []) as SuggestionItem[])
        } catch {
            setModalSuggestions([])
        } finally {
            setModalLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">AI Clinical Suggestions</h1>
                        <p className="text-muted-foreground">Comprehensive AI-powered clinical recommendations and insights</p>
                    </div>
                    <Button>
                        <Brain className="mr-2 h-4 w-4" />
                        Generate New Insights
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Suggestions</p>
                                    <p className="text-2xl font-bold">{stats.totalSuggestions}</p>
                                </div>
                                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Lightbulb className="h-4 w-4 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                                    <p className="text-2xl font-bold text-destructive">{stats.highPriority}</p>
                                </div>
                                <div className="h-8 w-8 bg-destructive/10 rounded-full flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4 text-destructive" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Implemented</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.implemented}</p>
                                </div>
                                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Activity className="h-4 w-4 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Avg Accuracy</p>
                                    <p className="text-2xl font-bold">{stats.avgAccuracy}%</p>
                                </div>
                                <div className="h-8 w-8 bg-accent/10 rounded-full flex items-center justify-center">
                                    <Brain className="h-4 w-4 text-accent" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Suggestions</CardTitle>
                        <CardDescription>Search and filter AI clinical recommendations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search suggestions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="diagnostic">Diagnostic</SelectItem>
                                    <SelectItem value="treatment">Treatment</SelectItem>
                                    <SelectItem value="monitoring">Monitoring</SelectItem>
                                    <SelectItem value="preventive">Preventive</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filterPriority} onValueChange={setFilterPriority}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="high">High Priority</SelectItem>
                                    <SelectItem value="medium">Medium Priority</SelectItem>
                                    <SelectItem value="low">Low Priority</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Cases List with per-case AI Suggestion */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Cases</CardTitle>
                        <CardDescription>Generate AI suggestions for any case</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {cases.map((c) => (
                            <div key={c.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-border rounded-lg">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{c.id}</Badge>
                                        <span className="font-medium">{c.patientName}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{c.breed} • {c.species} • {c.age} years</p>
                                </div>
                                <div className="flex items-center gap-3 mt-3 md:mt-0">
                                    <Badge variant="secondary">{c.riskLevel}</Badge>
                                    <span className="text-xs text-muted-foreground">{Math.round((c.probability || 0) * 100)}% probability</span>
                                    <Button size="sm" onClick={() => generateForCase(c)}>
                                        Generate AI Suggestion
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {cases.length === 0 && (
                            <p className="text-sm text-muted-foreground">No cases found.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Suggestions Modal (simple overlay) */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-3xl bg-background border border-border rounded-lg shadow-lg">
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <h3 className="font-medium">AI Suggestions</h3>
                                <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Close</Button>
                            </div>
                            <div className="p-4 max-h-[70vh] overflow-auto">
                                {modalLoading ? (
                                    <div className="py-6 text-center text-muted-foreground">Generating suggestions...</div>
                                ) : (
                                    <div className="space-y-3">
                                        {modalSuggestions.map((s) => (
                                            <div key={s.id} className="border border-border rounded p-3">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="capitalize">{s.type}</Badge>
                                                    <Badge variant={s.priority === 'high' ? 'destructive' : s.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs">
                                                        {s.priority} priority
                                                    </Badge>
                                                </div>
                                                <h4 className="font-medium mt-2">{s.title}</h4>
                                                <p className="text-sm text-muted-foreground">{s.description}</p>
                                                <p className="text-xs text-muted-foreground mt-1">Reasoning: {s.reasoning}</p>
                                                <div className="text-xs text-muted-foreground mt-1">Timeframe: {s.timeframe} • Confidence: {s.confidence}%</div>
                                                {Array.isArray(s.relatedFactors) && s.relatedFactors.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {s.relatedFactors.map((f, i) => (
                                                            <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {modalSuggestions.length === 0 && (
                                            <div className="py-4 text-center text-muted-foreground">No suggestions returned.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-accent" />
                            Recent AI Insights
                        </CardTitle>
                        <CardDescription>Latest patterns and trends identified by our AI system</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 border border-border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Stethoscope className="h-4 w-4 text-blue-600" />
                                    <Badge variant="outline">Pattern Recognition</Badge>
                                </div>
                                <h4 className="font-medium mb-1">Seasonal Anemia Trends</h4>
                                <p className="text-sm text-muted-foreground">
                                    AI detected 23% increase in iron deficiency cases during winter months in senior dogs.
                                </p>
                            </div>

                            <div className="p-4 border border-border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="h-4 w-4 text-amber-600" />
                                    <Badge variant="outline">Predictive Analytics</Badge>
                                </div>
                                <h4 className="font-medium mb-1">Early Detection Improvement</h4>
                                <p className="text-sm text-muted-foreground">
                                    Model accuracy improved by 4.2% with integration of breed-specific risk factors.
                                </p>
                            </div>

                            <div className="p-4 border border-border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="h-4 w-4 text-red-600" />
                                    <Badge variant="outline">Treatment Optimization</Badge>
                                </div>
                                <h4 className="font-medium mb-1">Iron Supplementation Protocol</h4>
                                <p className="text-sm text-muted-foreground">
                                    AI suggests dosage adjustments based on patient response patterns show 18% faster recovery.
                                </p>
                            </div>

                            <div className="p-4 border border-border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="h-4 w-4 text-green-600" />
                                    <Badge variant="outline">Clinical Insights</Badge>
                                </div>
                                <h4 className="font-medium mb-1">Breed-Specific Recommendations</h4>
                                <p className="text-sm text-muted-foreground">
                                    Golden Retrievers show better response to combined iron and B12 supplementation protocols.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
