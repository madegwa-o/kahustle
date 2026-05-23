import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/payments/redis"

interface PayHeroCallbackBody {
    status: boolean
    response: {
        MerchantRequestID: string
        CheckoutRequestID: string
        ResultCode: number
        Amount: number
        MpesaReceiptNumber: string
        Phone: string
        ExternalReference: string
        Status: "Success" | "Failed" | "Cancelled"
        ResultDesc: string
        ServiceWalletBalance: number
        PaymentWalletBalance: number
        ChannelID: number
    }
    forward_url: string
}

export interface PaymentUpdate {
    status: "SUCCESS" | "FAILED" | "CANCELLED" | "TIMEOUT"
    reference: string
    CheckoutRequestID: string
    amount: number
    phone_number: string
    external_reference: string
    provider_reference?: string
}

export async function POST(req: NextRequest) {
    try {
        const body: PayHeroCallbackBody = await req.json()
        console.log("PayHero callback received:", body)

        const { response } = body

        const normalized: PaymentUpdate = {
            status: response.Status === "Success"
                ? "SUCCESS"
                : response.Status === "Failed"
                    ? "FAILED"
                    : "CANCELLED",
            reference: response.ExternalReference,
            CheckoutRequestID: response.CheckoutRequestID,
            amount: response.Amount,
            phone_number: response.Phone,
            external_reference: response.ExternalReference,
            provider_reference: response.MpesaReceiptNumber || undefined,
        }

        // Write result to Redis with 5 min expiry — SSE route will poll for it
        await redis.set(
            `payment:${response.ExternalReference}`,
            JSON.stringify(normalized),
            { ex: 300 }
        )

        console.log("Payment result written to Redis:", response.ExternalReference)

        return NextResponse.json({ received: true }, { status: 200 })
    } catch (err) {
        console.error("Callback error:", err)
        return NextResponse.json({ received: false }, { status: 500 })
    }
}