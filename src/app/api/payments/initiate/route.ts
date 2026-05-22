import { NextRequest, NextResponse } from "next/server"
import { initiateSTKPush } from "@/lib/payments/payhero"
import { z } from "zod"

const schema = z.object({
    amount: z.number().int().positive(),
    phone_number: z
        .string()
        .regex(/^(07|01|2547|2541)\d{8}$/, "Invalid Kenyan phone number"),
    external_reference: z.string().min(1),
    customer_name: z.string().optional(),
})

// Normalize 07... or 01... to 2547... / 2541...
function normalizePhone(phone: string): string {
    if (phone.startsWith("07")) return `254${phone.slice(1)}`
    if (phone.startsWith("01")) return `254${phone.slice(1)}`
    return phone
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const parsed = schema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, message: parsed.error.errors[0].message },
                { status: 400 }
            )
        }

        const { phone_number, ...rest } = parsed.data

        const result = await initiateSTKPush({
            ...rest,
            phone_number: normalizePhone(phone_number),
        })

        if (!result.success) {
            return NextResponse.json(result, { status: 502 })
        }

        return NextResponse.json(result, { status: 201 })
    } catch {
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}