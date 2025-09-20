<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Promo bar (ตาม wireframe) -->
    <div class="rounded bg-amber-100 border border-amber-300 px-4 py-2 text-sm">
      For free shipping on orders over ฿50,000 and more discount use code
      <b>YIMPLATFORM</b>
    </div>

    <!-- 2-column layout -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <!-- LEFT: Filter -->
      <aside class="md:col-span-3">
        <div class="bg-white rounded border p-4">
          <h3 class="text-lg font-semibold mb-4">Filter</h3>
          <FilterBar v-model="filter" :brands="brands" />
        </div>
      </aside>

      <!-- RIGHT: Products -->
      <main class="md:col-span-9">
        <h2 class="text-2xl font-bold mb-4">Products</h2>
        <ProductGrid :items="filtered" @add="onAdd" />
      </main>
    </div>
  </div>
</template>

//
<script setup lang="ts">
// import FilterBar from "../components/filters/FilterBar.vue";
// import ProductGrid from "../components/products/ProductGrid.vue";
// import { useToast } from "primevue/usetoast";
// import { useProductStore } from "../stores/product";
// import { useCartStore } from "../stores/cart";
// import type { ProductItem } from "../types/product";

// type FilterState = {
//   q: string;
//   brand: string | null;
//   min: number | null;
//   max: number | null;
// };

// const products = useProductStore();
// const cart = useCartStore();
// const toast = useToast();

// const filter = reactive<FilterState>({
//   q: "",
//   brand: null,
//   min: 0,
//   max: 999999,
// });

// /** รายชื่อแบรนด์สำหรับดรอปดาวน์ */
// const brands = computed<string[]>(() => {
//   const set = new Set<string>();
//   (products.items as ProductItem[]).forEach((p) => set.add(p.brand));
//   return Array.from(set).sort();
// });

// /** สินค้าที่ผ่านการกรอง */
// const filtered = computed<ProductItem[]>(() =>
//   (products.items as ProductItem[]).filter((p) => {
//     const q = filter.q.toLowerCase().trim();
//     const nameOk = p.name.toLowerCase().includes(q);
//     const brandOk = !filter.brand || p.brand === filter.brand;
//     const minOk = filter.min == null ? true : p.price >= filter.min;
//     const maxOk = filter.max == null ? true : p.price <= filter.max;
//     return nameOk && brandOk && minOk && maxOk;
//   })
// );

// function onAdd(p: ProductItem) {
//   cart.add({
//     sku: p.sku,
//     name: p.name,
//     price: p.price,
//     image: p.image_url?.[0],
//   });
//   toast.add({
//     severity: "success",
//     summary: "Added to cart",
//     detail: p.name,
//     life: 1500,
//   });
// }
//
</script>

<script lang="ts">
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import FilterBar from "../components/filters/FilterBar.vue";
import ProductGrid from "../components/products/ProductGrid.vue";
import { useProductStore } from "../stores/product";
import { useCartStore } from "../stores/cart";
import { useToast } from "primevue/usetoast";
import type { ProductItem } from "../types/product";

type FilterState = {
  q: string;
  brand: string | null;
  min: number | null;
  max: number | null;
};

export default defineComponent({
  name: "HomePage",
  components: { FilterBar, ProductGrid },

  // ไม่มี setup() แล้ว ใช้ Options API ล้วน
  data() {
    return {
      filter: { q: "", brand: null, min: 0, max: 999999 } as FilterState,
    };
  },

  computed: {
    // ผูก store เข้ากับ this.productStore / this.cartStore
    ...mapStores(useProductStore, useCartStore),

    // รายชื่อแบรนด์
    brands(): string[] {
      const s = new Set<string>();
      const items = (this.productStore?.items ?? []) as ProductItem[];
      for (const p of items) s.add(p.brand);
      return Array.from(s).sort();
    },

    // สินค้าที่ผ่านการกรอง
    filtered(): ProductItem[] {
      const items = (this.productStore?.items ?? []) as ProductItem[];
      const q = this.filter.q.toLowerCase().trim();
      return items.filter((p) => {
        const nameOk = p.name.toLowerCase().includes(q);
        const brandOk = !this.filter.brand || p.brand === this.filter.brand;
        const minOk =
          this.filter.min == null ? true : p.price >= this.filter.min!;
        const maxOk =
          this.filter.max == null ? true : p.price <= this.filter.max!;
        return nameOk && brandOk && minOk && maxOk;
      });
    },
  },

  methods: {
    onAdd(p: ProductItem) {
      this.cartStore.add({
        sku: p.sku,
        name: p.name,
        price: p.price,
        image: p.image_url?.[0],
      });
      const toast = useToast();
      toast.add({
        severity: "success",
        summary: "Added to cart",
        detail: p.name,
        life: 1500,
      });
    },
  },
});
</script>

<style scoped></style>
