"use client";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import Input from "@/components/form/input/InputField";
import useGoBack from "@/hooks/useGoBack";
import Label from "../form/Label";

export default function ResetPasswordForm() {
	const goBack = useGoBack();
	return (
		<div className="flex flex-col flex-1 lg:w-1/2 w-full">
			<div className="w-full max-w-md pt-10 mx-auto">
				<button
					onClick={goBack}
					className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
				>
					<FaChevronLeft />
					Back
				</button>
			</div>
			<div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
				<div className="mb-5 sm:mb-8">
					<h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
						Forgot Your Password?
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Enter the email address linked to your account, and we’ll send you a
						link to reset your password.
					</p>
				</div>
				<div>
					<form>
						<div className="space-y-5">
							{/* <!-- Email --> */}
							<div>
								<Label>
									Email<span className="text-error-500">*</span>
								</Label>
								<Input
									type="email"
									id="email"
									name="email"
									placeholder="Enter your email"
								/>
							</div>

							{/* <!-- Button --> */}
							<div>
								<button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
									Send Reset Link
								</button>
							</div>
						</div>
					</form>
					<div className="mt-5">
						<p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
							Wait, I remember my password...
							<Link
								href="/signin"
								className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
							>
								Click here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
