<template>
  <div class="min-h-screen flex flex-col bg-brand-muted text-gray-900">
    <!-- ==== Header ==== -->
    <header class="bg-brand-primary text-white">
      <div class="container mx-auto px-4 h-14 flex items-center gap-4">
        <NuxtLink to="/" class="font-bold tracking-wide">Y-Shop</NuxtLink>
        <div class="flex-1">
          <div class="relative hidden">
            <i
              class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-white/80 text-sm"
            ></i>
            <input
              placeholder="ค้นหาสินค้า"
              class="w-full pl-9 pr-4 py-2 rounded-full bg-white/20 placeholder-white/70 focus:bg-white text-white focus:text-gray-900 outline-none"
            />
          </div>
        </div>
        <NuxtLink
          to="/cart"
          class="btn-ghost bg-white/10 text-white hover:bg-white/20"
        >
          <i class="pi pi-shopping-cart mr-2"></i>Cart
          <span
            v-if="cart.itemsCount"
            class="ml-2 badge bg-white text-brand-primary"
            >{{ cart.itemsCount }}</span
          >
        </NuxtLink>
      </div>
    </header>

    <!-- ==== Main content ==== -->
    <main class="flex-1">
      <NuxtPage />
    </main>

    <!-- ==== Global footer ==== -->
    <SiteFooter />

    <!-- ==== Global toast ==== -->
    <Toast />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Toast from "primevue/toast";
import { useCartStore } from "./stores/cart";
import SiteFooter from "./components/layout/SiteFooter.vue";

export default defineComponent({
  name: "AppRoot",
  components: { Toast, SiteFooter },
  setup() {
    const cart = useCartStore();
    return { cart };
  },
});
</script>
