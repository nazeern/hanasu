import { querySession } from "@/app/lib/sessions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MainApp from "@/app/ui/main-app";

export default async function SessionHistoryPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const [session, chatMessages] = await querySession((await params).sessionId);
  if (!session?.lang) {
    redirect("/dashboard");
  }

  return (
    <MainApp
      user={user}
      lang={session.lang}
      loadedChatMessages={chatMessages}
    />
  );
}
