import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export function getAuthSession() {
	return getServerSession(authOptions);
}
