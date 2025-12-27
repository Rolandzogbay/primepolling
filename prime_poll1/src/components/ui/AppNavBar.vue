<template>
  <header
    class="h-16 sm:h-18 md:h-20 bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-800/50 px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30"
  >
    <div class="flex items-center min-w-0">
      <!-- Mobile hamburger (visible on small screens) -->
      <button
        @click="$emit('toggle-sidebar')"
        class="mr-2 sm:mr-3 md:mr-4 md:hidden p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200"
        aria-label="Open sidebar"
      >
        <svg
          class="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div class="flex flex-col min-w-0">
        <h2
          class="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-emerald-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] truncate"
        >
          {{ $route.name || "Overview" }}
        </h2>
        <p class="text-[9px] sm:text-[10px] md:text-[12px] lg:text-[14px] text-slate-500 font-medium">
          PrimePoll Voting System
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
      <div class="hidden sm:hidden md:flex flex-col text-right">
        <span class="text-lg sm:text-xl font-mono font-bold text-slate-50 leading-none">{{
          currentTime
        }}</span>
        <span class="text-[11px] text-slate-500 uppercase tracking-widest mt-1"
          >Live Server Time</span
        >
      </div>

      <router-link to="/create" class="relative group">
        <div
          class="absolute -inset-0.5 bg-emerald-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-300"
        ></div>
        <button
          class="relative bg-slate-900 border border-slate-700 text-white px-2 sm:px-3 md:px-5 py-2 rounded-lg text-xs sm:text-sm md:text-base font-bold hover:border-emerald-500 transition-all flex items-center gap-1 sm:gap-2"
        >
          <i class="fa-solid fa-plus"></i>
          <span class="hidden sm:block">Create Poll</span>
        </button>
      </router-link>
    </div>
  </header>
</template>
<script setup>
import { ref, onMounted } from "vue";

// Declare the emitted events for clarity
const emit = defineEmits(["toggle-sidebar"]);

const currentTime = ref(new Date().toLocaleTimeString());

onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString();
  }, 1000);
});
</script>
