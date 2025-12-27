<template>
  <div class="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="mb-6 sm:mb-8 md:mb-10">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white">{{ poll.title }}</h1>
      <p class="text-slate-500 mt-2 text-sm md:text-base">
        Select one candidate from the list below. This action cannot be undone.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
      <label
        v-for="candidate in poll.candidates"
        :key="candidate.id"
        class="relative flex flex-col p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border-2 cursor-pointer transition-all"
        :class="
          modelValue === candidate.id
            ? 'border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-900/20'
            : 'border-slate-800 bg-slate-900 hover:border-slate-700'
        "
      >
        <input
          type="radio"
          :value="candidate.id"
          :checked="modelValue === candidate.id"
          @change="$emit('update:modelValue', candidate.id)"
          class="hidden"
        />

        <div class="flex gap-3 sm:gap-4">
          <div
            class="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-lg sm:text-xl shadow-inner"
          >
            <img
              v-if="candidate.image"
              :src="candidate.image"
              :alt="candidate.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="text-white font-bold text-sm sm:text-base">
              {{ getInitials(candidate.name) }}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-base sm:text-lg md:text-xl font-bold text-white truncate">{{ candidate.name }}</h3>
            <p class="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">
              {{ candidate.manifesto }}
            </p>
          </div>

          <div
            class="w-5 h-5 sm:w-6 sm:h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all"
            :class="
              modelValue === candidate.id
                ? 'border-emerald-500 bg-emerald-500'
                : 'border-slate-700'
            "
          >
            <div
              v-if="modelValue === candidate.id"
              class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"
            ></div>
          </div>
        </div>
      </label>
    </div>

    <div
      class="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-6 md:p-8 bg-slate-900/50 border border-slate-800 rounded-2xl sm:rounded-3xl text-center"
    >
      <button
        @click="$emit('submit')"
        :disabled="!modelValue"
        class="px-8 sm:px-12 md:px-20 py-3 sm:py-4 rounded-lg sm:rounded-2xl font-black text-base sm:text-xl transition-all shadow-xl"
        :class="
          modelValue
            ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/20 active:scale-95'
            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
        "
      >
        SUBMIT FINAL VOTE
      </button>
      <p
        class="mt-3 sm:mt-4 text-[8px] sm:text-xs text-slate-600 uppercase tracking-widest font-bold"
      >
        Secure Encrypted Transmission
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  poll: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: String,
    default: null,
  },
});

defineEmits(["update:modelValue", "submit"]);

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};
</script>

<style scoped>
.animate-in {
  animation: slideIn 0.4s ease-out forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
