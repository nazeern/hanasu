export default async function Card({
  label,
  value,
}: {
  label: string;
  value?: number | string;
}) {
  return (
    <div className="w-full max-w-sm p-4 pt-12 border rounded-3xl bg-white">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-500">{label}</p>
    </div>
  );
}
