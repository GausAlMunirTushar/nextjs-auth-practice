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
		if (user) {
			return NextResponse.json({
				message: "User already exists",
			});
		} else if (!user) {
			return NextResponse.json({
				message: "User not found",
			});
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return NextResponse.json({
				message: "Invalid credentials",
			});
		}
		const payload = {
			id: user._id,
			username: user.username,
			email: user.email,
		};
		const token = jwt.sign(payload, process.env.JWT_SECRET!, {
			expiresIn: "1d",
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
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({
			error: "Internal server error",
		});
	}
}
