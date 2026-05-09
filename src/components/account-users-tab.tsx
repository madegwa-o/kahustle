"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Role } from "@/lib/roles"

type ManagedUser = { _id: string; name: string; email: string; roles: string[]; isActive: boolean }

export default function AccountUsersTab() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<ManagedUser[]>([])

  const canManageRoles = session?.user?.roles?.includes(Role.ADMIN)
  const canManageUsers = canManageRoles || session?.user?.roles?.includes(Role.STAFF)

  useEffect(() => {
    if (!canManageUsers) return
    fetch("/api/users").then((r) => r.json()).then((d) => setUsers(d.users || []))
  }, [canManageUsers])

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !isActive }) })
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: !isActive } : u)))
  }

  const setRoles = async (id: string, roles: string[]) => {
    await fetch(`/api/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roles }) })
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, roles } : u)))
  }
  const toggleRole = (user: ManagedUser, role: string) => {
    const nextRoles = user.roles.includes(role)
      ? user.roles.filter((r) => r !== role)
      : [...new Set([...user.roles, role])]
    const normalized = nextRoles.length > 0 ? nextRoles : ["USER"]
    setRoles(user._id, normalized)
  }

  if (!canManageUsers) return <p className="text-sm text-muted-foreground">Only staff or admins can manage users.</p>

  return <div className="space-y-3">{users.map((u) => <div key={u._id} className="border rounded p-3 flex items-center justify-between"><div><p className="font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.email} • {u.roles.join(", ")}</p></div><div className="flex gap-2 flex-wrap justify-end"><Button size="sm" variant="outline" onClick={() => toggleActive(u._id, u.isActive)}>{u.isActive ? "Disable" : "Enable"}</Button>{canManageRoles && <><Button size="sm" variant={u.roles.includes(Role.STAFF) ? "default" : "outline"} onClick={() => toggleRole(u, Role.STAFF)}>{u.roles.includes(Role.STAFF) ? "Remove Staff" : "Add Staff"}</Button><Button size="sm" variant={u.roles.includes(Role.ADMIN) ? "default" : "outline"} onClick={() => toggleRole(u, Role.ADMIN)}>{u.roles.includes(Role.ADMIN) ? "Remove Admin" : "Add Admin"}</Button></>}</div></div>)}</div>
}
