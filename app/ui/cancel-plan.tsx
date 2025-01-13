"use client";

import { User } from "@supabase/auth-js";
import IconButton from "./icon-button";
import { unsubscribeUser } from "../lib/stripe";
import { useState } from "react";

const text = {
  initial: "Cancel Plan",
  intent: "Confirm Cancellation",
  confirmed: "Canceling Plan...",
};

export default function CancelPlan({ user }: { user: User }) {
  const [state, setState] = useState<"initial" | "intent" | "confirmed">(
    "initial"
  );
  return (
    <div className="flex items-center gap-2">
      <p>Had enough conversation?</p>
      <IconButton
        text={text[state]}
        className="w-fit rounded-full px-4 py-1 border border-primary text-primary"
        onClick={async () => {
          if (state == "initial") {
            setState("intent");
            return;
          } else if (state == "intent") {
            setState("confirmed");
            const cancelled = await unsubscribeUser(user);
            if (!cancelled) {
              alert(
                "Failed to unsubscribe from plan. Please email nitin.nazeer@gmail.com for support :)"
              );
            }
            setState("initial");
          }
        }}
      />
    </div>
  );
}
