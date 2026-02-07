import { ShopifyProduct } from './shopify';
import { ProductOverride } from '@/stores/adminStore';

/**
 * Syncs product inventory from spreadsheet rows into the admin store.
 * Handles matching by ID, handle, or title, and distributes inventory across sizes if needed.
 */
export function syncProductInventory(
  rows: any[],
  allProducts: ShopifyProduct[] | undefined,
  updateProductOverride: (id: string, override: Partial<ProductOverride>) => void,
  PRODUCT_SIZES: readonly string[]
): number {
  let updatedCount = 0;

  rows.forEach((row, index) => {
    const rawId = row.id ? String(row.id) : '';
    const handle = row.handle ? String(row.handle) : '';
    const title = row.title ? String(row.title) : '';

    if (rawId || handle || title) {
      // 1. Find existing product for matching
      const existingProduct = allProducts?.find(p =>
        p.node.id === rawId ||
        p.node.id === `gid://shopify/Product/${rawId}` ||
        (handle && p.node.handle === handle) ||
        (title && p.node.title.toLowerCase() === title.toLowerCase())
      );

      const id = existingProduct
        ? existingProduct.node.id
        : (rawId
            ? (rawId.startsWith('gid://') ? rawId : `gid://shopify/Product/${rawId}`)
            : `sync-${index}`);

      // 2. Determine sizes
      const sizes = row.sizes
        ? String(row.sizes).split('|').map((s: string) => s.trim().toUpperCase())
        : (existingProduct?.node.options.find(o => o.name === 'Size')?.values);

      // 3. Handle size inventory
      let sizeInventory: Record<string, number> | undefined = undefined;
      if (row.size_inventory) {
        sizeInventory = {};
        String(row.size_inventory).split('|').forEach((part: string) => {
          const [s, q] = part.split(':');
          if (s && q) sizeInventory![s.trim().toUpperCase()] = parseInt(q.trim()) || 0;
        });
      } else if (row.inventory !== undefined) {
        // Auto-distribute total inventory if size_inventory is missing
        const total = parseInt(row.inventory) || 0;
        const targetSizes = sizes || [...PRODUCT_SIZES];
        sizeInventory = {};
        const perSize = Math.floor(total / (targetSizes.length || 1));
        targetSizes.forEach((s, idx) => {
          sizeInventory![s] = idx === targetSizes.length - 1 ? total - (perSize * (targetSizes.length - 1)) : perSize;
        });
      }

      updateProductOverride(id, {
        title: row.title ? String(row.title) : undefined,
        price: row.price ? String(row.price) : undefined,
        inventory: row.inventory !== undefined ? parseInt(row.inventory) : undefined,
        sizes: sizes,
        sizeInventory: sizeInventory,
      });
      updatedCount++;
    }
  });

  return updatedCount;
}
