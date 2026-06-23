"use client";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn } = useUser();
  if (isSignedIn) {
    redirect("/profile");
  }
  return <div>{children}</div>;
}
