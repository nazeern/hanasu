"use client";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout-form";
import { loadStripe } from "@stripe/stripe-js";
import { User } from "@supabase/auth-js";
import { Plan, planInfo } from "@/app/lib/data";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

export default function AcceptPayment({
  user,
  plan,
}: {
  user: User;
  plan: Plan;
}) {
  const [amount, setAmount] = useState<number>(
    planInfo[plan].initialChargedAmount
  );

  // eslint-disable-next-line
  const options: any = {
    mode: "subscription",
    amount: amount,
    currency: "usd",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm user={user} plan={plan} setAmount={setAmount} />
    </Elements>
  );
}
