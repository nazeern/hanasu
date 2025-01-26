import QuoteMark from "../icons/quote-icon";
import {
  // BanknotesIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const testimonials = [
  {
    icon: SparklesIcon,
    header: "Effective",
    quote:
      "After using Hanasu, I finally gained the confidence to have natural conversations with my Japanese roommate.",
  },
  {
    icon: ClockIcon,
    header: "Saves Time",
    quote:
      "I used Duolingo daily for months and still struggled to speak naturally. I've only used Hanasu for a week, and finally feel like I can actually talk with real people.",
  },
  // {
  //   icon: BanknotesIcon,
  //   header: "Reasonably Priced",
  //   quote:
  //     "I used to pay hundreds for language courses & tutors - now I pay a fraction of that cost!",
  // },
];

export default async function Testimonials() {
  return (
    <div className="grid md:grid-cols-2 gap-12">
      {testimonials.map((testimonial, index) => (
        <div key={index}>
          <div className="flex items-center justify-center gap-x-2 mb-1 text-gray-700">
            <testimonial.icon className="size-10" />
            <h3 className="italic text-2xl font-bold">{testimonial.header}</h3>
          </div>
          {/* Main Card */}
          <div className="bg-white py-6 px-3 rounded-lg shadow-xl border border-gray-300">
            <QuoteMark className="size-10 mx-auto fill-primary mb-4" />
            <p className="italic font-medium text-2xl leading-loose">
              {testimonial.quote}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
