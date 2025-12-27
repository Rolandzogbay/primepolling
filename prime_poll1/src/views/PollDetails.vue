<template>
  <div v-if="poll" class="space-y-6 sm:space-y-8 md:space-y-10 animate-in fade-in duration-500">
    <div
      class="flex flex-col sm:items-start md:items-center justify-between gap-3 sm:gap-4 md:gap-6"
    >
      <div class="w-full">
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
            {{ poll.title }}
          </h1>

          <div class="ml-0 sm:ml-2 flex items-center gap-2 flex-wrap">
            <span :class="statusBadgeClass">{{
              isFull ? "Completed" : getStatus
            }}</span>
            <button
              @click="router.push(`/edit/${poll.id}`)"
              class="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs sm:text-sm"
              title="Edit poll"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <p class="text-slate-500 max-w-2xl mb-3 text-sm md:text-base">{{ poll.description }}</p>

        <div class="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 text-[11px] sm:text-[12px] md:text-xs text-slate-400">
          <div
            class="px-2 sm:px-3 py-2 bg-slate-800 rounded-lg border border-slate-700"
          >
            <strong class="text-white block text-[10px] sm:text-[11px]">Starts</strong>
            <div class="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px]">
              {{ new Date(poll.startAt).toLocaleString() }}
            </div>
          </div>

          <div
            class="px-2 sm:px-3 py-2 bg-slate-800 rounded-lg border border-slate-700"
          >
            <strong class="text-white block text-[10px] sm:text-[11px]">Ends</strong>
            <div class="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px]">{{ new Date(poll.endAt).toLocaleString() }}</div>
          </div>

          <div
            class="px-2 sm:px-3 py-2 bg-slate-800 rounded-lg border border-slate-700"
          >
            <strong class="text-white block text-[10px] sm:text-[11px]">Eligible Voters</strong>
            <div class="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px]">{{ poll.voters.length }}</div>
          </div>
        </div>
      </div>

      <div
        class="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-lg sm:rounded-2xl flex items-center gap-3 sm:gap-4 shrink-0"
      >
        <div class="text-right">
          <p
            class="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest"
          >
            Total Votes Cast
          </p>
          <p class="text-xl sm:text-2xl font-black text-emerald-400">{{ totalVotes }}</p>
        </div>
        <div
          class="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-lg sm:rounded-xl flex items-center justify-center text-emerald-500 shrink-0"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              stroke-width="2"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
      <div class="lg:col-span-2 space-y-4 sm:space-y-6">
        <div
          class="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden"
        >
          <div
            v-if="isFull"
            class="absolute top-0 left-0 w-full h-1 bg-emerald-500"
          ></div>

          <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span>{{ isFull ? "🏁" : "🏆" }}</span>
            {{ isFull ? "Final Results" : "Live Standings" }}
          </h3>

          <div class="space-y-8">
            <div
              v-for="(candidate, index) in sortedCandidates"
              :key="candidate.id"
              class="relative group"
            >
              <div class="flex justify-between mb-3 items-start">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      v-if="candidate.image"
                      :src="candidate.image"
                      :alt="candidate.name"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm"
                    >
                      {{ getInitials(candidate.name) }}
                    </div>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span
                        class="text-sm font-bold text-white leading-tight"
                        >{{ candidate.name }}</span
                      >
                      <span
                        v-if="index === 0 && candidate.votes > 0"
                        class="text-amber-400 text-xs animate-bounce"
                        title="Leading"
                        >👑</span
                      >
                    </div>
                    <p
                      v-if="candidate.manifesto"
                      class="text-xs text-slate-400 mt-1 line-clamp-2"
                    >
                      {{ candidate.manifesto }}
                    </p>
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-sm font-mono text-emerald-400 font-bold">
                    {{ candidate.votes }}
                  </div>
                  <div class="text-xs text-slate-400 mt-1">
                    {{ getPercentage(candidate.votes) }}%
                  </div>
                </div>
              </div>

              <div
                class="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50"
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
                    '%)'
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

      <div class="space-y-6">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3
            class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4"
          >
            Participation
          </h3>
          <div class="flex items-center justify-center py-4">
            <div
              class="relative w-32 h-32 flex items-center justify-center"
              role="img"
              :aria-label="`Turnout ${participationRate}%`"
            >
              <svg
                class="w-full h-full transform -rotate-90"
                viewBox="0 0 128 128"
                aria-hidden="true"
              >
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  class="text-slate-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  :class="isFull ? 'text-emerald-400' : 'text-emerald-600'"
                  :stroke-dasharray="dasharray"
                  :stroke-dashoffset="dashoffset"
                  stroke-linecap="round"
                />
              </svg>
              <span
                class="absolute text-xl font-black text-white"
                :class="{ 'text-emerald-400': isFull }"
                >{{ participationRate }}%</span
              >
            </div>
          </div>
          <p
            class="text-center text-xs text-slate-500 mt-2 font-bold uppercase tracking-tighter"
          >
            Turnout: {{ totalVotes }} / {{ poll.voters.length }}
          </p>
          <div
            v-if="isFull"
            class="mt-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center"
          >
            <span
              class="text-[10px] font-black text-emerald-500 uppercase tracking-widest"
              >Election Finalized</span
            >
          </div>
        </div>

        <div
          class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3"
        >
          <h3 class="text-sm font-bold text-slate-400 mb-2">
            Management Actions
          </h3>
          <div class="flex gap-3">
            <button
              @click="exportCSV"
              class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700"
            >
              Export CSV
            </button>
            <button
              @click="copyResults"
              class="py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700"
            >
              Copy
            </button>
          </div>

          <button
            @click="router.push(`/vote/${poll.id}`)"
            :disabled="isFull"
            :class="[
              'w-full py-2 rounded-xl text-xs font-bold transition-all border mt-2',
              isFull
                ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border-emerald-500/20',
            ]"
          >
            {{ isFull ? "Voting Closed" : "Go to Ballot Screen" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePollStore } from "@/stores/pollstore";

const route = useRoute();
const router = useRouter();
const store = usePollStore();

const poll = computed(() => store.getPollById(route.params.id));

const isFull = computed(() => {
  if (!poll.value) return false;
  return (
    poll.value.voters.length > 0 && totalVotes.value >= poll.value.voters.length
  );
});

const totalVotes = computed(() => {
  return poll.value
    ? poll.value.candidates.reduce((sum, c) => sum + (c.votes || 0), 0)
    : 0;
});

const sortedCandidates = computed(() => {
  if (!poll.value) return [];
  return [...poll.value.candidates].sort((a, b) => b.votes - a.votes);
});

const participationRate = computed(() => {
  if (!poll.value || !poll.value.voters.length) return 0;
  return Math.round((totalVotes.value / poll.value.voters.length) * 100);
});

const getPercentage = (votes) => {
  if (totalVotes.value === 0) return 0;
  return Math.round((votes / totalVotes.value) * 100);
};

// Circle constants for the donut
const radius = 58;
const dasharray = 2 * Math.PI * radius;
const dashoffset = computed(() => {
  // offset should represent the remaining circumference
  return dasharray * (1 - participationRate.value / 100);
});

const exportCSV = () => {
  if (!poll.value) return;
  const rows = [["Candidate", "Votes", "Percent"]];
  sortedCandidates.value.forEach((c) =>
    rows.push([c.name, c.votes, getPercentage(c.votes) + "%"])
  );
  const csv = rows
    .map((r) =>
      r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(poll.value.title || "poll")
    .replace(/\s+/g, "_")
    .slice(0, 50)}_results.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const copyResults = async () => {
  if (!poll.value) return;
  const text = [
    "Candidate, Votes, Percent",
    ...sortedCandidates.value.map(
      (c) => `${c.name}, ${c.votes}, ${getPercentage(c.votes)}%`
    ),
  ].join("\n");
  try {
    await navigator.clipboard.writeText(text);
    // small visual cue - keep simple alert for now
    alert("Results copied to clipboard");
  } catch (e) {
    alert("Unable to copy results to clipboard");
  }
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

const getStatus = computed(() => {
  const now = new Date();
  if (new Date(poll.value.startAt) > now) return "Upcoming";
  if (new Date(poll.value.endAt) < now) return "Ended";
  return "Ongoing";
});

const statusBadgeClass = computed(() => {
  const base =
    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ";
  if (isFull.value)
    return base + "bg-emerald-500 text-white shadow-lg shadow-emerald-900/40";
  const status = getStatus.value;
  if (status === "Upcoming")
    return base + "bg-amber-500/10 text-amber-500 border border-amber-500/20";
  if (status === "Ended")
    return base + "bg-slate-800 text-slate-400 border border-slate-700";
  return (
    base + "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
  );
});
</script>
