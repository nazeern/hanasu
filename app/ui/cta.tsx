import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const bullets = ["No credit card needed", "Get started for free"];

export default async function CTA() {
  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/sign-up"
          className="rounded-lg py-2 px-4 bg-primary text-onprimary text-center hover:border hover:border-primarybg hover:bg-primaryhov hover:-translate-y-1 duration-300"
        >
          Try for free &rarr;
        </Link>
        <Link
          href="/pricing"
          className="rounded-lg py-2 px-4 bg-gray-300 text-center hover:border hover:border-primarybg hover:bg-gray-300/50 hover:-translate-y-1 duration-300"
        >
          See Pricing
        </Link>
      </div>
      <div className="flex flex-col gap-y-1 mb-24">
        {bullets.map((bullet, index) => {
          return (
            <div key={index} className="flex items-center gap-x-1">
              <CheckCircleIcon className="stroke-2 size-5 text-green-700 shrink-0" />
              <p className="text-md text-gray-700">{bullet}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
