"use client";

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
  return (
    <button
      onMouseDown={unmute}
      onMouseUp={mute}
      onMouseLeave={mute}
      onTouchStart={unmute}
      onTouchEnd={mute}
      className={cn("flex gap-1 items-center rounded-md select-none", {
        "mx-auto p-2 bg-primary fill-primarybg": muted,
        "mx-auto p-2 bg-primarybg fill-primary rounded-full border border-primarybg":
          !muted,
      })}
    >
      {muted ? (
        <MicrophoneSlash className="size-8" />
      ) : (
        <Microphone className="size-8" />
      )}
    </button>
  );
}
