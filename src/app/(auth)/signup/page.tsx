"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignupPage = () => {
	const router = useRouter();

	const [formData, setFormData] = useState({
		email: "",
		username: "",
		password: "",
	});

	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	// Update button state based on form data
	useEffect(() => {
		const { email, username, password } = formData;
		setIsButtonDisabled(!(email && username && password));
	}, [formData]);

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleSignup = async () => {
		try {
			setIsLoading(true);
			await axios.post("/api/auth/signup", formData);
			toast.success("Signup successful");
			router.push("/login");
		} catch (error) {
			console.error("Signup error:", error);
			toast.error(
				error.response?.data?.message ||
					"Failed to signup, please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
			<h1 className="text-2xl text-gray-800 font-bold mb-6">
				{isLoading ? "Processing..." : "Signup"}
			</h1>
			<div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
				<div className="mb-4">
					<label
						htmlFor="username"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Username
					</label>
					<input
						id="username"
						type="text"
						value={formData.username}
						onChange={handleChange}
						className="w-full px-4 py-2 border text-black rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						className="w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
					/>
				</div>
				<div className="mb-6">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						value={formData.password}
						onChange={handleChange}
						className="w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
					/>
				</div>
				<button
					onClick={handleSignup}
					disabled={isButtonDisabled}
					className={`w-full py-2 px-4 text-white font-medium rounded-lg focus:outline-none ${
						isButtonDisabled
							? "bg-gray-400 cursor-not-allowed"
							: "bg-indigo-500 hover:bg-indigo-600"
					}`}
				>
					{isLoading ? "Processing..." : "Signup"}
				</button>
			</div>
		</div>
	);
};

export default SignupPage;
