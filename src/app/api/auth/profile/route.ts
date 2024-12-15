import { connectDB } from "@/config/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/utils/verifyToken";

connectDB();

export async function POST(req: NextRequest) {
	try {
		// extract data from token
		const userId = await verifyToken(req);
		const user = await User.findById({ _id: userId }).select("-password");
		return NextResponse.json({
			success: true,
			message: "User profile",
			data: user,
		});
	} catch (error) {}
}
