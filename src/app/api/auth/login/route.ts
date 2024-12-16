import { connectDB } from "@/config/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();

		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return NextResponse.json(
				{
					message: "Invalid credentials",
				},
				{ status: 401 }
			);
		}

		const payload = {
			id: user._id,
			username: user.username,
			email: user.email,
		};

		if (!process.env.JWT_SECRET) {
			throw new Error("JWT_SECRET environment variable is not defined");
		}

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRATION || "1d",
		});

		const response = NextResponse.json({
			success: true,
			message: "Login successful",
			payload,
		});
		response.cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Error during login:", (error as Error).message);
		return NextResponse.json(
			{
				success: false,
				message: "An error occurred while processing your request.",
			},
			{ status: 500 }
		);
	}
}
