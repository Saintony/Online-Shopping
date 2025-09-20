import itemsJson from "../data/product_items.json";
export const useProductStore = defineStore("product", () => {
  const items = ref(itemsJson.product_items);
  return { items };
});
