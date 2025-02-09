"use client";

import { Plan, planInfo } from "@/app/lib/data";
import AcceptPayment from "@/app/ui/accept-payment";
import PlanCard from "@/app/ui/plan-card";
import { User } from "@supabase/auth-js";
import { useState } from "react";

export default function UpgradePage({
  user,
  plan,
}: {
  user: User;
  plan: Plan;
}) {
  const [amount, setAmount] = useState<number>(planInfo[plan].amount);

  return (
    <div className="w-full max-w-3xl flex md:flex-row flex-col gap-12 px-1">
      <AcceptPayment
        user={user}
        plan={plan}
        paymentAmount={amount}
        setAmount={setAmount}
      />
      <PlanCard plan={plan} userId={user?.id} amountOverride={undefined} />
    </div>
  );
}
