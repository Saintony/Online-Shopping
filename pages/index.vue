<template>
  <div class="container mx-auto p-4 space-y-6">
    <Head>
      <Title>Y-Shop | สินค้าแนะนำ</Title>
      <Meta
        name="description"
        content="ช้อปสินค้าคุณภาพ ราคาดี ส่งไว — Y-Shop"
      />
    </Head>
    <!-- Promotion bar  -->
    <div class="rounded bg-amber-100 border border-amber-300 px-4 py-2 text-sm">
      For free shipping on orders over ฿50,000 and more discount use code
      <b>YIMPLATFORM</b>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <!-- Filter -->
      <aside class="md:col-span-3">
        <div class="bg-white rounded border p-4">
          <h3 class="text-lg font-semibold mb-4">Filter</h3>
          <FilterBar v-model="filter" :brands="brands" />
        </div>
      </aside>

      <!-- Products -->
      <main class="md:col-span-9">
        <h2 class="text-2xl font-bold mb-4">Products</h2>
        <ProductGrid :items="filtered" @add="onAdd" />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import FilterBar from "../components/filters/FilterBar.vue";
import ProductGrid from "../components/products/ProductGrid.vue";
import { useProductStore } from "../stores/product";
import { useCartStore } from "../stores/cart";
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

      this.$toast?.add({
        group: "app",
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
