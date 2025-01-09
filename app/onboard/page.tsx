import { createClient } from "@/utils/supabase/server";
import OnboardPage from "../ui/onboard-page";
import { redirect } from "next/navigation";
import { selectProfile } from "../lib/profiles";

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
    console.log("Failed to retrieve user profile");
    redirect("/login");
  }

  return <OnboardPage user={user} profile={profile} />;
}
