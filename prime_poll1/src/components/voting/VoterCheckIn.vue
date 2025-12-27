<template>
  <div class="flex justify-center py-12 sm:py-16">
    <div class="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl w-full max-w-md text-center shadow-2xl">
      <div
        class="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20"
      >
        <svg
          class="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Voter Verification</h2>
      <p class="text-slate-500 text-sm mb-6">
        Please enter your authorized ID to access the ballot.
      </p>

      <input
        v-model="voterIdInput"
        @keyup.enter="$emit('verify', voterIdInput)"
        type="text"
        placeholder="Enter Voter ID"
        class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white mb-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
      />
      <button
        @click="$emit('verify', voterIdInput)"
        class="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all active:scale-95"
      >
        Verify ID
      </button>
      <p
        v-if="error"
        class="text-red-400 text-xs mt-4 flex items-center justify-center gap-1"
      >
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          />
        </svg>
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  error: {
    type: String,
    default: "",
  },
});

defineEmits(["verify"]);

const voterIdInput = ref("");
</script>

<style scoped>
/* Smooth input focus transition */
input:focus {
  border-color: #10b981;
}
</style>
