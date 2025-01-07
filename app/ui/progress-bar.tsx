"use client";

export default function ProgressBar({
  percent,
  height,
}: {
  percent: number;
  height: number;
}) {
  return (
    <div className={`w-5/6 h-${height} bg-gray-300 rounded-lg`}>
      <div
        className={`h-${height} bg-primary rounded-lg`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
