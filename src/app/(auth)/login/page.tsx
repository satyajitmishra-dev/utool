import { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login | Utool",
  description: "Sign in to your Utool account",
};

export default function LoginPage() {
  return <LoginForm />;
}
