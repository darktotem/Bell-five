//Utility functions for formatting currencies, numbers, and Bellfive IDs.

// Formats a number as KES currency (e.g., 125000 -> "KES 125,000")
export const formatKES = (n: number): string => `KES ${Math.round(n).toLocaleString('en-KE')}`;

// Formats numbers into compact representations (e.g., 1500000 -> "1.5M")
export const formatCompactNumber = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString
('en-KE', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }
);

export const formatMultiplier = (w: number): string => `${w.toFixed(2).replace(/0$/, '')}x`;

export const formatSize = (bytes: number): string =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

// Formats percentages (e.g., 12.4 -> "12.4%")
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Truncates sensitive personal numbers for privacy preview (e.g., "38492019" -> "•••• 2019")
export const maskSensitiveField = (value: string): string => {
  if (!value || value.length < 4) return '••••';
  const lastFour = value.slice(-4);
  return `•••• ${lastFour}`;
};

// Copies text to clipboard and returns success boolean
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};