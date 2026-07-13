import { redirect } from "next/navigation";
import { getSession } from "@/lib/guards";
import { ResetPasswordForm } from "@/components/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const session = await getSession();

  if (session) {
    redirect(session.user.role === "admin" ? "/admin" : "/editor");
  }

  const { token } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <ResetPasswordForm token={token} />
    </main>
  );
}
