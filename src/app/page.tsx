import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/auth/LoginButton";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8 inline-flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
          CircleUs
        </h1>
        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          Track and nurture the relationships that matter most.
        </p>
        <LoginButton />
      </div>
    </main>
  );
}
