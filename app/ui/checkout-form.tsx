"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeError } from "@stripe/stripe-js";
import { useState } from "react";
import { subscribeUser } from "../lib/profiles";
import { User } from "@supabase/auth-js";
import { BASE_URL_DEFAULT } from "../constants";
import {
  LockClosedIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";
import { couponInfo, Plan, planInfo } from "@/app/lib/data";
import IconButton from "./icon-button";

export default function CheckoutForm({
  user,
  plan,
}: {
  user: User;
  plan: Plan;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [promoCode, setPromoCode] = useState<string>("");
  const [promoMessage, setPromoMessage] = useState<string>("");
  const [promoId, setPromoId] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const planDisplay = planInfo[plan].display;
  const dashboardMessage = `Congrats! You now have access on the ${planDisplay}!`;
  const searchParams = new URLSearchParams();
  searchParams.set("message", dashboardMessage);

  return (
    <div>
      <IconButton
        className="text-lg mb-4"
        href="/pricing"
        text="Back"
        icon={ChevronLeftIcon}
      />
      <form onSubmit={handleSubmit} className="">
        <PaymentElement />
        <div className="flex items-center gap-1 mt-4">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Have a promo code?"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="p-2 rounded-md bg-primarybg text-primary border border-primary"
            onClick={handleApplyPromo}
          >
            Apply
          </button>
        </div>
        <p className="text-primary italic mt-1">{promoMessage}</p>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="my-6 w-full justify-center items-center gap-x-3 flex text-onprimary px-1 py-2 rounded-lg bg-primary disabled:bg-blue-400 hover:bg-primaryhov"
        >
          Submit Payment
          {loading ? (
            <ArrowPathIcon className="size-5 animate-spin" />
          ) : (
            <LockClosedIcon className="size-5" />
          )}
        </button>
        {errorMessage && (
          <div className="bg-primarybg p-2 text-primary text-center rounded-lg mt-4 border border-primary">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );

  function handleError(error: StripeError) {
    setLoading(false);
    setErrorMessage(error.message ?? null);
  }

  // eslint-disable-next-line
  async function handleSubmit(event: any) {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    if (!elements) {
      return;
    }

    setLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    // Create the subscription
    const result = await subscribeUser(user, plan, promoId);
    if (!result) {
      alert(
        promoId
          ? "This promotion has already been redeemed."
          : "Error subscribing user."
      );
      setLoading(false);
      setPromoId(undefined);
      setPromoCode("");
      setPromoMessage("");
      return;
    }
    const { clientSecret, type } = result;
    const confirmIntent =
      type === "setup" ? stripe.confirmSetup : stripe.confirmPayment;

    // Confirm the Intent using the details collected by the Payment Element
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? BASE_URL_DEFAULT;
    const { error } = await confirmIntent({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${baseUrl}/dashboard?${searchParams.toString()}`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when confirming the Intent.
      // Show the error to your customer (for example, "payment details incomplete").
      handleError(error);
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  }

  function handleApplyPromo(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const coupon = couponInfo.find((info) => info.promoCode == promoCode);
    if (!promoCode) {
      setPromoMessage("");
      return;
    }
    if (!coupon) {
      setPromoCode("");
      setPromoMessage("Sorry, this promotion is invalid.");
      return;
    }
    if (coupon.plan != plan) {
      setPromoCode("");
      setPromoMessage(
        `This promotion is only available on the ${
          planInfo[coupon.plan].display
        }.`
      );
      return;
    }
    console.log(coupon);
    setPromoMessage(`Coupon applied: ${coupon.promoDesc}`);
    setPromoId(coupon.promoId);
  }
}
