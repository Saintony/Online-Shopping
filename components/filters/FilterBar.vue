<template>
  <div class="space-y-4">
    <!-- Keyword -->
    <div>
      <label class="block text-sm font-medium mb-1">Keyword</label>
      <input
        v-model="state.q"
        type="text"
        placeholder="Search by product name..."
        class="w-full px-3 py-2 border rounded"
      />
    </div>

    <!-- Brand -->
    <div>
      <label class="block text-sm font-medium mb-1">Brand</label>
      <div class="relative">
        <select
          v-model="state.brand"
          class="w-full px-3 py-2 border rounded appearance-none"
        >
          <option :value="null">All</option>
          <option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
        </select>
        <i
          class="pi pi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-sm"
        ></i>
      </div>
    </div>

    <!-- Price -->
    <div>
      <label class="block text-sm font-medium mb-1">Price</label>
      <div class="grid grid-cols-2 gap-2">
        <input
          v-model.number="state.min"
          type="number"
          placeholder="Min"
          class="w-full px-3 py-2 border rounded"
        />
        <input
          v-model.number="state.max"
          type="number"
          placeholder="Max"
          class="w-full px-3 py-2 border rounded"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";

type FilterState = {
  q: string;
  brand: string | null;
  min: number | null;
  max: number | null;
};

export default defineComponent({
  name: "FilterBar",
  props: {
    modelValue: { type: Object as () => FilterState, required: true },
    brands: { type: Array as () => string[], default: () => [] },
  },
  emits: { "update:modelValue": (v: FilterState) => true },
  setup(props, { emit }) {
    const state = reactive<FilterState>({ ...props.modelValue });

    watch(
      () => props.modelValue,
      (v) => Object.assign(state, v),
      { deep: true }
    );
    watch(state, (v) => emit("update:modelValue", { ...v }), { deep: true });

    return { state, brands: props.brands };
  },
});
</script>

<style scoped></style>
