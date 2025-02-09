"use client";

import { Plan, planInfo } from "@/app/lib/data";
import AcceptPayment from "@/app/ui/accept-payment";
import PlanCard from "@/app/ui/plan-card";
import { User } from "@supabase/auth-js";
import { useState } from "react";
import { currencyString } from "@/app/lib/utils";

export default function UpgradePage({
  user,
  plan,
}: {
  user: User;
  plan: Plan;
}) {
  // How much will the user be charged? This may change due to applied coupons.
  const [amount, setAmount] = useState<number>(planInfo[plan].baseAmount);

  return (
    <div className="w-full max-w-3xl flex md:flex-row flex-col gap-12 px-1">
      <AcceptPayment
        user={user}
        plan={plan}
        paymentAmount={amount}
        setAmount={setAmount}
      />
      <PlanCard
        plan={plan}
        userId={user?.id}
        displayAmount={currencyString(amount)}
      />
    </div>
  );
}
