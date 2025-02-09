import { Plan } from "@/app/lib/data";
import PlanCard from "@/app/ui/plan-card";
import { createClient } from "@/utils/supabase/server";

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-4 flex flex-col items-center gap-y-4">
      <p className="text-center text-3xl mb-10">
        Flexible pricing, designed to suit your needs.
      </p>
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-1">
        <PlanCard key={Plan.FREE} plan={Plan.FREE} userId={user?.id} />
        <PlanCard key={Plan.MONTHLY} plan={Plan.MONTHLY} userId={user?.id} />
        <PlanCard key={Plan.USAGE} plan={Plan.USAGE} userId={user?.id} />
      </div>
    </div>
  );
}
