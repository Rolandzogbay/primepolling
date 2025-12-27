<template>
  <div class="space-y-10">
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-12 w-full">
      <div
        v-for="poll in displayedPolls"
        :key="poll.id"
        class="space-y-6 p-4 rounded-3xl transition-all border border-transparent hover:border-slate-800/50"
      >
        <div
          class="flex justify-between items-end border-b border-slate-800/40 pb-4"
        >
          <div>
            <h4 class="text-white font-black text-lg tracking-tight">
              {{ poll.title }}
            </h4>
            <p
              class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1"
            >
              <span v-if="isLive(poll)" class="text-emerald-500"
                >● Live Now</span
              >
              <span v-else class="text-amber-500"
                >○ Starts {{ startIn(poll) }}</span
              >
            </p>
          </div>
          <div class="text-right">
            <span class="text-white font-mono text-sm font-bold">{{
              getTotalVotes(poll)
            }}</span>
            <p class="text-[10px] font-black text-slate-600 uppercase">
              Votes Cast
            </p>
          </div>
        </div>

        <div class="space-y-5">
          <div
            v-for="(candidate, index) in sortCandidates(poll)"
            :key="candidate.id"
            class="space-y-2"
          >
            <div
              class="flex justify-between items-center text-[11px] font-black uppercase tracking-wider"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-6 h-6 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-xs font-bold text-white"
                >
                  <img
                    v-if="candidate.image"
                    :src="candidate.image"
                    :alt="candidate.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="">{{ getInitials(candidate.name) }}</div>
                </div>
                <span
                  :class="index === 0 ? 'text-emerald-400' : 'text-slate-400'"
                  >{{ candidate.name }}</span
                >
              </div>
              <span class="text-white"
                >{{ calculatePercent(candidate.votes, poll) }}%</span
              >
            </div>

            <div
              class="h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800/50"
            >
              <div
                class="h-full transition-all duration-1000 ease-out relative"
                :class="
                  index === 0
                    ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-700'
                "
                :style="{
                  width: calculatePercent(candidate.votes, poll) + '%',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeWorkspace.length > 4" class="flex justify-center pt-6">
      <button
        @click="showAll = !showAll"
        class="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-slate-700 active:scale-95"
      >
        <span>{{ showAll ? "Show Less" : "See All Active Polls" }}</span>
        <svg
          class="w-4 h-4 transition-transform duration-300"
          :class="{ 'rotate-180': showAll }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { usePollStore } from "@/stores/pollstore";

const store = usePollStore();
const showAll = ref(false);

// Exclude polls that are full (all voters have voted)
const isPollDone = (poll) => {
  const total = poll.voters?.length || 0;
  const voted = poll.voters?.filter((v) => v.hasVoted).length || 0;
  return total > 0 && voted >= total;
};

// 1. ACTIVE WORKSPACE: ongoing + upcoming, excluding full polls
const activeWorkspace = computed(() =>
  store.activeWorkspace.filter((p) => !isPollDone(p))
);

// 2. AUTO-UPDATE LOGIC: Reactively track activeWorkspace
const displayedPolls = computed(() => {
  const polls = activeWorkspace.value;
  // If showAll is false, only show the first 4. Otherwise show everything.
  return showAll.value ? polls : polls.slice(0, 4);
});

// 2. CANDIDATE SORTING
const sortCandidates = (poll) => {
  if (!poll.candidates) return [];
  return [...poll.candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0));
};

// 3. VOTE CALCULATIONS
const getTotalVotes = (poll) => {
  if (!poll.candidates) return 0;
  return poll.candidates.reduce((sum, c) => sum + (Number(c.votes) || 0), 0);
};

const calculatePercent = (votes, poll) => {
  const total = getTotalVotes(poll);
  if (total === 0) return 0;
  return Math.round(((Number(votes) || 0) / total) * 100);
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

// 4. STATUS CHECK
const isLive = (poll) => {
  const now = new Date();
  return new Date(poll.startAt) <= now && new Date(poll.endAt) >= now;
};

const startIn = (poll) => {
  const now = new Date();
  const start = new Date(poll.startAt);
  if (start <= now) return "soon";
  const diff = start - now;
  const mins = Math.round(diff / (1000 * 60));
  if (mins < 60) return `${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.round(hrs / 24);
  return `${days}d`;
};
</script>

<style scoped>
/* Optional: Smooth entry for new polls */
.grid > div {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
