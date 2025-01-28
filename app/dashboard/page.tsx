import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  selectDueVocabulary,
  selectWarmupVocabulary,
} from "@/app/lib/vocabulary";
import DashboardPage from "@/app/ui/dashboard-page";
import { selectProfile, updateProfile } from "@/app/lib/profiles";
import { idSelectDict } from "@/app/lib/data";

enum Experience {
  ONBOARD = "onboard",
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    message?: string;
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
  if (!profile) {
    console.log("Could not find user profile information.");
    redirect("/login");
  }
  if (!profile?.experienced.includes(Experience.ONBOARD.toString())) {
    profile.experienced.push(Experience.ONBOARD.toString());
    await updateProfile(profile);
    redirect("/onboard");
  }
  let vocab = await selectDueVocabulary(user.id, profile.lang);
  let due = true;
  if (!vocab) {
    vocab = (await selectWarmupVocabulary(user.id, profile.lang))[0];
    due = false;
  }
  const entry = await idSelectDict(profile.lang, vocab?.word_id);

  const message = (await searchParams).message;

  return (
    <DashboardPage
      user={user}
      profile={profile}
      entry={entry}
      message={message}
      lang={profile.lang}
      due={due}
    />
  );
}
