import NextAuth, { type NextAuthOptions, type DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUserByEmail } from "@/lib/users"
import { User } from "@/models/User"
import { Role } from "@/lib/roles"
import { connectToDatabase } from "@/lib/db"

// ── Type augmentation ────────────────────────────────────────────────────────

declare module "next-auth" {
    interface Session {
        user: {
            id?: string | null
            roles?: string[]
        } & DefaultSession["user"]
    }
    interface User {
        id: string
        roles?: string[]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId?: string
        roles?: string[]
    }
}

// ── Auth options (exported so getServerSession(authOptions) works) ────────────

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",

    pages: {
        signIn: "/signin",
        error: "/signin",
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) return null

                try {
                    await connectToDatabase()

                    const user = await User.findOne({
                        $or: [
                            { email: credentials.identifier.toLowerCase() },
                            { username: credentials.identifier },
                        ],
                    }).select("+password")

                    if (!user?.password) return null

                    const isValid = await user.comparePassword(credentials.password)
                    if (!isValid) return null

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        roles: user.roles,
                    }
                } catch (error) {
                    console.error("Authorization error:", error)
                    return null
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger }) {
            // Runs on sign-in (user is present) or session.update() trigger
            if (user?.email || trigger === "update") {
                try {
                    const email = user?.email ?? token.email
                    if (email) {
                        const dbUser = await getUserByEmail(email)
                        if (dbUser) {
                            token.userId  = dbUser._id.toString()
                            token.roles   = dbUser.roles?.length ? dbUser.roles : [Role.USER]
                            token.name    = dbUser.name
                            token.picture = dbUser.image
                        }
                    }
                } catch (error) {
                    console.error("JWT callback error:", error)
                }
            }
            return token
        },

        async session({ session, token }) {
            if (token?.userId) {
                session.user.id     = token.userId
                session.user.roles  = (token.roles as string[]) ?? [Role.USER]
                session.user.name   = token.name
                session.user.image  = token.picture ?? null
            }
            return session
        },
    },
}

// ── Route handler ─────────────────────────────────────────────────────────────

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }