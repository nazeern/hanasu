import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { selectLowestScoreVocabulary } from "@/app/lib/vocabulary";
import { selectIdJa } from "@/app/lib/ja_dict";
import DashboardPage from "@/app/ui/dashboard-page";
import { selectProfile } from "@/app/lib/profiles";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const profile = await selectProfile(user.id);
  if (!profile) {
    console.log("Could not find user profile information.");
    redirect("/login");
  }
  const vocab = await selectLowestScoreVocabulary(user.id);
  const entry = await selectIdJa(vocab?.word_id);

  return <DashboardPage user={user} profile={profile} entry={entry} />;
}
