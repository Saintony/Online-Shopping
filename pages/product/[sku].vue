<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Back -->
    <button
      class="mb-4 flex items-center gap-2 text-sm hover:underline"
      @click="$router.back()"
    >
      <i class="pi pi-angle-left"></i> Back
    </button>

    <!-- Layout -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-10">
      <!-- LEFT: Gallery -->
      <section class="md:col-span-5">
        <div
          class="panel overflow-hidden aspect-square flex items-center justify-center"
        >
          <img
            v-if="product?.image_url?.[activeIdx]"
            :src="product.image_url[activeIdx]"
            :alt="product?.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="text-xs text-gray-400">
            selected img (default img1)
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 mt-4">
          <button
            v-for="(img, i) in thumbs"
            :key="i"
            @click="activeIdx = i"
            class="panel aspect-square overflow-hidden relative p-0"
            :class="i === activeIdx ? 'ring-2 ring-brand-primary' : ''"
          >
            <img
              v-if="img"
              :src="img"
              :alt="`img ${i + 1}`"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-xs text-gray-400"
            >
              img {{ i + 1 }}
            </div>
          </button>
        </div>
      </section>

      <!-- RIGHT: Info -->
      <section class="md:col-span-7">
        <!-- ชื่อ + ราคา + ปุ่ม -->
        <div class="flex items-start gap-4">
          <div class="flex-1">
            <h1 class="text-3xl font-extrabold leading-tight">
              {{ product?.name }}
            </h1>
            <div class="mt-2 flex items-baseline gap-2">
              <div class="text-2xl font-semibold text-brand-primary">
                ฿ {{ product?.price.toFixed(2) }}
              </div>
              <div class="text-gray-500">/ EA</div>
            </div>
          </div>
        </div>

        <!-- รายละเอียด -->
        <div class="flex items-start gap-4">
          <div class="flex-1">
            <h2 class="mt-8 text-lg font-semibold">Product Detail</h2>
          </div>

          <button
            class="btn-primary whitespace-nowrap mt-4"
            @click="onAdd(product!)"
          >
            + Add to cart
          </button>
        </div>

        <dl class="mt-2 grid grid-cols-4 gap-x-4 gap-y-2 text-sm">
          <dt class="col-span-1 text-gray-500">SKU :</dt>
          <dd class="col-span-3">{{ product?.sku }}</dd>

          <dt class="col-span-1 text-gray-500">Brand :</dt>
          <dd class="col-span-3">{{ product?.brand || "-" }}</dd>

          <dt class="col-span-1 text-gray-500">Pack Size :</dt>
          <dd class="col-span-3">{{ product?.pack_size || "—" }}</dd>
        </dl>

        <p class="mt-4 text-sm leading-6 text-gray-600">
          {{ description }}
        </p>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useProductStore } from "../../stores/product";
import { useCartStore } from "../../stores/cart";
import { useToast } from "primevue/usetoast";
import type { ProductItem } from "../../types/product";

export default defineComponent({
  name: "ProductDetail",
  data() {
    return { activeIdx: 0 };
  },
  computed: {
    ...mapStores(useProductStore, useCartStore),

    product(): ProductItem | undefined {
      const sku = Number(this.$route.params.sku);
      const items = (this.productStore?.items ?? []) as ProductItem[];
      return items.find((p) => p.sku === sku);
    },

    thumbs(): string[] {
      return (this.product?.image_url ?? []).slice(0, 3);
    },

    description(): string {
      const desc = (this.product as any)?.description;
      if (typeof desc === "string" && desc.trim()) return desc;
      return `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
when an unknown printer took a galley of type and scrambled it to make a type specimen book.`;
    },
  },
  methods: {
    onAdd(p?: ProductItem) {
      if (!p) return;
      this.cartStore.add({
        sku: p.sku,
        name: p.name,
        price: p.price,
        image: p.image_url?.[0],
      });
      const toast = useToast();
      toast.add({
        severity: "success",
        summary: "เพิ่มลงตะกร้าแล้ว",
        detail: p.name,
        life: 1200,
      });
    },
  },
});
</script>

<style scoped></style>
