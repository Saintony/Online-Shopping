<template>
  <footer class="border-t bg-white">
    <div class="border-t bg-brand-darkGray">
      <div
        class="container mx-auto px-4 py-4 text-xs text-gray-500 flex flex-col md:flex-row gap-2 md:gap-4 md:items-center md:justify-between"
      >
        <div>© 2025 YIM Platform. All Rights Reserved</div>
        <!-- <div class="flex gap-4">
          <a href="#" class="hover:underline">Privacy</a>
          <a href="#" class="hover:underline">Terms</a>
          <a href="#" class="hover:underline">Cookies</a>
        </div> -->
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({ name: "SiteFooter" });
</script>
