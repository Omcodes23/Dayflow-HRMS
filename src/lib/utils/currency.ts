/**
 * Formats a number as Indian Rupee currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatINR(
  amount: number | undefined | null,
  options?: {
    showSymbol?: boolean;
    compact?: boolean;
    decimals?: number;
  }
): string {
  const { showSymbol = true, compact = false, decimals = 0 } = options || {};
  
  if (amount === undefined || amount === null || isNaN(amount)) {
    return showSymbol ? '₹0' : '0';
  }

  // Use Indian numbering system
  const formatter = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    notation: compact ? 'compact' : 'standard',
  });

  return formatter.format(amount);
}

/**
 * Parse Indian currency string to number
 */
export function parseINR(value: string): number {
  // Remove currency symbol and commas
  const cleaned = value.replace(/[₹,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format large numbers in Indian style (Lakhs, Crores)
 */
export function formatIndianNumber(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} L`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)} K`;
  }
  return num.toLocaleString('en-IN');
}
