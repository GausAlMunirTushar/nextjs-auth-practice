"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await axios.post("/api/auth/login", formData);
			toast.success(response.data.message || "Login successful!");
			router.push("/profile");
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				"An error occurred. Please try again.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
			<div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
				<h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
					Login
				</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleInputChange}
							required
							className="mt-1 text-black block w-full rounded-md px-4 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							value={formData.password}
							onChange={handleInputChange}
							required
							className="mt-1 text-black block w-full rounded-md px-4 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
					>
						{isLoading ? "Logging in..." : "Login"}
					</button>
				</form>

				<p className="mt-4 text-sm text-center text-gray-600">
					Don&apos;t have an account?{" "}
					<Link
						href="/signup"
						className="text-blue-600 hover:underline"
					>
						Register
					</Link>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
