// stores/cart.ts
import { defineStore } from "pinia";

type CartLine = {
  sku: number;
  name: string;
  price: number;
  image?: string;
  qty: number;
};

export const useCartStore = defineStore("cart", {
  state: () => ({
    lines: [] as CartLine[],
  }),
  getters: {
    items: (s) => s.lines,
    itemsCount: (s) => s.lines.reduce((n, l) => n + l.qty, 0),
  },
  actions: {
    add(line: Omit<CartLine, "qty"> & { qty?: number }) {
      const qty = line.qty ?? 1;
      const found = this.lines.find((l) => l.sku === line.sku);
      if (found) found.qty += qty;
      else this.lines.push({ ...line, qty });
    },
    updateQty(sku: number, qty: number) {
      const l = this.lines.find((x) => x.sku === sku);
      if (l) l.qty = qty;
    },
    remove(sku: number) {
      this.lines = this.lines.filter((x) => x.sku !== sku);
    },
    clear() {
      this.lines = [];
    },
  },
  persist: true,
});
