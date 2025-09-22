<template>
  <div class="space-y-4">
    <!-- Keyword -->
    <div>
      <input
        v-model="state.q"
        type="text"
        placeholder="Search by product name..."
        class="w-full px-3 py-2 border rounded"
      />
    </div>

    <div>
      <label class="block mb-1 text-sm font-medium">Brand</label>
      <Dropdown
        v-model="state.brand"
        :options="brandsOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Select a Brand"
        :showClear="true"
        class="w-full md:w-65"
      />
    </div>

    <!-- Price -->
    <div>
      <label class="block mb-1 text-sm font-medium">Price</label>
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
import { defineComponent, reactive, watch, toRef, computed } from "vue";
import Dropdown from "primevue/dropdown";

type FilterState = {
  q: string;
  brand: string | null;
  min: number | null;
  max: number | null;
};

export default defineComponent({
  name: "FilterBar",
  components: { Dropdown },
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

    const brands = toRef(props, "brands");

    const brandsOptions = computed(() => [
      { label: "All", value: null },
      ...brands.value.map((b) => ({ label: b, value: b })),
    ]);

    return { state, brands, brandsOptions };
  },
});
</script>

<style scoped>
:deep(.p-dropdown) {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

:deep(.p-dropdown .p-inputtext) {
  padding: 0.5rem 0.75rem;
}

:deep(.p-dropdown .p-dropdown-trigger) {
  padding: 0 0.5rem;
}

:deep(.p-dropdown.p-focus) {
  border-color: #6366f1;
  box-shadow: 0 0 0 1px #6366f1;
}
</style>
