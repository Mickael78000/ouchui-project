interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  detail?: string;
  loading?: boolean;
}

export function MetricCard({ label, value, unit, detail, loading }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-1.5">
        {loading ? (
          <span className="text-gray-600 animate-pulse text-lg">—</span>
        ) : (
          <>
            <span className="text-xl font-semibold text-white font-mono">{value}</span>
            {unit && <span className="text-sm text-gray-400">{unit}</span>}
          </>
        )}
      </div>
      {detail && <p className="text-xs text-gray-500 mt-1.5">{detail}</p>}
    </div>
  );
}
