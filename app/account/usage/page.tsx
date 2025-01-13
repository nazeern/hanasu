import { Plan, planInfo } from "@/app/lib/data";
import { getCurrentPlan, upcomingCost } from "@/app/lib/profiles";
import { querySessions } from "@/app/lib/sessions";
import { encodeBase64UUID } from "@/app/lib/string";
import { currencyString, timeString } from "@/app/lib/utils";
import CancelPlan from "@/app/ui/cancel-plan";
import Card from "@/app/ui/card";
import IconButton from "@/app/ui/icon-button";
import Table from "@/app/ui/table";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function UsagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { plan } = await getCurrentPlan(user.id);
  const planDisplay = planInfo[plan].display;

  const sessions = await querySessions(user.id);
  const cost = await upcomingCost(user.id);
  const totalConversationTime = sessions.reduce(
    (acc, s) => acc + s.duration,
    0
  );
  const avgResponseDuration = Math.round(
    sessions.reduce((acc, s) => acc + s.avgResponseDurationMs, 0) /
      sessions.filter((s) => s.avgResponseDurationMs != 0).length
  );
  const totalResponses = sessions.reduce((acc, s) => acc + s.nResponses, 0);

  return (
    <>
      <p className="text-4xl font-semibold mb-4">Usage</p>
      <div className="flex gap-2 items-center mb-3">
        <IconButton
          text={planDisplay}
          className="w-fit rounded-full border border-primary bg-primarybg px-4 py-1 text-primary"
        />
        <IconButton
          text="See Pricing Plans &rarr;"
          href="/pricing"
          className="italic text-primary"
        />
      </div>
      <div className="w-full flex flex-col gap-y-4 rounded-md bg-gray-100 p-2">
        <div className="flex gap-4 flex-wrap">
          <Card
            label="Total Conversation Time"
            value={timeString(totalConversationTime)}
          />
          <Card
            label="Average Response Duration"
            value={avgResponseDuration + "ms"}
          />
          <Card label="Total Responses" value={totalResponses} />
          {plan == Plan.USAGE && (
            <Card
              label="Total Cost"
              value={cost ? currencyString(cost) : "-"}
            />
          )}
        </div>
        <div className="max-w-2/3 p-4 border rounded-3xl bg-white">
          <p className="font-bold text-2xl mb-4">Sessions</p>
          <Table
            headers={["Topic", "Duration"]}
            rows={sessions.map(({ id, topic, duration }) => [
              topic,
              timeString(duration),
              <IconButton
                key={id}
                text="View"
                href={`/sessions/${encodeBase64UUID(id!)}`}
                className="w-fit p-2 bg-primary text-onprimary"
              />,
            ])}
          />
        </div>
        {plan != Plan.FREE && <CancelPlan user={user} />}
      </div>
    </>
  );
}
