import { LogoTitle } from "@/app/ui/logo";
import Toast from "@/app/ui/toast";
import GoogleButton from "@/app/ui/google-button";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SigninForm from "@/app/ui/signin-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }
  if (!process.env.CAPTCHA_SITEKEY) {
    redirect("/");
  }
  const params = await searchParams;
  const error = params?.error ? decodeURIComponent(params?.error) : null;

  return (
    <>
      <div id="logo" className="mb-4">
        <LogoTitle />
      </div>
      <div className="min-w-96 w-4/12 bg-white rounded-lg shadow p-10 border">
        <Toast style="error">{error}</Toast>
        <p className="text-2xl font-bold mb-6">Create an account</p>
        {/* Sign in with Google */}
        <div className="flex justify-center">
          <GoogleButton next="/dashboard" />
        </div>
        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <hr className="w-full border-t border-gray-300" />
          <span className="px-4 text-gray-500">or</span>
          <hr className="w-full border-t border-gray-300" />
        </div>
        <SigninForm sitekey={process.env.CAPTCHA_SITEKEY} />
      </div>
      <p className="text-xs text-gray-500 font-light mt-4 pb-12 px-1">
        By continuing, you agree to SimpleClip&apos;s{" "}
        <a className="underline" target="_blank" href="/terms">
          Terms of Service
        </a>
        , and to receive periodic emails with updates.
      </p>
    </>
  );
}
