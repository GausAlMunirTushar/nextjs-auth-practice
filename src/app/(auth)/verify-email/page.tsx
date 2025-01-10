"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const VerifyEmailPage = () => {
	// const router = useRouter();
	const [token, setToken] = useState();
	const [verified, setVerified] = useState(false);
	const [error, setError] = useState();

	const verifyEmail = async () => {
		try {
			const response = await axios.post("/api/auth/verify-email", {
				token,
			});
			setVerified(true);
		} catch (error) {
			setError("Invalid token");
		}
	};

	useEffect(() => {
		const urlToken = window.location.search.split("=")[1];
		setToken(urlToken || "");

		// const { query } = router;
		// const urlTokenTwo = query.token;
		// setToken(urlTokenTwo || "");
	}, []);
	useEffect(() => {
		if (token.length > 0) {
			verifyEmail();
		}
	}, [token]);
	return (
		<div className="container flex ">
			<h1>Verify Email</h1>
			<div>
				{verified ? (
					<p>Email verified</p>
				) : error ? (
					<p>{error}</p>
				) : (
					<p>Verifying...</p>
				)}
				<Link href="/login">Go to login</Link>
			</div>
		</div>
	);
};

export default VerifyEmailPage;
