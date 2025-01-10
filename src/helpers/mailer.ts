import User from "@/models/user.model";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

interface SendEmailParams {
	email: string;
	emailType: "VERIFY" | "RESET";
	userId: string;
}

const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
	try {
		const hashToken = await bcrypt.hash(userId.toString(), 10);

		if (emailType === "VERIFY") {
			const updatedUser = await User.findByIdAndUpdate(userId, {
				$set: {
					verifyToken: hashToken,
					verifyExpire: Date.now() + 10 * 60 * 1000,
				},
			});
		} else if (emailType === "RESET") {
			await User.findByIdAndUpdate(userId, {
				$set: {
					forgotPasswordToken: hashToken,
					forgotPasswordExpire: Date.now() + 10 * 60 * 1000,
				},
			});
		}

		const transporter = nodemailer.createTransport({
			host: "sandbox.smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "6c79830f1fe4c1",
				pass: "43af6c04b5d0ca",
			},
		});

		const emailHtml =
			emailType === "VERIFY"
				? `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
          <a href="${process.env.DOMAIN}/verify-email?token=${hashToken}" style="color: #4CAF50;">Verify Email</a>
          <p>This link will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `
				: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>We received a request to reset your password. Click the link below to set a new password:</p>
          <a href="${process.env.DOMAIN}/verify-email?token=${hashToken}" style="color: #4CAF50;">Reset Password</a>
          <p>This link will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `;

		const mailOptions = {
			from: '"Your App Name" <gausalmunirtushar@gmail.com>',
			to: email,
			subject:
				emailType === "VERIFY"
					? "Verify Your Email Address"
					: "Reset Your Password",
			html: emailHtml,
		};

		const mailResponse = await transporter.sendMail(mailOptions);
		return mailResponse;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
};

export default sendEmail;
