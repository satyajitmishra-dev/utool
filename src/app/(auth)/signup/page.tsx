import { Metadata } from "next";
import { SignupForm } from "./signup-form";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Create Account | Utool",
  description: "Create your Utool account",
};

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
