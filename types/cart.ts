export interface CartLine {
  sku: number;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export interface CartTotals {
  itemsCount: number; // จำนวนชิ้นรวม (sum of qty)
  skuCount: number; // จำนวนรายการ SKU ที่แตกต่าง (distinct)
  subtotal: number; // Σ(price * qty)
  discount: number;
  deliveryFee: number;
  grandTotal: number; // ((subtotal - discount) + deliveryFee)
}
