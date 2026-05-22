import { NextRequest } from "next/server"
import { paymentEmitter } from "@/lib/payments/emitter"
import type { PayHeroCallback } from "@/app/api/payments/callback/route"

export const runtime = "nodejs" // SSE requires Node runtime, not Edge

export async function GET(req: NextRequest) {
    const reference = req.nextUrl.searchParams.get("reference")

    if (!reference) {
        return new Response("Missing reference", { status: 400 })
    }

    const stream = new ReadableStream({
        start(controller) {
            const send = (data: PayHeroCallback) => {
                controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
                controller.close()
                paymentEmitter.off(`payment:${reference}`, send)
            }

            paymentEmitter.on(`payment:${reference}`, send)

            // Auto-close after 5 minutes if no callback received
            const timeout = setTimeout(() => {
                controller.enqueue(
                    `data: ${JSON.stringify({ status: "TIMEOUT", reference })}\n\n`
                )
                controller.close()
                paymentEmitter.off(`payment:${reference}`, send)
            }, 5 * 60 * 1000)

            // Clean up timeout if stream closes early
            req.signal.addEventListener("abort", () => {
                clearTimeout(timeout)
                paymentEmitter.off(`payment:${reference}`, send)
            })
        },
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    })
}