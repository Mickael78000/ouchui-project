import { type Address } from 'viem';

interface VaultOption {
  label: string;
  address: Address;
}

interface VaultSelectorProps {
  vaults: VaultOption[];
  selected: Address;
  onChange: (address: Address) => void;
}

export function VaultSelector({ vaults, selected, onChange }: VaultSelectorProps) {
  return (
    <div className="flex gap-2">
      {vaults.map((v) => (
        <button
          key={v.address}
          onClick={() => onChange(v.address)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selected === v.address
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

export type { VaultOption };
