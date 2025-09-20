<template>
  <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    <ProductCard
      v-for="p in items"
      :key="p.sku"
      :product="p"
      @add="$emit('add', $event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProductCard from "./ProductCard.vue";
import type { ProductItem } from "../../types/product";

export default defineComponent({
  name: "ProductGrid",
  components: { ProductCard },
  props: {
    items: { type: Array as () => ProductItem[], required: true },
  },
  emits: { add: (p: ProductItem) => !!p },
});
</script>

<style scoped></style>
