import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfileRedirectPage() {
  const session = await auth();
  redirect(`/profile/${session!.user.username}`);
}
