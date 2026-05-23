import { NextRequest, NextResponse } from "next/server"
import { paymentEmitter } from "@/lib/payments/emitter"

// Actual PayHero callback shape (from logs)
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

// Normalised shape we emit to the SSE listener
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

        console.log("firing the emmitter")
        // Fire on the external reference — matches what the page passed when initiating
        paymentEmitter.emit(`payment:${response.ExternalReference}`, normalized)
        console.log("emmitter was fired ")
        return NextResponse.json({ received: true }, { status: 200 })
    } catch (err) {
        console.error("Callback error:", err)
        return NextResponse.json({ received: false }, { status: 500 })
    }
}