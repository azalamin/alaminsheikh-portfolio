import { redirect } from "next/navigation";
import { getSession } from "@/lib/guards";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default async function ForgotPasswordPage() {
  const session = await getSession();

  if (session) {
    redirect(session.user.role === "admin" ? "/admin" : "/editor");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <ForgotPasswordForm />
    </main>
  );
}
