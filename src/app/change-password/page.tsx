import { redirect } from "next/navigation";
import { getSession } from "@/lib/guards";
import { ChangePasswordForm } from "@/components/change-password-form";

export default async function ChangePasswordPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <ChangePasswordForm forced={Boolean(session.user.mustChangePassword)} />
    </main>
  );
}
