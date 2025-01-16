import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ReviewApp from "@/app/ui/review";
import { selectDueVocabulary, selectWarmupVocabulary } from "../lib/vocabulary";
import { selectIdJa } from "../lib/ja_dict";
import { selectProfile } from "../lib/profiles";

export default async function ReviewEntry() {
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
    redirect("/dashboard");
  }

  // Get due vocab, or use warmup set
  let vocab = await selectDueVocabulary(user.id);

  let warmup;
  if (!vocab) {
    warmup = await selectWarmupVocabulary(user.id);
    vocab = warmup[0];
  }
  const entry = await selectIdJa(vocab?.word_id);

  return (
    <ReviewApp
      user={user}
      lang={lang}
      loadedVocab={vocab}
      loadedEntry={entry}
      loadedWarmup={warmup ?? []}
    />
  );
}
