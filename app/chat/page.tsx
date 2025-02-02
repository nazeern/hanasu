import RTCMainApp from "@/app/ui/rtc-main-app";
import { mintEphemeralToken } from "../lib/actions";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  getCurrentPlan,
  selectProfile,
  upcomingCost,
  updateProfile,
} from "../lib/profiles";
import { Experience, Plan, planInfo } from "@/app/lib/data";
import { querySessions, totalCost } from "@/app/lib/sessions";
import PaywallMainApp from "@/app/ui/paywall-main-app";

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

  const { plan } = await getCurrentPlan(user.id);
  const limit = planInfo[plan].limit;
  const sessions = await querySessions(user.id);
  const totalConversationTime =
    sessions.reduce((acc, s) => acc + s.duration, 0) / 60;
  const expense = await totalCost(sessions);
  const revenue = (await upcomingCost(user.id)) ?? 0;

  // Check plan limit
  if (totalConversationTime > limit) {
    console.log(
      `total conversation time of ${totalConversationTime} over limit of ${limit}`
    );
    return <PaywallMainApp user={user} plan={plan} limit={limit} />;
  }

  // Check product cost
  if (plan != Plan.FREE && expense > revenue) {
    console.log(`expense of ${expense} over revenue of ${revenue}`);
  }

  const profile = await selectProfile(user.id);
  const lang = profile?.lang;
  if (!lang) {
    redirect("/dashboard");
  }
  let joyrideActive: boolean = false;
  if (!profile.experienced.includes(Experience.JOYRIDE.toString())) {
    joyrideActive = true;
    profile.experienced.push(Experience.JOYRIDE.toString());
    updateProfile(profile);
  }

  const topic = (await searchParams).topic ?? "What do you want to talk about?";
  const ephemeralToken: string = await mintEphemeralToken(lang);

  return (
    <RTCMainApp
      user={user}
      lang={lang}
      ephemeralToken={ephemeralToken}
      topic={topic}
      joyrideActive={joyrideActive}
    />
  );
}
