import mongoose from "mongoose";

export async function connectDB() {
	try {
		mongoose.connect(process.env.MONGO_URL!);
		const connection = mongoose.connection;
		connection.on("connected", () => {
			console.log("MongoDB connected");
		});
		connection.on("error", (error) => {
			console.error(`MongoDB connection error: ${error}`);
			process.exit(1);
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}
