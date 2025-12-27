<template>
  <div class="p-2 sm:p-3 md:p-4 lg:p-6 max-w-7xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
    <header
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-slate-800/50"
    >
      <div>
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-none">
          System <span class="text-emerald-500">Overview</span>
        </h1>
        <p
          class="text-slate-500 mt-2 sm:mt-3 font-medium flex items-center gap-2 text-[9px] sm:text-[10px] md:text-sm lg:text-base"
        >
          <span
            class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0"
          ></span>
          <span class="truncate">{{ activeAndNotFull.length }} Active/Upcoming Election Streams Detected</span>
        </p>
      </div>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div
        v-for="stat in systemStats"
        :key="stat.label"
        class="bg-slate-900 border border-slate-800 p-3 sm:p-4 md:p-5 rounded-lg"
      >
        <p
          class="text-[9px] sm:text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest"
        >
          {{ stat.label }}
        </p>
        <div class="flex items-end justify-between mt-2 sm:mt-3">
          <h4 class="text-xl sm:text-2xl font-black text-white">{{ stat.value }}</h4>
          <span
            :class="stat.color"
            class="text-[8px] sm:text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10"
          >
            {{ stat.sub }}
          </span>
        </div>
      </div>
    </div>

    <section class="space-y-4 sm:space-y-6">
      <h2
        class="text-lg sm:text-xl font-black text-white uppercase tracking-wide flex items-center gap-2 sm:gap-3"
      >
        Live Participation
        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-ping shrink-0"></span>
      </h2>
      <div
        class="bg-slate-900 border border-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl overflow-hidden"
      >
        <PollList v-if="activeAndNotFull.length > 0" />
        <div
          v-else
          class="text-center py-4 sm:py-6 md:py-8 text-slate-600 font-bold uppercase tracking-widest text-[9px] sm:text-xs"
        >
          No live participation streams found.
        </div>
      </div>
    </section>

    <section class="space-y-4 sm:space-y-6 md:space-y-8">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
      >
        <h2 class="text-lg sm:text-xl font-black text-white uppercase tracking-wide">
          {{
            currentFilter === "ongoing" ? "Active Workspace" : "Poll Archives"
          }}
        </h2>
        <div
          class="flex bg-slate-900 border border-slate-800 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl"
        >
          <button
            @click="currentFilter = 'ongoing'"
            :class="filterBtn(currentFilter === 'ongoing')"
          >
            Active
          </button>
          <button
            @click="currentFilter = 'ended'"
            :class="filterBtn(currentFilter === 'ended')"
          >
            History
          </button>
        </div>
      </div>

      <div
        v-if="filteredPolls.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
      >
        <PollCard v-for="poll in filteredPolls" :key="poll.id" :poll="poll" />
      </div>

      <div
        v-else
        class="py-20 text-center bg-slate-900/40 border border-slate-800 rounded"
      >
        <p class="text-slate-600 font-black uppercase tracking-widest text-xs">
          Folder is currently empty.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { usePollStore } from "@/stores/pollstore";
import PollCard from "@/components/polls/PollCard.vue";
import PollList from "@/components/polls/PollList.vue";

const store = usePollStore();
const currentFilter = ref("ongoing");

// --- 🛠️ LOGIC: CHECK IF POLL IS FULL ---
const isPollDone = (poll) => {
  const total = poll.voters?.length || 0;
  const voted = poll.voters?.filter((v) => v.hasVoted).length || 0;
  return total > 0 && voted >= total;
};

// --- 🛠️ LOGIC: FILTERING ---
const ongoingAndNotFull = computed(() => {
  return store.polls.filter((p) => {
    const isPast = new Date(p.endAt) <= new Date();
    return !isPast && !isPollDone(p);
  });
});

// Active + Upcoming (excluding full) for Live Participation section
const activeAndNotFull = computed(() => {
  return store.activeWorkspace.filter((p) => !isPollDone(p));
});

const filteredPolls = computed(() => {
  const now = new Date();
  if (currentFilter.value === "ongoing") {
    // Show only those NOT ended and NOT full
    return store.polls.filter((p) => new Date(p.endAt) > now && !isPollDone(p));
  } else {
    // Show those that ARE ended OR ARE full
    return store.polls.filter((p) => new Date(p.endAt) <= now || isPollDone(p));
  }
});

// --- 🛠️ LOGIC: SYSTEM STATS ---
const systemStats = computed(() => {
  const now = new Date();
  const totalPolls = store.polls.length;
  const totalVotes = store.polls.reduce(
    (sum, p) => sum + p.candidates.reduce((s, c) => s + (c.votes || 0), 0),
    0
  );
  const ongoingCount = store.polls.filter(
    (p) =>
      new Date(p.startAt) <= now && new Date(p.endAt) > now && !isPollDone(p)
  ).length;
  const upcomingCount = store.polls.filter(
    (p) => new Date(p.startAt) > now
  ).length;

  return [
    {
      label: "Total Votes Cast",
      value: totalVotes,
      sub: "Live Count",
      color: "text-emerald-400",
    },
    {
      label: "Verified Voters",
      value: store.totalVotersCount || 0,
      sub: "Authorized",
      color: "text-blue-400",
    },
    {
      label: "Ongoing Polls",
      value: ongoingCount,
      sub: "Active",
      color: "text-emerald-500",
    },
    {
      label: "Upcoming",
      value: upcomingCount,
      sub: "Scheduled",
      color: "text-amber-500",
    },
  ];
});

const filterBtn = (active) =>
  `px-6 py-2 rounded-xl text-xs font-black transition-all ${
    active
      ? "bg-slate-800 text-emerald-400 shadow-lg ring-1 ring-slate-700"
      : "text-slate-500 hover:text-slate-300"
  }`;
</script>
