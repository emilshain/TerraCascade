import type { Metadata } from "next";
import { SigninPage } from "@/components/auth/SigninPage";

export const metadata: Metadata = {
  title: "Register Official | TerraCascade EAP Command",
  description: "Official emergency command sign in and registration for Idamalayar EAP responders.",
};

export default function SigninRoute() {
  return <SigninPage />;
}
