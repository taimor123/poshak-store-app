import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type Column = { label: string; align?: 'left' | 'right'; wrap?: boolean };

/** Bordered data table on a white surface; scrolls horizontally on small screens. */
export function Table({ columns, rows, highlight, footer }: { columns: Column[]; rows: ReactNode[][]; highlight?: number; footer?: ReactNode[] }) {
  const cell = (c: Column | undefined) => cn(c?.align === 'right' && 'text-right!', c?.wrap && 'whitespace-normal!');
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.label} scope="col" className={cell(c)}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i === highlight ? 'bg-selected font-semibold' : undefined}>
              {r.map((v, k) => (
                <td key={k} className={cell(columns[k])}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
          {footer && (
            <tr className="bg-alt font-semibold">
              {footer.map((v, k) => (
                <td key={k} className={cell(columns[k])}>
                  {v}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
