"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const faqs = [
  {
    question: "What makes Hanasu different?",
    answer:
      "I made Hanasu because the alternatives were either (1) too expensive, (2) took too long, or (3) inconvenient. \
      Hanasu is a language app that puts immersion and actual conversation first— not lists of vocabulary.",
  },
  {
    question: "Who is Hanasu for?",
    answer:
      "Hanasu is for anyone looking to learn a language for practical usage. \
      Learning a language shouldn't be a chore— it should feel intuitive and simple. \
      Nowadays, there are tons of free resources, but the hardest part is actually immersing and exercising what you've learned.\
      Hanasu takes care of this for you!",
  },
  {
    question: "Is Hanasu free?",
    answer:
      "If you're new, you can get started at no cost! \
      Running cutting-edge AI models is expensive, but you should be confident before you buy. \
      (I'll never ask for credit cards for free trials.",
  },
  {
    question: "Do I have to install anything?",
    answer:
      "Nope! Hanasu runs entirely within your browser, and autosaves to your account. Work from any device, and from mobile!",
  },
  {
    question: "How does pricing work?",
    answer:
      "Aside from the free trial, we offer three pricing options: (1) Pay as You Go, (2) Monthly, and (3) Yearly. \
      Pay as You Go is generally $0.10 for a minute of conversation, and is our most popular option.",
  },
  {
    question: "What is the cancellation policy?",
    answer: "Cancel anytime!",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white rounded-xl max-w-7xl w-full border-2 border-gray-300 py-8">
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 py-1 px-8">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left text-2xl font-medium py-2 flex justify-between"
            >
              {faq.question}
              {index == openIndex ? (
                <ChevronUpIcon className="size-8 text-primary" />
              ) : (
                <ChevronDownIcon className="size-8 text-primary" />
              )}
            </button>
            {openIndex === index && (
              <p className="text-xl text-left text-gray-700 mt-2 px-4 pb-4 leading-10">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
