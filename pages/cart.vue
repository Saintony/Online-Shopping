<template>
  <div class="container mx-auto px-4 py-6 space-y-6">
    <!-- SEO -->
    <Head>
      <Title>Cart | YIM-Platform</Title>
      <Meta name="robots" content="noindex" />
    </Head>

    <!-- Back + Title -->
    <button
      class="flex items-center gap-2 text-sm hover:underline"
      @click="$router.back()"
    >
      <i class="pi pi-angle-left"></i> Back
    </button>
    <h1 class="text-2xl font-bold">Cart</h1>

    <!-- Empty state -->
    <div v-if="!items.length" class="text-center text-gray-500 py-20">
      ยังไม่มีสินค้าในตะกร้า
      <div class="mt-3">
        <NuxtLink to="/" class="btn-ghost">เลือกซื้อสินค้า</NuxtLink>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- LEFT: list + recommend -->
      <section
        class="lg:col-span-8 lg:h-[calc(100vh-8rem)] flex flex-col gap-4"
      >
        <!-- Product Lists -->
        <div class="flex-1 pr-2 space-y-4 overflow-y-auto cart-scroll">
          <div v-for="it in items" :key="it.sku" class="card p-4">
            <div class="flex gap-4 items-start">
              <img
                :src="it.image"
                :alt="it.name"
                class="w-24 h-24 object-cover rounded"
              />
              <div class="flex-1 min-w-0">
                <div class="text-xs text-gray-500">SKU: {{ it.sku }}</div>
                <div class="font-semibold truncate">{{ it.name }}</div>
                <div class="mt-1 price-now">฿ {{ fmt(it.price) }}</div>
                <div class="mt-3 flex items-center gap-2">
                  <button class="btn-ghost" @click="dec(it)">−</button>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    v-model.number="it.qty"
                    @change="qtyChanged(it)"
                    class="w-16 text-center border rounded px-2 py-1"
                  />
                  <button class="btn-ghost" @click="inc(it)">＋</button>
                </div>
              </div>
              <div class="ml-auto flex items-center gap-3">
                <div class="text-sm text-gray-500">รวม:</div>
                <div class="font-semibold">฿ {{ fmt(it.qty * it.price) }}</div>
                <button class="btn-ghost text-red-600" @click="remove(it)">
                  ลบ
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- RECOMMEND: -->
        <section class="card p-4 flex-none">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-semibold">Recommend</h3>
            <div class="flex gap-2">
              <button class="btn-ghost" @click="scrollRec(-1)">
                <i class="pi pi-chevron-left"></i>
              </button>
              <button class="btn-ghost" @click="scrollRec(1)">
                <i class="pi pi-chevron-right"></i>
              </button>
            </div>
          </div>

          <!-- Item recommend -->
          <div class="overflow-x-auto" ref="recWrap">
            <div class="flex gap-4 min-w-max h-full">
              <div
                v-for="p in recommended"
                :key="p.sku"
                class="w-[230px] h-full shrink-0 card p-3"
              >
                <div class="rounded overflow-hidden bg-gray-100 h-[110px]">
                  <!-- <img
                    :src="p.image_url?.[0]"
                    :alt="p.name"
                    class="w-full h-full object-cover"
                  /> -->

                  <NuxtLink :to="`/product/${p.sku}`">
                    <img
                      :src="p.image_url?.[0]"
                      :alt="p.name"
                      class="w-full aspect-[4/3] object-cover"
                    />
                  </NuxtLink>
                </div>
                <div class="mt-2 text-xs text-gray-500">SKU: {{ p.sku }}</div>
                <div class="text-sm font-medium line-clamp-2">{{ p.name }}</div>
                <div class="mt-1 price-now">฿ {{ fmt(p.price) }}</div>
                <button
                  class="btn-primary mt-2 w-full"
                  @click="addRecommended(p)"
                >
                  + Add to cart
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>

      <!-- summary -->
      <aside class="lg:col-span-4">
        <div
          class="card p-4 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] flex flex-col gap-4 lg:overflow-y-auto"
        >
          <h2 class="text-lg font-semibold">Summary</h2>

          <div class="flex-1 space-y-4">
            <div
              class="text-xs rounded border p-2"
              :class="
                subtotal < freeShippingThreshold
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-green-50 border-green-200'
              "
            >
              <template v-if="subtotal < freeShippingThreshold">
                ซื้อเพิ่มอีก ฿
                {{ fmt(freeShippingThreshold - subtotal) }} เพื่อรับสิทธิ์
                “ส่งฟรี”
              </template>
              <template v-else>ยอดถึงเกณฑ์ส่งฟรีแล้ว 🎉</template>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Promotion Code</label>
              <div class="flex gap-2">
                <input
                  v-model="promo"
                  placeholder="Promotion"
                  class="flex-1 border rounded px-3 py-2 text-sm w-full"
                />
                <button class="btn-primary" @click="applyPromo">Apply</button>
              </div>
            </div>
          </div>

          <div class="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>฿ {{ fmt(subtotal) }}</span>
          </div>

          <div class="flex justify-between text-sm">
            <span>Discount</span>
            <span class="text-brand-primary">-฿ {{ fmt(discount) }}</span>
          </div>

          <div class="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>{{ shipping === 0 ? "฿0.00" : `฿ ${fmt(shipping)}` }}</span>
          </div>

          <div
            class="border-t pt-2 flex justify-between items-center font-semibold"
          >
            <span>Total</span>
            <span>฿ {{ fmt(total) }}</span>
          </div>

          <button class="btn-primary w-full mt-auto" @click="checkout">
            Checkout
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useCartStore } from "../stores/cart";
import { useProductStore } from "../stores/product";
import type { ProductItem } from "../types/product";
import appConfig from "../data/config.json";

export default defineComponent({
  name: "CartPage",
  data() {
    return {
      promo: "YIMPLATFORM",
      freeShippingThreshold: 50000,
      appliedPromo: "",
    };
  },
  computed: {
    ...mapStores(useCartStore, useProductStore),
    items() {
      return this.cartStore.items;
    },
    subtotal(): number {
      return this.items.reduce(
        (s: number, it: any) => s + it.price * it.qty,
        0
      );
    },
    discount(): number {
      const promoCfg = (appConfig as any)?.config?.promotion ?? {};
      const cfgCode = String(promoCfg.discount_code || "").toUpperCase();
      const cfgAmount = Number(promoCfg.discount_amount || 0);

      const applied = (this.appliedPromo || "").trim().toUpperCase();
      return applied === cfgCode ? cfgAmount : 0;
    },
    shipping(): number {
      return this.subtotal - this.discount >= this.freeShippingThreshold
        ? 0
        : 0;
    },
    total(): number {
      return Math.max(0, this.subtotal - this.discount + this.shipping);
    },
    recommended(): ProductItem[] {
      const inCart = new Set(this.items.map((i: any) => i.sku));
      const all = (this.productStore?.items ?? []) as ProductItem[];
      return all.filter((p) => !inCart.has(p.sku)).slice(0, 12);
    },
  },
  methods: {
    fmt(n: number) {
      return n.toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    inc(it: any) {
      this.cartStore.updateQty(it.sku, it.qty + 1);
    },
    dec(it: any) {
      this.cartStore.updateQty(it.sku, Math.max(1, it.qty - 1));
    },
    qtyChanged(it: any) {
      this.cartStore.updateQty(
        it.sku,
        Math.max(1, Math.min(999, Number(it.qty) || 1))
      );
    },
    remove(it: any) {
      this.cartStore.remove(it.sku);
    },
    applyPromo() {
      this.appliedPromo = (this.promo || "").trim();
    },
    checkout() {
      this.$router.push({
        path: "/checkout",
        query: { code: this.appliedPromo },
      });
    },
    addRecommended(p: ProductItem) {
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
    scrollRec(dir: number) {
      const el = this.$refs.recWrap as HTMLElement | undefined;
      if (el) el.scrollBy({ left: dir * 360, behavior: "smooth" });
    },
  },
});
</script>

<style>
.cart-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
}
.cart-scroll::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.cart-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}
</style>
