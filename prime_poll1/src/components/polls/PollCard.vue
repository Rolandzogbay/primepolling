<template>
  <div
    class="bg-slate-900 border border-slate-800 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl flex flex-col group hover:shadow-2xl hover:shadow-emerald-900/10 transition-all relative overflow-hidden"
  >
    <div class="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
      <div class="flex flex-col gap-2 flex-1 min-w-0">
        <span :class="statusClass" :style="statusStyle">
          {{ isDone ? "Done / Completed" : pollStatus }}
        </span>

        <div
          v-if="pollStatus === 'Ongoing' && !isDone"
          class="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-md border w-fit"
          :style="{
            color: store.settings.primaryColor,
            backgroundColor: store.settings.primaryColor + '10',
            borderColor: store.settings.primaryColor + '20',
          }"
        >
          <span>{{ timeLeft }}</span>
        </div>
      </div>

      <router-link
        :to="'/edit/' + poll.id"
        class="p-1.5 bg-slate-800 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100 shrink-0"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            stroke-width="2"
          />
        </svg>
      </router-link>
    </div>

    <h3
      class="text-base sm:text-lg md:text-xl font-bold text-white transition-colors uppercase tracking-tight group-hover:text-(--hover-color)"
      :style="{ '--hover-color': store.settings.primaryColor }"
    >
      {{ poll.title }}
    </h3>

    <p
      class="text-slate-500 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed font-medium"
    >
      {{ poll.description }}
    </p>

    <div
      class="mt-4 p-2 sm:p-3 bg-slate-950/50 border border-slate-800/50 rounded-lg sm:rounded-2xl"
    >
      <div class="flex items-center justify-between">
        <span
          class="text-[8px] sm:text-[9px] font-black text-slate-600 uppercase tracking-widest"
          >Expires</span
        >
        <span
          class="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase font-mono"
          >{{ formatFullDate(poll.endAt) }}</span
        >
      </div>
    </div>

    <div class="mt-4 sm:mt-6 flex items-center justify-between flex-wrap gap-3 sm:gap-4">
      <div class="flex -space-x-2">
        <div
          v-for="c in poll.candidates.slice(0, 3)"
          :key="c.id"
          class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center overflow-hidden text-[8px] sm:text-[10px] font-bold text-white shadow-lg"
        >
          <img
            v-if="c.image"
            :src="c.image"
            alt="candidate"
            class="w-full h-full object-cover"
          />
          <span v-else>{{ getInitials(c.name) }}</span>
        </div>
      </div>
      <div class="text-right">
        <span
          class="block text-[8px] sm:text-[9px] font-black text-slate-600 uppercase tracking-widest"
          >Participation</span
        >

        <span
          class="text-[10px] sm:text-[11px] font-mono font-bold transition-all"
          :class="{ 'blur-sm select-none': store.settings.observerMode }"
          :style="{ color: isDone ? store.settings.primaryColor : '#94a3b8' }"
        >
          {{ votesCount }} / {{ totalEligible }}
        </span>
      </div>
    </div>

    <div class="mt-6 pt-6 border-t border-slate-800 space-y-3">
      <router-link
        v-if="pollStatus === 'Ongoing' && !isDone"
        :to="'/vote/' + poll.id"
        class="w-full flex items-center justify-center gap-2 py-2.5 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95"
        :style="{ backgroundColor: store.settings.primaryColor }"
      >
        <span>Cast Your Vote</span>
      </router-link>

      <router-link
        v-else-if="isDone || pollStatus === 'Ended'"
        :to="'/poll/' + poll.id"
        class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all border active:scale-95"
        :style="resultsButtonStyle"
      >
        <span>View Results</span>
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </router-link>

      <router-link
        v-else
        :to="'/poll/' + poll.id"
        class="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all"
      >
        <span>View Preview</span>
      </router-link>

      <router-link
        :to="'/poll/' + poll.id"
        class="w-full flex items-center justify-center py-2 text-[10px] font-black text-slate-500 hover:text-emerald-500 uppercase tracking-[0.2em] transition-colors"
      >
        View Full Details
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { usePollStore } from "@/stores/pollstore";

const props = defineProps(["poll"]);
const store = usePollStore();

// CAPACITY LOGIC
const totalEligible = computed(() => props.poll.voters?.length || 0);
const votesCount = computed(
  () => props.poll.voters?.filter((v) => v.hasVoted).length || 0
);
const isDone = computed(
  () => totalEligible.value > 0 && votesCount.value >= totalEligible.value
);

// TIMER LOGIC
const timeLeft = ref("");
let timerInterval = null;

const updateCountdown = () => {
  const now = new Date().getTime();
  const target = new Date(props.poll.endAt).getTime();
  const diff = target - now;
  if (diff <= 0) {
    timeLeft.value = "00:00:00";
    return;
  }
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  timeLeft.value = `${h}h ${m}m ${s}s`;
};

onMounted(() => {
  updateCountdown();
  timerInterval = setInterval(updateCountdown, 1000);
});
onUnmounted(() => clearInterval(timerInterval));

// DYNAMIC STYLING COMPUTED
const statusStyle = computed(() => {
  const color = isDone.value
    ? store.settings.primaryColor
    : pollStatus.value === "Ended"
    ? "#64748b"
    : "#3b82f6";
  return {
    color: color,
    backgroundColor: color + "15",
    borderColor: color + "30",
  };
});

const resultsButtonStyle = computed(() => {
  return {
    color: store.settings.primaryColor,
    backgroundColor: store.settings.primaryColor + "10",
    borderColor: store.settings.primaryColor + "30",
  };
});

const pollStatus = computed(() => {
  const now = new Date();
  if (new Date(props.poll.startAt) > now) return "Upcoming";
  if (new Date(props.poll.endAt) < now) return "Ended";
  return "Ongoing";
});

const statusClass =
  "w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ";

const formatFullDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
