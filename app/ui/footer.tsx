import Link from "next/link";
import { LogoTitle } from "@/app/ui/logo";

export default async function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 w-screen">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center mb-4 md:mb-0">
          <LogoTitle />
        </div>
        {/* Links */}
        <div className="flex flex-col gap-3">
          <Link
            href="/privacy"
            className="text-gray-400 hover:text-white transition duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-gray-400 hover:text-white transition duration-200"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
