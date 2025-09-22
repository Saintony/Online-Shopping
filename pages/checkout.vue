<template>
  <div class="container px-4 py-6 mx-auto space-y-6">
    <!-- SEO -->
    <Head>
      <Title>Checkout | YIM-Platform</Title>
      <Meta name="robots" content="noindex" />
    </Head>

    <h1 class="text-2xl font-bold">Checkout</h1>

    <div v-if="!items.length" class="py-16 text-center text-gray-500">
      No Item In Cart
      <div class="mt-3">
        <NuxtLink to="/" class="btn-ghost">เลือกซื้อสินค้า</NuxtLink>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Order summary list -->
      <section class="lg:col-span-5">
        <div class="card p-4 lg:h-[calc(100vh-8rem)] flex flex-col">
          <div class="text-sm text-gray-600">Order ID {{ orderId }}</div>

          <div class="flex-1 pr-1 mt-3 space-y-3 overflow-y-auto cart-scroll">
            <div
              v-for="it in items"
              :key="it.sku"
              class="flex items-center gap-3 px-3 py-2 border rounded"
            >
              <img
                :src="it.image"
                :alt="it.name"
                class="object-cover w-12 h-12 rounded"
              />
              <div class="flex-1 min-w-0">
                <div class="text-xs text-gray-500">SKU: {{ it.sku }}</div>
                <div class="text-sm truncate">{{ it.name }}</div>
                <div class="text-xs text-gray-500">x{{ it.qty }}</div>
              </div>
              <div class="text-sm">฿ {{ fmt(it.qty * it.price) }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Payment information -->
      <aside class="lg:col-span-7">
        <div class="card p-4 lg:h-[calc(100vh-8rem)] flex flex-col">
          <h2 class="text-lg font-semibold">Payment Information</h2>

          <div class="mt-3 space-y-1 text-sm">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>฿ {{ fmt(subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Discount</span>
              <span class="text-brand-primary">-฿ {{ fmt(discount) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Delivery Fee</span>
              <span>฿ {{ fmt(deliveryFee) }}</span>
            </div>
            <div class="flex justify-between pt-2 font-semibold border-t">
              <span>Total</span>
              <span>฿ {{ fmt(total) }}</span>
            </div>
          </div>

          <!-- QR (placeholder) -->
          <!-- <div class="flex items-center justify-center flex-1 mt-6">
            <div
              class="w-56 h-56 border rounded grid place-items-center text-xs text-gray-500 bg-[repeating-linear-gradient(45deg,#eee,#eee_10px,#fff_10px,#fff_20px)]"
            >
              QR Code / PromptPay
            </div>
          </div> -->

          <div class="flex items-center justify-center flex-1 mt-6">
            <img
              v-if="qrSrc"
              :src="qrSrc"
              alt="Payment QR"
              class="w-56 h-56 border rounded"
            />
            <div v-else class="text-xs text-gray-500">
              Create QR Fail
              <div>
                <a
                  :href="paymentUrl"
                  target="_blank"
                  class="text-blue-600 underline"
                >
                  Open Link Payment
                </a>
              </div>
            </div>
          </div>
          <div class="px-8">
            <NuxtLink to="/" class="w-full h-12 mt-6 btn-primary"
              >Back to Home Page</NuxtLink
            >
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useCartStore } from "../stores/cart";
import appConfig from "../data/config.json";
import QRCode from "qrcode";

export default defineComponent({
  name: "CheckoutWireframe",
  data() {
    return {
      appliedPromo: String((this.$route.query.code || "") as string),
      qrSrc: "",
    };
  },
  computed: {
    ...mapStores(useCartStore),
    items() {
      return this.cartStore.items;
    },
    orderId(): string {
      const q = (this.$route.query.id || "") as string;
      if (q) return q;
      return (
        new Date().toISOString().slice(0, 10).replace(/-/g, "") +
        Math.random().toString(10).slice(2, 8)
      );
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
    deliveryFee(): number {
      const feeCfg = (appConfig as any)?.config?.delivery_fee ?? {};
      const base = Number(feeCfg.delivery_fee_amount || 0);
      const freeMin = Number(feeCfg.minimum_cart_amount || 0);
      const afterDiscount = Math.max(0, this.subtotal - this.discount);
      return afterDiscount >= freeMin ? 0 : base;
    },
    total(): number {
      return Math.max(0, this.subtotal - this.discount + this.deliveryFee);
    },
    paymentUrl(): string {
      return `https://payment-api.yimplatform.com/orders/${this.orderId}/checkout?price=${this.total.toFixed(2)}`;
    },
  },
  mounted() {
    this.generateQR();
  },
  watch: {
    paymentUrl() {
      this.generateQR();
    },
  },
  methods: {
    fmt(val: number) {
      return Number(val).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    async generateQR() {
      try {
        this.qrSrc = await QRCode.toDataURL(this.paymentUrl, {
          width: 256,
          margin: 1,
          errorCorrectionLevel: "M",
        });
      } catch (e) {
        console.error("QR gen error:", e);
        this.qrSrc = ""; // fallback
      }
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
