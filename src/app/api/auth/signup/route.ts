import { connectDB } from "@/config/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sendEmail from "@/helpers/mailer";

connectDB();

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const { username, email, password } = reqBody;
		// validation (zod, yup, joi)
		const user = await User.findOne({ email });
		if (user) {
			return NextResponse.json({ error: "User already exists" });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		});
		const savedUser = await newUser.save();

		// send verification email
		sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
		return NextResponse.json({
			message: "User register successfully",
			success: true,
			user: {
				username: savedUser.username,
				email: savedUser.email,
			},
		});
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message });
	}
}
