"use client";

import React, { useEffect, useRef } from "react";
import Microphone from "../icons/microphone";
import MicrophoneSlash from "../icons/microphone-slash";
import { cn } from "../lib/utils";

export default function MicButton({
  muted,
  mute,
  unmute,
}: {
  muted: boolean;
  mute: any; // eslint-disable-line
  unmute: any; // eslint-disable-line
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) {
      return;
    }
    button.addEventListener("pointerdown", unmute, { passive: false });
    button.addEventListener("pointerup", mute, { passive: false });
    button.addEventListener("touchstart", prevent, { passive: false });
    button.addEventListener("touchmove", prevent, { passive: false });
    button.addEventListener("touchend", prevent, { passive: false });
    button.addEventListener("touchcancel", prevent, { passive: false });

    return () => {
      button.removeEventListener("pointerdown", unmute);
      button.removeEventListener("pointerup", mute);
      button.addEventListener("touchstart", prevent);
      button.addEventListener("touchmove", prevent);
      button.addEventListener("touchend", prevent);
      button.addEventListener("touchcancel", prevent);
    };
  }, []);
  return (
    <button
      id="mic-button"
      ref={buttonRef}
      className={cn("flex gap-1 items-center rounded-md", {
        "mx-auto p-2 bg-primary fill-primarybg": muted,
        "mx-auto p-2 bg-primarybg fill-primary rounded-full border border-primarybg":
          !muted,
      })}
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        KhtmlUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {muted ? (
        <MicrophoneSlash className="size-8" />
      ) : (
        <Microphone className="size-8" />
      )}
    </button>
  );

  // eslint-disable-next-line
  function prevent(event: any) {
    event.preventDefault();
  }
}
