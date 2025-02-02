"use client";

import { timeString } from "@/app/lib/utils";
import { Session } from "@/app/ui/rtc-main-app";

export default function SessionOverview({ session }: { session: Session }) {
  return (
    <div className="border-b-2 pb-1">
      <p className="w-full mx-auto text-lg font-bold m-2">{session.topic}</p>
      <div className="grid grid-rows-3 md:grid-cols-3 md:grid-rows-1 gap-1">
        <div className="rounded-md bg-white border p-4">
          <p className="font-bold text-2xl">{timeString(session.duration)}</p>
          <p className="text-gray-500">Total Duration</p>
        </div>
        <div className="rounded-md bg-white border p-4">
          <p className="font-bold text-2xl">{session.nResponses * 2 + 1}</p>
          <p className="text-gray-500">Total Responses</p>
        </div>
        <div className="rounded-md bg-white border p-4">
          <p className="font-bold text-2xl">
            {session.avgResponseDurationMs}ms
          </p>
          <p className="text-gray-500">Avg. Response Duration</p>
        </div>
      </div>
    </div>
  );
}
