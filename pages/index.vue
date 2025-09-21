<template>
  <div class="container mx-auto p-4 space-y-6">
    <Head>
      <Title>YIM-Platform | Recommend</Title>
      <Meta
        name="description"
        content="ช้อปสินค้าคุณภาพ ราคาดี ส่งไว — YIM-Platform"
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
        <div v-if="!loading">
          <h2 class="text-2xl font-bold mb-4">Products</h2>
          <ProductGrid :items="filtered" @add="onAdd" />
        </div>
        <div v-else>
          <div v-for="n in 6" :key="n" class="card p-3 animate-pulse">
            <div class="h-40 bg-gray-200 rounded mb-3"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
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
      filter: { q: "", brand: null, min: 0, max: 10000 } as FilterState,
      products: [] as ProductItem[], // <- เก็บสินค้าที่ดึงมาไว้ใน state หน้า
      loading: false as boolean,
      loadError: "" as string | null,
    };
  },

  computed: {
    ...mapStores(useProductStore, useCartStore),

    // ใช้ this.products แทนการอ่านจาก store
    brands(): string[] {
      const s = new Set<string>();
      for (const p of this.products) s.add(p.brand);
      return Array.from(s).sort();
    },

    filtered(): ProductItem[] {
      const q = this.filter.q.toLowerCase().trim();
      return this.products.filter((p) => {
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

  async mounted() {
    this.loading = false;
    await this.getProducts();
  },

  methods: {
    async getProducts() {
      try {
        this.loading = true;
        this.loadError = "";

        // ถ้าใน store มี action ชื่อ fetchAll ก็เรียกใช้ (กันโหลดซ้ำได้ใน action)
        if (typeof this.productStore.fetchAll === "function") {
          await this.productStore.fetchAll();
          this.products = (this.productStore.items ?? []) as ProductItem[];
        } else {
          // fallback: ถ้ายังไม่มี action ก็อ่านจาก state ตรง ๆ ไปก่อน
          this.products = (this.productStore?.items ?? []) as ProductItem[];
        }
      } catch (err) {
        console.error(err);
        this.loadError = "โหลดรายการสินค้าล้มเหลว";
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    },

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
