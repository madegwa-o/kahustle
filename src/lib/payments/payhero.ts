const PAYHERO_BASE_URL = "https://backend.payhero.co.ke/api/v2"

// TODO: move these to .env.local before going to production
const PAYHERO_USERNAME = "z8TkqBaBT1mUQMzR1gs1"
const PAYHERO_PASSWORD = "bspsxp0WiE4TAj6Csn03lSADwDE46cdLGcEfSq6u"
const PAYHERO_AUTH_TOKEN = "ejhUa3FCYUJUMW1VUU16UjFnczE6YnNwc3hwMFdpRTRUQWo2Q3NuMDNsU0FEd0RFNDZjZExHY0VmU3E2dQ==" // copied from PayHero dashboard → API Keys
const PAYHERO_CHANNEL_ID = 2175
const PAYHERO_CALLBACK_URL = "https://kahustle.vercel.app/api/payments/callback"

function getAuthToken() {
    const credentials = `${PAYHERO_USERNAME}:${PAYHERO_PASSWORD}`
    return `Basic ${Buffer.from(credentials).toString("base64")}`
}

export interface STKPushPayload {
    amount: number
    phone_number: string
    external_reference: string
    customer_name?: string
    credential_id?: string
}

export interface STKPushResponse {
    success: boolean
    status: string
    reference: string
    CheckoutRequestID: string
}

export interface PaymentError {
    success: false
    message: string
}

export async function initiateSTKPush(
    payload: STKPushPayload
): Promise<STKPushResponse | PaymentError> {
    try {
        const res = await fetch(`${PAYHERO_BASE_URL}/payments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: getAuthToken(),
            },
            body: JSON.stringify({
                ...payload,
                channel_id: PAYHERO_CHANNEL_ID,
                provider: "m-pesa",
                callback_url: PAYHERO_CALLBACK_URL,
            }),
        })

        const data = await res.json()

        if (!res.ok) {
            return {
                success: false,
                message: data?.message ?? `Request failed with status ${res.status}`,
            }
        }

        return data as STKPushResponse
    } catch (err) {
        return {
            success: false,
            message: err instanceof Error ? err.message : "Unknown error occurred",
        }
    }
}