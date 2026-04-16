import { useCallback, type ChangeEvent, type KeyboardEvent } from 'react';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  unit: string;
  maxValue?: bigint;
  decimals?: number;
  disabled?: boolean;
  /** Inline validation message shown below the input. */
  hint?: string;
  /** If true, hint is shown as a warning/error color. */
  hintError?: boolean;
}

/** Sanitise: allow digits, one leading dot, limit decimal places. */
function sanitize(raw: string, maxDecimals: number): string {
  // Strip everything except digits and dot
  let s = raw.replace(/[^0-9.]/g, '');
  // Only one dot
  const parts = s.split('.');
  if (parts.length > 2) s = parts[0] + '.' + parts.slice(1).join('');
  // Limit decimal places
  if (parts.length === 2 && parts[1].length > maxDecimals) {
    s = parts[0] + '.' + parts[1].slice(0, maxDecimals);
  }
  return s;
}

function fmtMax(value: bigint, decimals: number): string {
  const divisor = 10n ** BigInt(decimals);
  const whole = value / divisor;
  const frac = value % divisor;
  if (frac === 0n) return whole.toString();
  const fracStr = frac.toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${whole}.${fracStr}`;
}

export function AmountInput({
  value,
  onChange,
  label,
  unit,
  maxValue,
  decimals = 6,
  disabled = false,
  hint,
  hintError = false,
}: AmountInputProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(sanitize(e.target.value, decimals));
    },
    [onChange, decimals]
  );

  // Block keys that cause browser-native number weirdness
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
  }, []);

  const handleMax = useCallback(() => {
    if (maxValue !== undefined) onChange(fmtMax(maxValue, decimals));
  }, [maxValue, decimals, onChange]);

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      <div className="relative flex items-center">
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 pl-3 pr-24 py-2.5 text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-40"
        />
        <div className="absolute right-2 flex items-center gap-1.5">
          {maxValue !== undefined && maxValue > 0n && (
            <button
              type="button"
              onClick={handleMax}
              disabled={disabled}
              className="rounded bg-gray-700 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-300 hover:bg-gray-600 hover:text-white disabled:opacity-40 transition-colors"
            >
              Max
            </button>
          )}
          <span className="text-xs text-gray-500 select-none">{unit}</span>
        </div>
      </div>
      {hint && (
        <p className={`mt-1 text-xs ${hintError ? 'text-red-400' : 'text-gray-500'}`}>
          {hint}
        </p>
      )}
    </div>
  );
}
