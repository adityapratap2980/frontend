"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Settings, Save, CheckCircle } from "lucide-react"

interface UserProfile {
    id: number
    firstName: string
    lastName: string
    email: string
    role: string
    clinicId: string
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile>({
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        clinicId: "",
    })

    const [isLoading, setIsLoading] = useState(false)
    const [saveMessage, setSaveMessage] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                window.location.href = '/login'
                return
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_SERVER}/auth/me/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    localStorage.removeItem('auth_token')
                    window.location.href = '/login'
                    return
                }

                const userData = await response.json()
                setProfile(userData)
            } catch (error) {
                console.error('Failed to fetch user:', error)
                localStorage.removeItem('auth_token')
                window.location.href = '/login'
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    const updateProfile = (field: keyof UserProfile, value: string) => {
        setProfile((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setIsLoading(true)
        setSaveMessage("")

        try {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                window.location.href = '/login'
                return
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_SERVER}/auth/profile/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    email: profile.email,
                    role: profile.role,
                    clinicId: profile.clinicId,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || 'Failed to update profile')
            }

            const data = await response.json()
            setProfile(data.user)
            setSaveMessage("Profile updated successfully!")

            // Clear message after 3 seconds
            setTimeout(() => setSaveMessage(""), 3000)
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update profile"
            setSaveMessage(errorMessage)
            setTimeout(() => setSaveMessage(""), 5000)
        } finally {
            setIsLoading(false)
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading profile...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
                        <p className="text-muted-foreground">Manage your account information and preferences</p>
                    </div>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Save className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>

                {/* Save Message */}
                {saveMessage && (
                    <Alert className={saveMessage.includes("successfully") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{saveMessage}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Profile Summary Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="flex justify-center mb-4">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src="/caring-vet.png" />
                                        <AvatarFallback className="text-lg">
                                            {profile.firstName[0] || 'U'}
                                            {profile.lastName[0] || 'S'}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <CardTitle>
                                    {profile.firstName} {profile.lastName}
                                </CardTitle>
                                <CardDescription className="capitalize">{profile.role || 'User'}</CardDescription>
                                {profile.clinicId && (
                                    <Badge variant="outline" className="mt-2">
                                        Clinic ID: {profile.clinicId}
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Email</span>
                                        <span className="font-medium text-xs">{profile.email}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">User ID</span>
                                        <span className="font-medium">{profile.id}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Tabs defaultValue="personal" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="personal" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Personal
                                </TabsTrigger>
                                <TabsTrigger value="professional" className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Professional
                                </TabsTrigger>
                            </TabsList>

                            {/* Personal Information */}
                            <TabsContent value="personal">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                        <CardDescription>Update your personal details and contact information</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    value={profile.firstName}
                                                    onChange={(e) => updateProfile("firstName", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={profile.lastName}
                                                    onChange={(e) => updateProfile("lastName", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => updateProfile("email", e.target.value)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Professional Information */}
                            <TabsContent value="professional">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Professional Information</CardTitle>
                                        <CardDescription>Manage your professional role and clinic details</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="role">Role</Label>
                                            <Select value={profile.role} onValueChange={(value) => updateProfile("role", value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="veterinarian">Veterinarian</SelectItem>
                                                    <SelectItem value="vet-tech">Veterinary Technician</SelectItem>
                                                    <SelectItem value="admin">Clinic Administrator</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="clinicId">Clinic ID</Label>
                                            <Input
                                                id="clinicId"
                                                placeholder="Enter your clinic ID"
                                                value={profile.clinicId}
                                                onChange={(e) => updateProfile("clinicId", e.target.value)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                        </Tabs>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
