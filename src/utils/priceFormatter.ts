/**
 * Formats a number as a price with comma separators for thousands
 * @param price - The price to format
 * @param currency - The currency symbol (default: '₱')
 * @returns Formatted price string (e.g., "₱1,899.00")
 */
export const formatPrice = (price: number, currency: string = '₱'): string => {
  return `${currency}${price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Formats a number with comma separators (without currency symbol)
 * @param price - The price to format
 * @returns Formatted number string (e.g., "1,899.00")
 */
export const formatNumber = (price: number): string => {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
