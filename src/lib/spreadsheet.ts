import * as XLSX from 'xlsx';

/**
 * Parses an ArrayBuffer (from a CSV or Excel file) into an array of objects.
 * Normalizes all keys to lowercase and trims whitespace.
 */
export function parseSpreadsheet(data: ArrayBuffer): any[] {
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(worksheet);

  return json.map((row: any) => {
    const normalizedRow: any = {};
    Object.keys(row).forEach((key) => {
      let normalizedKey = key.toLowerCase().trim();

      // Map common variations to standard keys
      if (['stock', 'qty', 'quantity'].includes(normalizedKey)) {
        normalizedKey = 'inventory';
      }
      if (['item id', 'itemid', 'sku', 'product_id', 'productid'].includes(normalizedKey)) {
        normalizedKey = 'id';
      }
      if (['item name', 'itemname', 'product_name', 'productname', 'name'].includes(normalizedKey)) {
        normalizedKey = 'title';
      }
      if (['type', 'product type', 'producttype'].includes(normalizedKey)) {
        normalizedKey = 'producttype';
      }
      if (['collection', 'collections'].includes(normalizedKey)) {
        normalizedKey = 'collection';
      }
      if (['price per unit', 'unit price', 'cost'].includes(normalizedKey)) {
        normalizedKey = 'cost';
      }

      normalizedRow[normalizedKey] = row[key];
    });
    return normalizedRow;
  });
}
