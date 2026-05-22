"use client"

import { useState } from "react"
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Status = "idle" | "loading" | "waiting" | "success" | "error" | "timeout"

export default function PayPage() {
    const [form, setForm] = useState({
        amount: "",
        phone_number: "",
        customer_name: "",
    })
    const [status, setStatus] = useState<Status>("idle")
    const [message, setMessage] = useState("")
    const [reference, setReference] = useState("")
    const [receipt, setReceipt] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const listenForCallback = (ref: string) => {
        const es = new EventSource(`/api/payments/status?reference=${ref}`)

        es.onmessage = (e) => {
            const data = JSON.parse(e.data)
            es.close()

            if (data.status === "SUCCESS") {
                setStatus("success")
                setReceipt(data.provider_reference ?? "")
                setMessage("Payment confirmed! Thank you.")
            } else if (data.status === "TIMEOUT") {
                setStatus("timeout")
                setMessage("We didn't receive a confirmation. Please check with your bank.")
            } else {
                setStatus("error")
                setMessage(`Payment ${data.status.toLowerCase()}. Please try again.`)
            }
        }

        es.onerror = () => {
            es.close()
            setStatus("error")
            setMessage("Lost connection while waiting for confirmation.")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("loading")
        setMessage("")
        setReceipt("")

        try {
            const res = await fetch("/api/payments/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Number(form.amount),
                    phone_number: form.phone_number,
                    customer_name: form.customer_name || undefined,
                    external_reference: `INV-${Date.now()}`,
                }),
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                setStatus("error")
                setMessage(data.message ?? "Payment request failed.")
                return
            }

            setReference(data.reference)
            setStatus("waiting")
            setMessage("STK Push sent! Enter your M-Pesa PIN on your phone.")

            // Open SSE connection to wait for PayHero callback
            listenForCallback(data.reference)
        } catch {
            setStatus("error")
            setMessage("Something went wrong. Please try again.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
                <h1 className="text-2xl font-medium text-foreground mb-1">Pay with M-Pesa</h1>
                <p className="text-sm text-muted-foreground mb-6">
                    Enter your details and we'll send an STK push to your phone.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="customer_name">Full name</Label>
                        <Input
                            id="customer_name"
                            name="customer_name"
                            placeholder="John Doe"
                            value={form.customer_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="phone_number">Phone number *</Label>
                        <Input
                            id="phone_number"
                            name="phone_number"
                            placeholder="0712 345 678"
                            required
                            value={form.phone_number}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="amount">Amount (KES) *</Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            placeholder="100"
                            min={1}
                            required
                            value={form.amount}
                            onChange={handleChange}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={status === "loading" || status === "waiting"}
                    >
                        {(status === "loading" || status === "waiting") && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {status === "loading" && "Sending request…"}
                        {status === "waiting" && "Waiting for confirmation…"}
                        {(status === "idle" || status === "error" || status === "timeout") && "Pay now"}
                        {status === "success" && "Pay again"}
                    </Button>
                </form>

                {/* Waiting */}
                {status === "waiting" && (
                    <div className="mt-5 flex gap-3 rounded-xl bg-secondary p-4">
                        <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5 animate-pulse" />
                        <div>
                            <p className="text-sm font-medium text-foreground">{message}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Ref: <span className="font-mono">{reference}</span>
                            </p>
                        </div>
                    </div>
                )}

                {/* Success */}
                {status === "success" && (
                    <div className="mt-5 flex gap-3 rounded-xl bg-secondary p-4">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-foreground">{message}</p>
                            {receipt && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    M-Pesa receipt: <span className="font-mono">{receipt}</span>
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Ref: <span className="font-mono">{reference}</span>
                            </p>
                        </div>
                    </div>
                )}

                {/* Error / Timeout */}
                {(status === "error" || status === "timeout") && (
                    <div className="mt-5 flex gap-3 rounded-xl bg-destructive/10 p-4">
                        <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        <p className="text-sm text-destructive">{message}</p>
                    </div>
                )}
            </div>
        </div>
    )
}