import { connectDB } from "@/config/database";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
	try {
		const response = NextResponse.json({
			success: true,
			message: "Logout successful",
		});
		response.cookies.set("token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			expires: new Date(0),
		});
		return response;
	} catch (error) {
		console.error(error);
		return NextResponse.json({
			error: "Internal server error",
		});
	}
}
