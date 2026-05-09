import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { 
            firstName,
            lastName, 
            username, 
            email, 
            phone, 
            password,
            confirmPassword,
            agreedToTerms,
            agreedToPrivacy 
        } = body;

        // Validation
        if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: "Passwords do not match" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        if (username.length < 3 || username.length > 20) {
            return NextResponse.json(
                { error: "Username must be between 3 and 20 characters" },
                { status: 400 }
            );
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return NextResponse.json(
                { error: "Username can only contain letters, numbers, underscores, and hyphens" },
                { status: 400 }
            );
        }

        if (!agreedToTerms || !agreedToPrivacy) {
            return NextResponse.json(
                { error: "You must agree to Terms & Conditions and Privacy Policy" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if email already exists
        const existingEmailUser = await User.findOne({ email: email.toLowerCase() });
        if (existingEmailUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Check if username already exists
        const existingUsernameUser = await User.findOne({ username });
        if (existingUsernameUser) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 400 }
            );
        }

        // Create new user
        const newUser = new User({
            name: `${firstName} ${lastName}`,
            firstName,
            lastName,
            email: email.toLowerCase(),
            username,
            phone: phone || null,
            password,
            agreedToTerms,
            agreedToPrivacy,
            roles: ["USER"],
            accountType: "INDIVIDUAL",
            isActive: true,
        });

        await newUser.save();

        return NextResponse.json(
            { 
                message: "Registration successful. Please sign in.",
                userId: newUser._id.toString()
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Registration failed. Please try again." },
            { status: 500 }
        );
    }
}

// Check username availability
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const username = searchParams.get("username");
        const email = searchParams.get("email");

        if (!username && !email) {
            return NextResponse.json(
                { error: "Username or email parameter required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        if (username) {
            const existingUser = await User.findOne({ username });
            return NextResponse.json({ available: !existingUser });
        }

        if (email) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            return NextResponse.json({ available: !existingUser });
        }
    } catch (error) {
        console.error("Availability check error:", error);
        return NextResponse.json(
            { error: "Check failed" },
            { status: 500 }
        );
    }
}
