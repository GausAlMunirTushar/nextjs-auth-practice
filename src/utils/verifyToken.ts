import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export default function verifyToken(req: NextRequest) {
	try {
		const token = req.cookies.get("token")?.value || " ";
		if (!token) {
			return null;
		}
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
		if (typeof decodedToken === "string") {
			return null;
		}
		return decodedToken.id;
	} catch (error) {
		return null;
	}
}
