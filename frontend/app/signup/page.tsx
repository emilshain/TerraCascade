import type { Metadata } from "next";
import { SigninPage } from "@/components/auth/SigninPage";

export const metadata: Metadata = {
  title: "Official Registration | TerraCascade EAP Command",
  description: "Register new emergency management officer credentials for TerraCascade.",
};

export default function SignupRoute() {
  return <SigninPage />;
}
