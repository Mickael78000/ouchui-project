type Variant = 'info' | 'success' | 'warning' | 'error' | 'pending';

interface StatusMessageProps {
  variant: Variant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<Variant, string> = {
  info: 'border-gray-700 bg-gray-900/40 text-gray-300',
  success: 'border-emerald-700 bg-emerald-950/40 text-emerald-300',
  warning: 'border-yellow-700 bg-yellow-950/40 text-yellow-300',
  error: 'border-red-700 bg-red-950/40 text-red-300',
  pending: 'border-indigo-700 bg-indigo-950/40 text-indigo-300',
};

export function StatusMessage({ variant, children, className = '' }: StatusMessageProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]} ${className}`}>
      {children}
    </div>
  );
}
