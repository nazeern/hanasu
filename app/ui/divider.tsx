"use client";

export default function Divider() {
  return (
    <div className="w-full flex items-center">
      <hr className="w-full border-t border-gray-500" />
      <span className="px-4 text-gray-500">or</span>
      <hr className="w-full border-t border-gray-500" />
    </div>
  );
}
