import { Metadata } from "next";
import { LoginForm } from "./login-form";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login | Utool",
  description: "Sign in to your Utool account",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
