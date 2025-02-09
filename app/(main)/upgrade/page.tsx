import { Plan, planFromString } from "@/app/lib/data";
import UpgradePage from "@/app/ui/upgrade-page";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const params = await searchParams;
  const planString = params.plan;
  if (!user || !planString) {
    const searchParams = new URLSearchParams();
    searchParams.set("redirectTo", `/upgrade?plan=${planString}`);
    redirect("/sign-up");
  }
  const plan = planFromString(planString);

  if (plan == Plan.FREE) {
    redirect("/dashboard");
  }
  return <UpgradePage user={user} plan={plan} />;
}
