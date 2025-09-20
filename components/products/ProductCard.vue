<template>
  <div class="card relative overflow-hidden h-full flex flex-col">
    <!-- แถบส่วนลด -->
    <div v-if="discountPercent > 0" class="absolute left-2 top-2">
      <span class="badge-danger">-{{ discountPercent }}%</span>
    </div>

    <img
      :src="product.image_url?.[0]"
      :alt="product.name"
      class="w-full aspect-[4/3] object-cover"
    />

    <div class="p-3 flex-1 flex flex-col">
      <p class="text-[11px] text-gray-400">SKU: {{ product.sku }}</p>
      <h3 class="text-sm font-semibold line-clamp-2 min-h-[2.5rem]">
        {{ product.name }}
      </h3>

      <div class="mt-1">
        <span class="price-now">฿ {{ product.price.toFixed(2) }}</span>
        <span v-if="product.original_price" class="price-old">
          ฿ {{ product.original_price!.toFixed(2) }}
        </span>
      </div>

      <div class="mt-3 flex justify-between items-center">
        <NuxtLink :to="`/product/${product.sku}`" class="btn-ghost">
          <i class="pi pi-info-circle mr-1"></i>รายละเอียด
        </NuxtLink>
        <button class="btn-primary" @click="$emit('add', product)">
          + Add to cart
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import type { ProductItem } from "../../types/product"; // ปรับ path ให้ตรงกับโปรเจกต์คุณ

export default defineComponent({
  name: "ProductCard",
  props: {
    product: { type: Object as () => ProductItem, required: true },
  },
  emits: { add: (p: ProductItem) => !!p },
  setup(props) {
    // ถ้ามี product.discount ใช้ค่านั้น
    // ถ้าไม่มี แต่มี original_price > price → คำนวณเปอร์เซ็นต์ลด
    const discountPercent = computed(() => {
      if (props.product.discount != null)
        return Math.round(props.product.discount);
      const op = props.product.original_price;
      const p = props.product.price;
      return op && op > p ? Math.round((1 - p / op) * 100) : 0;
    });
    return { discountPercent };
  },
});
</script>

<style scoped></style>
