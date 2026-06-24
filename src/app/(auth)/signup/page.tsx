import { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create Account | Utool",
  description: "Create your Utool account",
};

export default function SignupPage() {
  return <SignupForm />;
}
