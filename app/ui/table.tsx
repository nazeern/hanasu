import EmptyRow from "./empty-row";

export default async function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: any[]; // eslint-disable-line
}) {
  return (
    <>
      <table className="w-full table-auto border-separate border-spacing-y-4">
        <thead className="font-extrabold text-lg">
          <tr>
            {headers.map((header) => (
              <td key={header}>{header}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`row-${i}`}>
              {row.map(
                (
                  val: any, // eslint-disable-line
                  i: number
                ) => (
                  <td key={`val-${i}`}>{val}</td>
                )
              )}
            </tr>
          ))}
          <EmptyRow />
        </tbody>
      </table>
    </>
  );
}
