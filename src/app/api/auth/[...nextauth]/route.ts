import NextAuth, { type DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { addOrUpdateUser, getUserByEmail } from "@/lib/users"
import { User, Role } from "@/models/User"
import { connectToDatabase } from "@/lib/db"

// Extend NextAuth types to include roles
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

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) {
                    return null
                }

                try {
                    await connectToDatabase()
                    
                    // Try to find user by email first, then by username
                    let user = await User.findOne({
                        $or: [
                            { email: credentials.identifier.toLowerCase() },
                            { username: credentials.identifier }
                        ]
                    }).select("+password")
                    
                    if (!user || !user.password) {
                        return null
                    }

                    const isValid = await user.comparePassword(credentials.password)
                    if (!isValid) {
                        return null
                    }

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
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, trigger }) {
            if (user?.email || trigger === "update") {
                try {
                    const email = user?.email || token.email
                    if (email) {
                        const existingUser = await getUserByEmail(email)
                        if (existingUser) {
                            token.roles = existingUser.roles || [Role.USER]
                            token.userId = existingUser._id.toString()
                            token.name = existingUser.name
                            token.picture = existingUser.image
                        }
                    }
                } catch (error) {
                    console.error("JWT callback error:", error)
                }
            }
            return token
        },
        async session({ session, token }) {
            try {
                if (token?.userId) {
                    session.user.id = token.userId
                    session.user.roles = (token.roles as string[]) || [Role.USER]
                    session.user.name = token.name
                    session.user.image = token.picture
                }
                return session
            } catch (error) {
                console.error("Session callback error:", error)
                return session
            }
        },
    },
    pages: {
        signIn: "/signin",
        error: "/signin",
    },
    debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
