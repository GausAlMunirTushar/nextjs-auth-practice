import { connectDB } from "@/config/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sendEmail from "@/helpers/mailer";

connectDB();

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const { token } = reqBody;
		console.log(token);

		const user = User.findOne({
			verifyToken: token,
			verifyExpire: { $gt: Date.now() },
		});
		if (!user) {
			return NextResponse.json({
				status: 400,
				error: "Invalid token or token expired",
			});
		}
		user.isVerified = true;
		user.verifyToken = undefined;
		user.verifyExpire = undefined;

		await user.save();

		return NextResponse.json({
			status: 200,
			message: "Email verified successfully",
		});
	} catch (error) {
		return NextResponse.json({
			status: 5000,
			error: (error as Error).message,
		});
	}
}
