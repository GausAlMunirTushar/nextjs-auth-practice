"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ProfilePage = () => {
	const router = useRouter();
	const [data, setData] = useState(null);

	const getUserData = async () => {
		try {
			const response = await axios.post("/api/auth/profile");
			setData(response?.data?._id);
		} catch (error) {
			console.error(error);
		}
	};
	const logout = async () => {
		try {
			await axios.post("/api/auth/logout");
			toast.success("Logged out successfully!");
			router.push("/");
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div>
			<h1>Profile</h1>
			<button onClick={getUserData}>Get User Data</button>
			{data && <p>User ID: {data}</p>}
			<button onClick={logout}>Logout</button>
		</div>
	);
};

export default ProfilePage;
