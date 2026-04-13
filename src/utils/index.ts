import { CURRENCY } from '@/constants/brand';

/**
 * Format price with Ghana Cedis currency symbol
 * @param price - The price number to format
 * @returns Formatted price string (e.g., "GH₵ 450.00")
 */
export function formatPrice(price: number): string {
  return `${CURRENCY.symbol} ${price.toFixed(2)}`;
}

/**
 * Format price without decimal places
 * @param price - The price number to format
 * @returns Formatted price string (e.g., "GH₵ 450")
 */
export function formatPriceCompact(price: number): string {
  return `${CURRENCY.symbol} ${price.toLocaleString('en-GH')}`;
}

/**
 * Calculate discount percentage
 * @param originalPrice - The original price
 * @param salePrice - The discounted price
 * @returns Discount percentage (e.g., 20 for 20%)
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice <= 0) return 0;
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
}

/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-')   // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

/**
 * Truncate text to a specified length
 * @param text - The text to truncate
 * @param length - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Format phone number for WhatsApp URL
 * @param phone - Phone number string
 * @returns Formatted phone number for WhatsApp
 */
export function formatWhatsAppPhone(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it doesn't start with country code, add Ghana's +233
  if (!cleaned.startsWith('233')) {
    return `233${cleaned}`;
  }
  
  return cleaned;
}

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns Boolean indicating if valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Ghana format)
 * @param phone - Phone number to validate
 * @returns Boolean indicating if valid Ghana phone number
 */
export function isValidPhone(phone: string): boolean {
  // Ghana phone numbers: 10 digits, starts with 0 (e.g., 0242711007)
  const ghanaPhoneRegex = /^0[2-5]\d{8}$/;
  return ghanaPhoneRegex.test(phone);
}

/**
 * Delay utility for animations and loading states
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random order number
 * @returns Unique order number string
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AW-${timestamp}-${random}`;
}

/**
 * Class name helper - combines class names conditionally
 * @param classes - Array of class strings or conditional objects
 * @returns Combined class string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Debounce function for search inputs
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}