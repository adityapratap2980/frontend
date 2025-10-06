"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CaseDetailsModal } from "@/components/case-details-modal"
import { Search, Calendar, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react"

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

const mockCases: CaseRecord[] = []

export default function CasesPage() {
    const [cases, setCases] = useState<CaseRecord[]>(mockCases)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [filterRisk, setFilterRisk] = useState<string>("all")
    const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const filteredCases = cases.filter((case_) => {
        const matchesSearch =
            case_.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            case_.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            case_.breed.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = filterStatus === "all" || case_.status === filterStatus
        const matchesRisk = filterRisk === "all" || case_.riskLevel === filterRisk

        return matchesSearch && matchesStatus && matchesRisk
    })

    const getRiskBadgeVariant = (risk: string) => {
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

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "completed":
                return "default"
            case "pending":
                return "secondary"
            case "reviewed":
                return "outline"
            default:
                return "outline"
        }
    }

    const getTrendIcon = (risk: string) => {
        switch (risk) {
            case "High":
                return <TrendingUp className="h-4 w-4 text-destructive" />
            case "Medium":
                return <Minus className="h-4 w-4 text-secondary-foreground" />
            case "Low":
                return <TrendingDown className="h-4 w-4 text-green-600" />
            default:
                return <Minus className="h-4 w-4" />
        }
    }

    const openCaseDetails = (case_: CaseRecord) => {
        setSelectedCase(case_)
        setIsModalOpen(true)
    }

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        if (!token) return
            ; (async () => {
                try {
                    const resp = await fetch(`${import.meta.env.VITE_BACKEND_SERVER}/api/cases/`, { headers: { Authorization: `Bearer ${token}` } })
                    if (!resp.ok) return
                    const data = await resp.json()
                    const mapped: CaseRecord[] = (data.results || []).map((c: any) => ({
                        id: String(c.id),
                        patientName: c.patientName || 'Unknown',
                        species: c.species || 'Unknown',
                        breed: c.breed || 'Unknown',
                        age: Number(c.age || 0),
                        owner: '',
                        date: c.createdAt || new Date().toISOString(),
                        riskLevel: c.riskLevel as any,
                        confidence: Math.round(Math.max(c.probability || 0.5, 1 - (c.probability || 0.5)) * 100),
                        probability: Math.round((c.probability || 0) * 100),
                        status: 'completed',
                        labValues: {
                            hemoglobin: c.labValues?.hb ?? 0,
                            hematocrit: c.labValues?.pcv ?? 0,
                            redBloodCells: c.labValues?.tec ?? 0,
                        },
                        symptoms: c.symptoms || '',
                        recommendations: [
                            `Severity: ${c.severity}`,
                            `Type: ${c.anemia_type}`,
                            `Regeneration: ${c.regeneration}`,
                            `Prognosis: ${c.prognosis}`,
                        ],
                    }))
                    setCases(mapped)
                } catch {
                    // ignore
                }
            })()
    }, [])

    const stats = {
        total: cases.length,
        highRisk: cases.filter((c) => c.riskLevel === "High").length,
        pending: cases.filter((c) => c.status === "pending").length,
        thisWeek: cases.filter((c) => new Date(c.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Case History</h1>
                        <p className="text-muted-foreground">Manage and review anemia prediction cases</p>
                    </div>
                   
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                                    <p className="text-2xl font-bold text-destructive">{stats.highRisk}</p>
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
                                    <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                                    <p className="text-2xl font-bold text-lime-600">{stats.pending}</p>
                                </div>
                                <div className="h-8 w-8 bg-accent/10 rounded-full flex items-center justify-center">
                                    <Eye className="h-4 w-4 text-lime-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">This Week</p>
                                    <p className="text-2xl font-bold">{stats.thisWeek}</p>
                                </div>
                                <div className="h-8 w-8 bg-secondary/10 rounded-full flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-secondary-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardHeader>
                        <CardTitle>Case Management</CardTitle>
                        <CardDescription>Search and filter patient cases</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by patient name, owner, or breed..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="reviewed">Reviewed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filterRisk} onValueChange={setFilterRisk}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Risk Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Risk Levels</SelectItem>
                                    <SelectItem value="High">High Risk</SelectItem>
                                    <SelectItem value="Medium">Medium Risk</SelectItem>
                                    <SelectItem value="Low">Low Risk</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Cases Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Cases ({filteredCases.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredCases.map((case_) => (
                                <div
                                    key={case_.id}
                                    className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                                >
                                    {/* Patient Info */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <Avatar className="h-12 w-12 flex-shrink-0">
                                            <AvatarImage
                                                src={`/ceholder-svg-key-case-.jpg?key=case-${case_.id}&height=48&width=48&query=${case_.species.toLowerCase()}`}
                                            />
                                            <AvatarFallback>{case_.patientName[0]}</AvatarFallback>
                                        </Avatar>

                                        <div className="space-y-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 min-w-0">
                                                <h3 className="font-medium text-foreground truncate">{case_.patientName}</h3>
                                                <Badge variant="outline" className="text-xs">
                                                    {case_.id}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {case_.breed} • {case_.species} • {case_.age} years
                                            </p>
                                            <p className="text-sm text-muted-foreground truncate">Owner: {case_.owner}</p>
                                        </div>
                                    </div>

                                    {/* Case Stats and Actions */}
                                    <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-4 md:gap-6 flex-shrink-0 w-full md:w-auto">
                                        {/* Risk */}
                                        <div className="text-center flex-1">
                                            <div className="flex items-center justify-center gap-1">
                                                {getTrendIcon(case_.riskLevel)}
                                                <Badge variant={getRiskBadgeVariant(case_.riskLevel)}>{case_.riskLevel}</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">{case_.probability}% probability</p>
                                        </div>

                                        {/* Status */}
                                        <div className="text-center flex-1">
                                            <Badge variant={getStatusBadgeVariant(case_.status)}>{case_.status}</Badge>
                                            <p className="text-xs text-muted-foreground mt-1">{new Date(case_.date).toLocaleDateString()}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-center gap-2 flex-1 sm:flex-none">
                                            <Button variant="outline" size="sm" onClick={() => openCaseDetails(case_)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>


                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredCases.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No cases found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Case Details Modal */}
                {selectedCase && (
                    <CaseDetailsModal case_={selectedCase} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                )}
            </div>
        </DashboardLayout>
    )
}
