import { EventEmitter } from "events"

// Single shared emitter instance across the app (works in Next.js dev + prod)
const globalEmitter = global as typeof global & { paymentEmitter?: EventEmitter }

if (!globalEmitter.paymentEmitter) {
    globalEmitter.paymentEmitter = new EventEmitter()
    globalEmitter.paymentEmitter.setMaxListeners(50)
}

export const paymentEmitter = globalEmitter.paymentEmitter