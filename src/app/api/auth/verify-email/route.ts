import { connectDB } from "@/config/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const { token } = reqBody;

		// Find the user by token and check expiration
		const user = await User.findOne({
			verifyExpire: { $gt: Date.now() }, // Token must not be expired
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Invalid token or token expired" },
				{ status: 400 }
			);
		}

		// Verify the token using bcrypt
		const isTokenValid = await bcrypt.compare(user._id.toString(), token);
		if (!isTokenValid) {
			return NextResponse.json(
				{ error: "Invalid token" },
				{ status: 400 }
			);
		}

		// Update user verification status
		user.isVerified = true;
		user.verifyToken = undefined; // Remove the token after successful verification
		user.verifyExpire = undefined;
		await user.save();

		return NextResponse.json(
			{ message: "Email verified successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Verification error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
