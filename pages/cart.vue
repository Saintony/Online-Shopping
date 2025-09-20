<template>
  <div class="container mx-auto p-4 space-y-6">
    <h1 class="text-2xl font-bold">ตะกร้าสินค้า</h1>

    <div v-if="!items.length" class="text-center text-gray-500 py-20">
      ยังไม่มีสินค้าในตะกร้า
      <div class="mt-3">
        <NuxtLink to="/" class="btn-ghost">เลือกซื้อสินค้า</NuxtLink>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- รายการ -->
      <div class="lg:col-span-8 space-y-3">
        <div v-for="it in items" :key="it.sku" class="card p-3 flex gap-3">
          <img
            :src="it.image"
            :alt="it.name"
            class="w-20 h-20 object-cover rounded"
          />
          <div class="flex-1">
            <div class="font-semibold">{{ it.name }}</div>
            <div class="text-xs text-gray-500">SKU: {{ it.sku }}</div>
            <div class="mt-1 text-brand-primary font-semibold">
              ฿ {{ it.price.toFixed(2) }}
            </div>

            <div class="mt-2 flex items-center gap-2">
              <button class="btn-ghost" @click="dec(it)">−</button>
              <input
                type="number"
                min="1"
                max="999"
                v-model.number="it.qty"
                @change="qtyChanged(it)"
                class="w-16 border rounded px-2 py-1"
              />
              <button class="btn-ghost" @click="inc(it)">＋</button>

              <span class="ml-auto text-sm"
                >รวม: ฿ {{ (it.qty * it.price).toFixed(2) }}</span
              >
              <button class="btn-ghost text-red-600" @click="remove(it)">
                ลบ
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- สรุป -->
      <aside class="lg:col-span-4">
        <div class="card p-4 space-y-3">
          <div class="text-lg font-semibold">สรุปคำสั่งซื้อ</div>

          <div class="flex justify-between text-sm">
            <span>ยอดรวม</span>
            <span>฿ {{ subtotal.toFixed(2) }}</span>
          </div>

          <div class="flex justify-between text-sm" v-if="discount > 0">
            <span>ส่วนลด</span>
            <span class="text-green-600">− ฿ {{ discount.toFixed(2) }}</span>
          </div>

          <div class="flex justify-between text-sm">
            <span>ค่าจัดส่ง</span>
            <span>{{
              shipping === 0 ? "ฟรี" : `฿ ${shipping.toFixed(2)}`
            }}</span>
          </div>

          <div class="border-t pt-2 flex justify-between font-semibold">
            <span>ยอดชำระ</span>
            <span>฿ {{ total.toFixed(2) }}</span>
          </div>

          <div
            class="bg-amber-50 border border-amber-200 rounded p-2 text-xs"
            v-if="subtotal < freeShippingThreshold"
          >
            ซื้อเพิ่มอีก ฿
            {{ (freeShippingThreshold - subtotal).toFixed(2) }} เพื่อรับสิทธิ์
            **ส่งฟรี**
          </div>
          <div
            class="bg-green-50 border border-green-200 rounded p-2 text-xs"
            v-else
          >
            ยอดถึงเกณฑ์ส่งฟรีแล้ว 🎉
          </div>

          <div class="flex gap-2">
            <input
              v-model="promo"
              placeholder="กรอกโค้ดส่วนลด (YIMPLATFORM)"
              class="flex-1 border rounded px-3 py-2"
            />
            <button class="btn-ghost" @click="applyPromo">ใช้โค้ด</button>
          </div>

          <button class="btn-primary w-full">ชำระเงิน</button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useCartStore } from "../stores/cart";

export default defineComponent({
  name: "CartPage",
  data() {
    return {
      promo: "",
      freeShippingThreshold: 50000,
    };
  },
  computed: {
    ...mapStores(useCartStore),
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
      // โค้ดตัวอย่าง: YIMPLATFORM → ลด 10%
      return this.promo.trim().toUpperCase() === "YIMPLATFORM"
        ? this.subtotal * 0.1
        : 0;
    },
    shipping(): number {
      return this.subtotal - this.discount >= this.freeShippingThreshold
        ? 0
        : 0;
    },
    total(): number {
      return Math.max(0, this.subtotal - this.discount + this.shipping);
    },
  },
  methods: {
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
      /* คงค่าใน this.promo ก็เพียงพอแล้ว */
    },
  },
});
</script>

<style scoped></style>
