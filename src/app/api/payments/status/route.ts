import { NextRequest } from "next/server"
import { redis } from "@/lib/payments/redis"
import type { PaymentUpdate } from "@/app/api/payments/callback/route"

export const runtime = "nodejs"

const POLL_INTERVAL_MS = 2000  // check every 2 seconds
const TIMEOUT_MS = 50 * 1000  // give up after 50 seconds

export async function GET(req: NextRequest) {
    const reference = req.nextUrl.searchParams.get("reference")

    if (!reference) {
        return new Response("Missing reference", { status: 400 })
    }

    const stream = new ReadableStream({
        async start(controller) {
            const key = `payment:${reference}`
            const started = Date.now()

            const poll = async () => {
                // Stop if client disconnected
                if (req.signal.aborted) return

                // Check if timed out
                if (Date.now() - started >= TIMEOUT_MS) {
                    controller.enqueue(
                        `data: ${JSON.stringify({ status: "TIMEOUT", reference })}\n\n`
                    )
                    controller.close()
                    return
                }

                try {
                    const raw = await redis.get<string>(key)

                    if (raw) {
                        // Result is ready — send it and close
                        const data: PaymentUpdate = typeof raw === "string"
                            ? JSON.parse(raw)
                            : raw
                        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
                        controller.close()
                        await redis.del(key) // clean up
                        return
                    }
                } catch (err) {
                    console.error("Redis poll error:", err)
                }

                // Not ready yet — wait and try again
                setTimeout(poll, POLL_INTERVAL_MS)
            }

            poll()
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