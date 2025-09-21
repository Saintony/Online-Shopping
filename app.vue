<template>
  <div class="flex flex-col min-h-screen text-gray-900 bg-brand-muted">
    <!-- ==== Header ==== -->
    <header class="text-white bg-brand-primary">
      <div class="container flex items-center gap-4 px-4 mx-auto h-14">
        <NuxtLink to="/" class="inline-flex items-center">
          <div class="inline-flex items-center rounded-xl px-3 py-1.5">
            <img
              src="/images/yim-platform-logo.png"
              alt="YIM-Platform"
              class="object-contain w-auto h-24"
            />
          </div>
        </NuxtLink>
        <div class="flex-1">
          <div class="relative hidden">
            <i
              class="absolute text-sm -translate-y-1/2 pi pi-search left-3 top-1/2 text-white/80"
            ></i>
            <input
              placeholder="ค้นหาสินค้า"
              class="w-full py-2 pr-4 text-white rounded-full outline-none pl-9 bg-white/20 placeholder-white/70 focus:bg-white focus:text-gray-900"
            />
          </div>
        </div>
        <NuxtLink
          to="/cart"
          class="text-white btn-ghost bg-white/10 hover:bg-white/20"
        >
          <i class="mr-2 pi pi-shopping-cart"></i>Cart
          <span
            v-if="cart.itemsCount"
            class="ml-2 bg-white badge text-brand-primary"
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
    <Toast group="app" position="top-right" />
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
