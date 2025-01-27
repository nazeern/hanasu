import { LogoTitle } from "@/app/ui/logo";
import Toast from "@/app/ui/toast";
import GoogleButton from "@/app/ui/google-button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "@/app/ui/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    error?: string;
    redirectTo?: string;
  }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user || !process.env.CAPTCHA_SITEKEY) {
    redirect("/dashboard");
  }
  const params = await searchParams;
  const success = params?.success ? decodeURIComponent(params?.success) : null;
  const error = params?.error ? decodeURIComponent(params?.error) : null;
  const toastStyle = success ? "success" : "error";

  return (
    <>
      <div id="logo" className="mb-4">
        <LogoTitle />
      </div>
      <div className="min-w-96 w-4/12 bg-white rounded-lg shadow p-10 border">
        <Toast style={toastStyle}>{success || error}</Toast>
        <p className="text-2xl font-bold mb-6">Log in to your account</p>
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
        <LoginForm sitekey={process.env.CAPTCHA_SITEKEY} />
      </div>
    </>
  );
}
