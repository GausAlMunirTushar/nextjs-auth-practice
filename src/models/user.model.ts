import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "Please provide a username"],
			unique: true,
		},
		email: {
			type: String,
			required: [true, "Please provide an email"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
		},
		isVerfied: {
			type: Boolean,
			default: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		forgotPasswordToken: {
			type: String,
		},
		forgotPasswordExpire: {
			type: Date,
		},
		verifyToken: {
			type: String,
		},
		verifyExpire: {
			type: Date,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
