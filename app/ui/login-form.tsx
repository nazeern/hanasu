"use client";

import { login } from "@/app/lib/actions";
import Link from "next/link";
import React, { useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function LoginForm({ sitekey }: { sitekey: string }) {
  const captcha = useRef<HCaptcha | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [showCaptchaPrompt, setShowCaptchaPrompt] = useState<boolean>(false);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
      <label htmlFor="email" className="">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
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
        required
        className=" bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
      />
      <input name="captchaToken" type="hidden" required value={captchaToken} />
      {showCaptchaPrompt && (
        <p className="text-sm text-red-800 italic">
          Please complete the Captcha to log in.
        </p>
      )}
      <HCaptcha
        ref={captcha}
        sitekey={sitekey}
        onVerify={(token) => setCaptchaToken(token)}
      />
      <button
        type="submit"
        className="text-onprimary bg-primary rounded-lg mb-3 font-semibold py-2 px-4 disabled:bg-orange-100 disabled:text-primary"
        disabled={loading}
      >
        {loading ? "Logging In..." : "Log In"}
      </button>
      <p className="text-sm font-light text-gray-500">
        Need an account?{" "}
        <Link
          href="/sign-up"
          className="font-bold text-primary hover:underline"
        >
          Sign up here
        </Link>
      </p>
    </form>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!captchaToken) {
      setShowCaptchaPrompt(true);
    } else {
      const formData = new FormData(e.currentTarget);
      setLoading(true);
      await login(formData);
      captcha.current?.resetCaptcha();
      setLoading(false);
    }
  }
}
