import { redirect } from "next/navigation";
import { getSession } from "@/lib/guards";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect(session.user.role === "admin" ? "/admin" : "/editor");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <LoginForm />
    </main>
  );
}
