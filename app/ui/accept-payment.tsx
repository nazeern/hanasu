"use client";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout-form";
import { loadStripe } from "@stripe/stripe-js";
import { User } from "@supabase/auth-js";
import { Plan } from "@/app/lib/data";

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
  // eslint-disable-next-line
  const options: any = {
    mode: "subscription",
    amount: 0,
    currency: "usd",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm user={user} plan={plan} />
    </Elements>
  );
}
