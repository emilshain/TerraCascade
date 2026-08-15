import type { Metadata } from "next";
import { LoginPage } from "@/components/auth/LoginPage";

export const metadata: Metadata = {
  title: "Officer Log In | TerraCascade EAP Command",
  description: "Secure emergency official sign in and authentication portal for the Idamalayar flood EAP command system.",
};

export default function LoginRoute() {
  return <LoginPage />;
}
