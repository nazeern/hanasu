"use client";

import { anonSignup, signup } from "@/app/lib/actions";
import Link from "next/link";
import { langInfo } from "@/app/lib/data";
import React, { useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function SigninForm({ sitekey }: { sitekey: string }) {
  const captcha = useRef<HCaptcha | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [showCaptchaPrompt, setShowCaptchaPrompt] = useState<boolean>(false);

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
        <label htmlFor="email" className="">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
        />
        <label htmlFor="password" className="">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className=" bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
        />
        <label htmlFor="name" className="">
          Display Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
        />
        <label htmlFor="lang" className="">
          Target Language
        </label>
        <select
          id="lang"
          name="lang"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {langInfo.map((info) => (
            <option key={info.lang} value={info.lang}>
              {info.name} {info.flag}
            </option>
          ))}
        </select>
        <p className="text-xs font-bold text-gray-500 -mt-1 mb-4">
          You can change this at any time.
        </p>
        <input
          name="captchaToken"
          type="hidden"
          required
          value={captchaToken}
        />
        <div
          className={showCaptchaPrompt ? "border border-red-700 w-fit p-1" : ""}
        >
          <HCaptcha
            ref={captcha}
            sitekey={sitekey}
            onVerify={(token) => setCaptchaToken(token)}
          />
        </div>
        <button
          type="submit"
          className="text-onprimary bg-primary rounded-lg mb-3 font-semibold py-2 px-4 disabled:bg-orange-100 disabled:text-primary mt-4"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign up"}
        </button>
        <p className="text-sm font-light text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:underline"
          >
            Login here &rarr;
          </Link>
        </p>
      </form>
      {/* <p className="text-sm font-light text-gray-500 pt-2">
        Just looking?{" "}
        <button
          onClick={handleAnonSignup}
          className="font-bold text-primary hover:underline"
        >
          Continue as Guest &rarr;
        </button>
      </p> */}
    </>
  );

  // eslint-disable-next-line
  async function handleAnonSignup() {
    if (!captchaToken) {
      setShowCaptchaPrompt(true);
    } else {
      setLoading(true);
      await anonSignup(captchaToken);
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!captchaToken) {
      setShowCaptchaPrompt(true);
    } else {
      const formData = new FormData(e.currentTarget);
      setLoading(true);
      await signup(formData);
      captcha.current?.resetCaptcha();
      setLoading(false);
    }
  }
}
