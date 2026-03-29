export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description?: string;
}

export function PropsTable({
  title,
  props,
}: {
  title?: string;
  props: PropDef[];
}) {
  return (
    <div
      className="not-prose my-6 overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--docs-card-border)" }}
    >
      {title && (
        <div
          className="border-b px-4 py-2 text-xs font-medium"
          style={{
            backgroundColor: "var(--docs-demo-header-bg)",
            borderColor: "var(--docs-card-border)",
            color: "var(--docs-muted)",
          }}
        >
          {title}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b"
              style={{
                backgroundColor: "var(--docs-table-header-bg)",
                borderColor: "var(--docs-table-border)",
              }}
            >
              <th className="px-4 py-2.5 text-left text-xs font-semibold" style={{ color: "var(--docs-muted)" }}>
                Prop
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold" style={{ color: "var(--docs-muted)" }}>
                Type
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold" style={{ color: "var(--docs-muted)" }}>
                Default
              </th>
              {props.some((p) => p.description) && (
                <th className="px-4 py-2.5 text-left text-xs font-semibold" style={{ color: "var(--docs-muted)" }}>
                  Description
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr
                key={prop.name}
                className="border-b last:border-0"
                style={{ borderColor: "var(--docs-table-row-border)" }}
              >
                <td className="px-4 py-2.5 align-top">
                  <code
                    className="rounded px-1.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: "var(--docs-code-bg)",
                      color: "var(--arclo-accent, #6C5CE7)",
                    }}
                  >
                    {prop.name}
                  </code>
                </td>
                <td className="px-4 py-2.5 align-top">
                  <code className="text-xs" style={{ color: "var(--docs-body)" }}>{prop.type}</code>
                </td>
                <td className="px-4 py-2.5 align-top text-xs">
                  {prop.default ? (
                    <code
                      className="rounded px-1.5 py-0.5 text-xs"
                      style={{ backgroundColor: "var(--docs-code-bg)", color: "var(--docs-body)" }}
                    >
                      {prop.default}
                    </code>
                  ) : (
                    <span style={{ color: "var(--docs-muted)" }}>—</span>
                  )}
                </td>
                {props.some((p) => p.description) && (
                  <td className="px-4 py-2.5 align-top text-xs" style={{ color: "var(--docs-body)" }}>
                    {prop.description}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface InfoRow {
  cells: string[];
}

export function InfoTable({
  title,
  headers,
  rows,
}: {
  title?: string;
  headers: string[];
  rows: InfoRow[];
}) {
  return (
    <div
      className="not-prose my-6 overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--docs-card-border)" }}
    >
      {title && (
        <div
          className="border-b px-4 py-2 text-xs font-medium"
          style={{
            backgroundColor: "var(--docs-demo-header-bg)",
            borderColor: "var(--docs-card-border)",
            color: "var(--docs-muted)",
          }}
        >
          {title}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b"
              style={{
                backgroundColor: "var(--docs-table-header-bg)",
                borderColor: "var(--docs-table-border)",
              }}
            >
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-xs font-semibold"
                  style={{ color: "var(--docs-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b last:border-0"
                style={{ borderColor: "var(--docs-table-row-border)" }}
              >
                {row.cells.map((cell, j) => (
                  <td key={j} className="px-4 py-2.5 text-xs" style={{ color: "var(--docs-body)" }}>
                    {j === 0 ? (
                      <code
                        className="rounded px-1.5 py-0.5 font-semibold"
                        style={{ backgroundColor: "var(--docs-code-bg)", color: "var(--docs-heading)" }}
                      >
                        {cell}
                      </code>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
