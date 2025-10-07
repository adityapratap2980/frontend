import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Stethoscope, Brain, ShieldCheck, LineChart } from 'lucide-react'

const HomePage = () => {
    return (
        <div className="min-h-screen bg-background">
            <header className="w-full flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-background/80 backdrop-blur z-10 gap-3 sm:gap-0">
                <div className="text-xl font-bold text-primary tracking-tight mb-2 sm:mb-0">
                    VetAnemIA
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    {typeof window !== 'undefined' && localStorage.getItem('auth_token') ? (
                        <>
                          <Button asChild size="lg">
                                <Link to="/about">Learn About Us</Link>
                            </Button>
                        <Button asChild className="w-full sm:w-auto">
                            <Link to="/dashboard">Go to Dashboard</Link>
                        </Button>
                        </>
                    ) : (
                        <Button asChild className="w-full  sm:w-auto">
                            <Link to="/login">Login to start Prediction</Link>
                        </Button>
                    )}
                    {typeof window !== 'undefined' && localStorage.getItem('auth_token') && (
                        <Button
                            
                            className="w-full bg-red-500 hover:bg-red-400 sm:w-auto"
                            onClick={() => {
                                localStorage.removeItem('auth_token')
                                localStorage.removeItem('auth_user')
                                window.location.href = '/login'
                            }}
                        >
                            Logout
                        </Button>
                    )}
                </div>
            </header>
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
                <div className="container mx-auto px-6 py-20">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="inline-flex items-center justify-center gap-3 rounded-full border px-4 py-2 bg-background/70 backdrop-blur">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Stethoscope className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-xs text-muted-foreground">
                                ML Diagnostics for Companion Animals
                            </span>
                        </div>
                        <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
                            Welcome to <span className=" text-sky-600">VetAnaemIA</span>
                        </h1>
                        <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
                            Your trusted resource for understanding and managing anaemia in companion animals. We combine
                            cutting-edge research, artificial intelligence and clinical expertise to bring smarter solutions to
                            veterinarians, researchers and pet owners.
                        </p>
                        <p className="mt-4 text-base md:text-lg text-muted-foreground">
                            At VetAnaemIA, our mission is simple: to harness science and technology for healthier pets, informed
                            caregivers and a stronger veterinary community.
                        </p>

                       
                    </div>
                </div>
            </section> 
            <div className="mb-8 flex items-center justify-center gap-3">
                           
                            <Button asChild size="lg">
                                <Link to="/about">Learn About Us</Link>
                            </Button>
                        </div>

            {/* Highlights */}
            <section className="container mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-muted">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg p-2 bg-primary/10">
                                    <Brain className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground">AI-Powered Insights</h3>
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">
                                Leverage machine learning models trained on veterinary data to support faster, informed decisions.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-muted">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg p-2 bg-primary/10">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground">Clinically Aligned</h3>
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">
                                Built with clinical context in mind—augment workflows without disrupting the standard of care.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-muted">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg p-2 bg-primary/10">
                                    <LineChart className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground">Transparent Metrics</h3>
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">
                                Track model performance and case trends so teams can learn, validate, and improve over time.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA band */}
            <section className="border-t">
                <div className="container mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Ready to explore VetAnaemIA?</h2>
                        <p className="mt-2 text-muted-foreground">Start with a quick login or jump right into a demo prediction.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {typeof window !== "undefined" && localStorage.getItem("auth_token") ? (
                            <>
                                <Button asChild>
                                    <Link to="/dashboard">Go to Dashboard</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link to="/dashboard/prediction">New Prediction</Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild>
                                    <Link to="/login">Sign In</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link to="/dashboard/prediction">Demo Prediction</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage