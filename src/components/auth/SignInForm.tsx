"use client";
import Link from "next/link";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { GoEye, GoEyeClosed } from "react-icons/go";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import useGoBack from "@/hooks/useGoBack";

export default function SignInForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const goBack = useGoBack();
	return (
		<div className="flex flex-col flex-1 lg:w-1/2 w-full">
			<div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
				<button
					onClick={goBack}
					className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
				>
					<FaChevronLeft />
					Back
				</button>
			</div>
			<div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
				<div>
					<div className="mb-5 sm:mb-8">
						<h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
							Sign In
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Enter your email and password to sign in!
						</p>
					</div>
					<div>
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
							<button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
										fill="#4285F4"
									/>
									<path
										d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
										fill="#34A853"
									/>
									<path
										d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
										fill="#FBBC05"
									/>
									<path
										d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
										fill="#EB4335"
									/>
								</svg>
								Sign in with Google
							</button>
							<button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
								<svg
                                    width="21"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="fill-current"
                                    >
                                    <path d="M12 0.2975C5.37 0.2975 0 5.6675 0 12.2975C0 17.6175 3.438 22.0175 8.205 23.6275C8.805 23.7375 9.025 23.3875 9.025 23.0875C9.025 22.8175 9.015 22.0975 9.01 21.1675C5.672 21.8975 4.968 19.6475 4.968 19.6475C4.422 18.2175 3.633 17.8475 3.633 17.8475C2.546 17.0875 3.717 17.1025 3.717 17.1025C4.922 17.1925 5.555 18.3575 5.555 18.3575C6.622 20.1975 8.438 19.6975 9.128 19.3975C9.238 18.6175 9.548 18.0975 9.89 17.7975C7.22 17.4975 4.39 16.4375 4.39 11.7075C4.39 10.3675 4.87 9.2875 5.66 8.4475C5.54 8.1475 5.11 6.8975 5.77 5.2975C5.77 5.2975 6.79 4.9775 9.01 6.3675C9.98 6.0975 11.01 5.9675 12.04 5.9625C13.07 5.9675 14.1 6.0975 15.07 6.3675C17.29 4.9775 18.31 5.2975 18.31 5.2975C18.97 6.8975 18.54 8.1475 18.42 8.4475C19.21 9.2875 19.69 10.3675 19.69 11.7075C19.69 16.4475 16.86 17.4925 14.19 17.7875C14.63 18.1575 15.01 18.8975 15.01 20.0175C15.01 21.6175 15 22.7875 15 23.0875C15 23.3875 15.22 23.7475 15.83 23.6275C20.6 22.0175 24 17.6175 24 12.2975C24 5.6675 18.63 0.2975 12 0.2975Z"/>
                                </svg>
								Sign in with Github
							</button>
						</div>
						<div className="relative py-3 sm:py-5">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
									Or
								</span>
							</div>
						</div>
						<form>
							<div className="space-y-6">
								<div>
									<Label>
										Email <span className="text-error-500">*</span>{" "}
									</Label>
									<Input placeholder="info@gmail.com" />
								</div>
								<div>
									<Label>
										Password <span className="text-error-500">*</span>{" "}
									</Label>
									<div className="relative">
										<Input
											type={showPassword ? "text" : "password"}
											placeholder="Enter your password"
										/>
										<span
											onClick={() => setShowPassword(!showPassword)}
											className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
										>
											{showPassword ? (
												<GoEye className="fill-gray-500 dark:fill-gray-400" />
											) : (
												<GoEyeClosed className="fill-gray-500 dark:fill-gray-400" />
											)}
										</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<Checkbox checked={isChecked} onChange={setIsChecked} />
										<span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
											Keep me logged in
										</span>
									</div>
									<Link
										href="/reset-password"
										className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
									>
										Forgot password?
									</Link>
								</div>
								<div>
									<Button className="w-full" size="sm">
										Sign in
									</Button>
								</div>
							</div>
						</form>

						<div className="mt-5">
							<p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
								Don&apos;t have an account? {""}
								<Link
									href="/signup"
									className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
								>
									Sign Up
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
