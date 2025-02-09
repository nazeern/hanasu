"use client";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout-form";
import { loadStripe } from "@stripe/stripe-js";
import { User } from "@supabase/auth-js";
import { Plan } from "@/app/lib/data";
import { Dispatch, SetStateAction } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

export default function AcceptPayment({
  user,
  plan,
  paymentAmount,
  setAmount,
}: {
  user: User;
  plan: Plan;
  paymentAmount: number;
  setAmount: Dispatch<SetStateAction<number>>;
}) {
  // eslint-disable-next-line
  const options: any = {
    mode: "subscription",
    amount: plan == Plan.USAGE ? 0 : paymentAmount, // Stripe uses zero price to mean `pending`
    currency: "usd",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm user={user} plan={plan} setAmount={setAmount} />
    </Elements>
  );
}
