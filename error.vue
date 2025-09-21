<template>
  <div
    class="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-3"
  >
    <h1 class="text-3xl font-bold">เกิดข้อผิดพลาด</h1>
    <p class="text-gray-500">{{ error?.message || "หน้าไม่พบ (404)" }}</p>
    <NuxtLink to="/" class="btn-ghost">กลับหน้าแรก</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{ error?: any }>();
</script>
