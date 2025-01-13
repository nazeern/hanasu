import { Plan, planFromString } from "@/app/lib/data";
import AcceptPayment from "@/app/ui/accept-payment";
import PlanCard from "@/app/ui/plan-card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function UpgradePage({
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
  return (
    <div className="w-full max-w-3xl flex md:flex-row flex-col gap-12 px-1">
      <PlanCard plan={plan} userId={user?.id} />
      <AcceptPayment user={user} plan={plan} />
    </div>
  );
}
