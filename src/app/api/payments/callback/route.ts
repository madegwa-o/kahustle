import { NextRequest, NextResponse } from "next/server"
import { paymentEmitter } from "@/lib/payments/emitter"

export interface PayHeroCallback {
    status: "SUCCESS" | "FAILED" | "CANCELLED"
    reference: string
    CheckoutRequestID: string
    amount: number
    phone_number: string
    external_reference: string
    provider_reference?: string
}

export async function POST(req: NextRequest) {
    try {
        const body: PayHeroCallback = await req.json()
        console.log("PayHero callback received:", body)

        // Emit to any SSE listeners waiting on this reference
        paymentEmitter.emit(`payment:${body.reference}`, body)

        // TODO: persist to DB here

        return NextResponse.json({ received: true }, { status: 200 })
    } catch {
        return NextResponse.json({ received: false }, { status: 500 })
    }
}