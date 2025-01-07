import RTCMainApp from "@/app/ui/rtc-main-app";
import { mintEphemeralToken } from "../lib/actions";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { selectProfile } from "../lib/profiles";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{
    topic: string;
  }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const profile = await selectProfile(user.id);
  const lang = profile?.lang;
  if (!lang) {
    redirect("dashboard");
  }

  const topic = (await searchParams).topic ?? "What do you want to talk about?";
  const ephemeralToken: string = await mintEphemeralToken();

  return (
    <RTCMainApp
      user={user}
      lang={lang}
      ephemeralToken={ephemeralToken}
      topic={topic}
    />
  );
}
