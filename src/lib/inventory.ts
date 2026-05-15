/**
 * Inventory / Stock Utility Helpers
 *
 * All stock status logic is derived dynamically from `stockQuantity`.
 * Nothing is stored in the database — status is computed at render time.
 */

// ── Stock Status Types ──────────────────────────────────────────────

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

// ── Thresholds ─────────────────────────────────────────────────────

/** Stock quantity at or below which an item is considered "low stock" */
export const LOW_STOCK_THRESHOLD = 3;

/** Stock quantity at or below which an item is considered "out of stock" */
export const OUT_OF_STOCK_THRESHOLD = 0;

// ── Core Helpers ───────────────────────────────────────────────────

/**
 * Derive the stock status from a quantity value.
 *
 * - stockQuantity <= 0  → "out-of-stock"
 * - stockQuantity <= 3  → "low-stock"
 * - otherwise           → "in-stock"
 */
export function getStockStatus(stockQuantity: number): StockStatus {
  if (stockQuantity <= OUT_OF_STOCK_THRESHOLD) return "out-of-stock";
  if (stockQuantity <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

/**
 * Human-readable label for a stock status.
 */
export function getStockLabel(status: StockStatus): string {
  switch (status) {
    case "out-of-stock":
      return "Out of Stock";
    case "low-stock":
      return "Low Stock";
    case "in-stock":
    default:
      return "In Stock";
  }
}

/**
 * Tailwind / CSS class for a stock status badge.
 */
export function getStockBadgeClass(status: StockStatus): string {
  switch (status) {
    case "out-of-stock":
      return "bg-red-100 text-red-800";
    case "low-stock":
      return "bg-amber-100 text-amber-800";
    case "in-stock":
    default:
      return "bg-green-100 text-green-800";
  }
}

/**
 * Tailwind / CSS class for a stock status indicator dot.
 */
export function getStockDotClass(status: StockStatus): string {
  switch (status) {
    case "out-of-stock":
      return "bg-red-500";
    case "low-stock":
      return "bg-amber-500";
    case "in-stock":
    default:
      return "bg-green-500";
  }
}

/**
 * Short availability message for display near the "Add to Cart" button.
 * e.g. "Only 2 left in stock"
 */
export function getStockAvailabilityMessage(stockQuantity: number): string | null {
  if (stockQuantity <= 0) return null;
  if (stockQuantity <= LOW_STOCK_THRESHOLD) {
    return `Only ${stockQuantity} left in stock`;
  }
  return `${stockQuantity} in stock`;
}

/**
 * Whether a product can be added to cart.
 */
export function canAddToCart(stockQuantity: number): boolean {
  return stockQuantity > 0;
}

/**
 * Maximum quantity a user may select for a given stock level.
 */
export function getMaxQuantity(stockQuantity: number): number {
  return Math.max(1, stockQuantity);
}

/**
 * Check if a requested quantity exceeds available stock.
 */
export function isOverStock(requestedQty: number, stockQuantity: number): boolean {
  return requestedQty > stockQuantity;
}
