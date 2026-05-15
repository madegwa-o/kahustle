"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Tags, Loader2, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const SELF_SERVICE_ROLES = [
    {
        value: "JOBSEEKER",
        label: "Job Seeker",
        description: "Looking for employment opportunities",
        group: "Jobs",
    },
    {
        value: "RECRUITER",
        label: "Recruiter",
        description: "Hiring talent for organizations",
        group: "Jobs",
    },
    {
        value: "CARDEALER",
        label: "Car Dealer",
        description: "Selling or trading vehicles",
        group: "Automotive",
    },
    {
        value: "CARBUYER",
        label: "Car Buyer",
        description: "Looking to purchase a vehicle",
        group: "Automotive",
    },
    {
        value: "CONSTRUCTION_FREELANCER",
        label: "Construction Freelancer",
        description: "Offering construction or trade services",
        group: "Construction",
    },
    {
        value: "CONSTRUCTION_FREELANCER_SEEKER",
        label: "Construction Seeker",
        description: "Looking to hire construction professionals",
        group: "Construction",
    },
    {
        value: "PROPERTY_SELLER",
        label: "Property Seller",
        description: "Listing property for sale or rent",
        group: "Property",
    },
    {
        value: "PROPERTY_BUYER",
        label: "Property Buyer",
        description: "Searching for property to buy or rent",
        group: "Property",
    },
]

const GROUPS = ["Jobs", "Automotive", "Construction", "Property"]

export default function AccountRolesTab() {
    const { data: session, update } = useSession()
    const [activeRoles, setActiveRoles] = useState<string[]>([])
    const [saving, setSaving] = useState<string | null>(null)
    const [savedRecently, setSavedRecently] = useState<string | null>(null)

    useEffect(() => {
        if (session?.user?.roles) {
            setActiveRoles(session.user.roles as string[])
        }
    }, [session])

    const toggleRole = async (roleValue: string) => {
        const hasRole = activeRoles.includes(roleValue)
        const nextRoles = hasRole
            ? activeRoles.filter((r) => r !== roleValue)
            : [...activeRoles, roleValue]

        setSaving(roleValue)

        try {
            const response = await fetch("/api/user/roles", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roles: nextRoles }),
            })

            if (response.ok) {
                setActiveRoles(nextRoles)
                await update({ roles: nextRoles })
                setSavedRecently(roleValue)
                setTimeout(() => setSavedRecently(null), 2000)
            }
        } catch (err) {
            console.error("Failed to update role:", err)
        } finally {
            setSaving(null)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Tags className="h-5 w-5" />
                    My Roles &amp; Interests
                </CardTitle>
                <CardDescription>
                    Select the roles that describe how you use this platform. You can add or remove them at any time.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {GROUPS.map((group) => (
                    <div key={group} className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{group}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {SELF_SERVICE_ROLES.filter((r) => r.group === group).map((role) => {
                                const isActive = activeRoles.includes(role.value)
                                const isSaving = saving === role.value
                                const justSaved = savedRecently === role.value

                                return (
                                    <button
                                        key={role.value}
                                        onClick={() => toggleRole(role.value)}
                                        disabled={isSaving}
                                        className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
                      ${isActive
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-border bg-background hover:border-primary/40 hover:bg-muted/50 text-foreground"
                                        }
                      ${isSaving ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                    `}
                                    >
                    <span className="mt-0.5 shrink-0">
                      {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : justSaved || isActive ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium leading-none">{role.label}</span>
                                                {isActive && (
                                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 leading-4">Active</Badge>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs text-muted-foreground leading-snug">{role.description}</p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}