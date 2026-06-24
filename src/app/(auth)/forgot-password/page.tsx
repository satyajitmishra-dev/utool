import { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password | Utool",
  description: "Reset your Utool password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
