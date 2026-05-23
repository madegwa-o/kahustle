import { NextRequest } from "next/server"
import { paymentEmitter } from "@/lib/payments/emitter"
import type { PaymentUpdate } from "@/app/api/payments/callback/route"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
    const reference = req.nextUrl.searchParams.get("reference")

    if (!reference) {
        return new Response("Missing reference", { status: 400 })
    }

    const stream = new ReadableStream({
        start(controller) {
            const send = (data: PaymentUpdate) => {
                controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
                controller.close()
                paymentEmitter.off(`payment:${reference}`, send)
            }

            paymentEmitter.on(`payment:${reference}`, send)

            const timeout = setTimeout(() => {
                controller.enqueue(
                    `data: ${JSON.stringify({ status: "TIMEOUT", reference })}\n\n`
                )
                controller.close()
                paymentEmitter.off(`payment:${reference}`, send)
            }, 50 * 1000)

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