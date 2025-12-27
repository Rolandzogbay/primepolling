<template>
  <div class="space-y-6 sm:space-y-8">
    <div
      class="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden"
    >
      <div
        v-if="isFull"
        class="absolute top-0 left-0 w-full h-1 bg-emerald-500"
      ></div>

      <h3 class="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
        <span>{{ isFull ? "🏁" : "🏆" }}</span>
        {{ isFull ? "Final Results" : "Live Standings" }}
      </h3>

      <div class="space-y-6 sm:space-y-8">
        <div
          v-for="(candidate, index) in sortedCandidates"
          :key="candidate.id"
          class="relative group"
        >
          <div class="flex flex-col sm:flex-row justify-between gap-2 sm:mb-3 items-start sm:items-center">
            <div class="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              <div class="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full overflow-hidden">
                <img
                  v-if="candidate.image"
                  :src="candidate.image"
                  :alt="candidate.name"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs sm:text-sm"
                >
                  {{ getInitials(candidate.name) }}
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <span class="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                    {{ candidate.name }}
                  </span>
                  <span
                    v-if="index === 0 && candidate.votes > 0"
                    class="text-amber-400 text-xs sm:text-sm animate-bounce shrink-0"
                    title="Leading"
                  >
                    👑
                  </span>
                </div>
                <p
                  v-if="candidate.manifesto"
                  class="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 line-clamp-2"
                >
                  {{ candidate.manifesto }}
                </p>
              </div>
            </div>

            <div class="text-right shrink-0">
              <div class="text-xs sm:text-sm font-mono text-emerald-400 font-bold">
                {{ candidate.votes }}
              </div>
              <div class="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">
                {{ getPercentage(candidate.votes) }}%
              </div>
            </div>
          </div>

          <div
            class="w-full h-3 sm:h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50"
          >
            <div
              class="h-full transition-all duration-1000 ease-out relative"
              :class="
                index === 0
                  ? 'bg-linear-to-r from-emerald-600 to-emerald-400'
                  : 'bg-slate-600'
              "
              :style="{ width: getPercentage(candidate.votes) + '%' }"
              :title="
                candidate.votes +
                ' votes (' +
                getPercentage(candidate.votes) +
                '%'
              "
            >
              <div
                v-if="index === 0"
                class="absolute inset-0 bg-white/10 animate-pulse"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  candidates: {
    type: Array,
    required: true,
  },
  isFull: {
    type: Boolean,
    default: false,
  },
});

const sortedCandidates = computed(() => {
  if (!props.candidates) return [];
  return [...props.candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0));
});

const getTotalVotes = computed(() => {
  if (!props.candidates) return 0;
  return props.candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
});

const getPercentage = (votes) => {
  const total = getTotalVotes.value;
  if (total === 0) return 0;
  return Math.round(((votes || 0) / total) * 100);
};

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
.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
</style>
