<template>
  <div class="p-6 lg:p-10 max-w-400 mx-auto space-y-8">
    
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/50">
      <div>
        <h1 class="text-4xl font-black text-white tracking-tight">
          Voter <span class="text-emerald-500">Analytics</span>
        </h1>
        <p class="text-slate-500 mt-2 font-medium">Deep-dive into participation metrics and distribution data.</p>
      </div>
      <div class="flex gap-3">
        <button @click="exportData" class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all border border-slate-700">
          EXPORT CSV
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in summaryStats" :key="stat.label" class="bg-slate-900 border border-slate-800 p-6 rounded-4xl shadow-xl">
        <div class="flex items-center gap-3 mb-4">
          <div :class="stat.bg" class="w-10 h-10 rounded-xl flex items-center justify-center text-lg">
            <i :class="stat.icon"></i>
          </div>
          <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ stat.label }}</span>
        </div>
        <div class="flex items-baseline gap-2">
          <h2 class="text-3xl font-black text-white">{{ stat.value }}</h2>
          <span class="text-xs font-bold text-emerald-500">{{ stat.trend }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div class="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <span class="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
          Participation Breakdown
        </h3>
        
        <div class="space-y-8">
          <div v-for="poll in store.polls.slice(0, 5)" :key="poll.id" class="group">
            <div class="flex justify-between items-center mb-3">
              <div>
                <p class="text-white font-bold">{{ poll.title }}</p>
                <p class="text-[10px] text-slate-500 uppercase font-black">{{ getVotedCount(poll) }} / {{ poll.voters.length }} Votes</p>
              </div>
              <span class="text-sm font-mono font-bold text-emerald-400">{{ calculateTurnout(poll) }}%</span>
            </div>
            <div class="h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner p-1">
              <div 
                class="h-full bg-linear-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                :style="{ width: calculateTurnout(poll) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center justify-center text-center">
        <h3 class="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-10">Global Engagement</h3>
        
        <div class="relative w-48 h-48 mb-8">
          <svg class="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="currentColor" stroke-width="12" fill="transparent" class="text-slate-800" />
            <circle cx="96" cy="96" r="88" stroke="currentColor" stroke-width="12" fill="transparent" 
              class="text-emerald-500 transition-all duration-1000" 
              :stroke-dasharray="552.9" 
              :stroke-dashoffset="552.9 - (552.9 * globalTurnout / 100)"
              stroke-linecap="round"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-4xl font-black text-white">{{ globalTurnout }}%</span>
            <span class="text-[10px] font-bold text-slate-500 uppercase">Avg. Turnout</span>
          </div>
        </div>

        <p class="text-slate-400 text-sm leading-relaxed">
          Based on <span class="text-white font-bold">{{ totalVoters }}</span> unique authorized IDs across all system clusters.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePollStore } from '@/stores/pollstore';

const store = usePollStore();

// --- LOGIC: CALCULATIONS ---

const getVotedCount = (poll) => poll.voters.filter(v => v.hasVoted).length;

const calculateTurnout = (poll) => {
  if (!poll.voters.length) return 0;
  return Math.round((getVotedCount(poll) / poll.voters.length) * 100);
};

const totalVoters = computed(() => {
  return store.polls.reduce((sum, p) => sum + p.voters.length, 0);
});

const globalTurnout = computed(() => {
  const totalPossible = totalVoters.value;
  if (totalPossible === 0) return 0;
  const totalCast = store.polls.reduce((sum, p) => sum + getVotedCount(p), 0);
  return Math.round((totalCast / totalPossible) * 100);
});

const summaryStats = computed(() => [
  { 
    label: 'Total Ballots', 
    value: store.polls.length, 
    trend: '+12%', 
    icon: 'fas fa-vote-yea', 
    bg: 'bg-blue-500/10 text-blue-500' 
  },
  { 
    label: 'System Turnout', 
    value: globalTurnout.value + '%', 
    trend: 'Steady', 
    icon: 'fas fa-users', 
    bg: 'bg-emerald-500/10 text-emerald-500' 
  },
  { 
    label: 'Archived Polls', 
    value: store.polls.filter(p => new Date(p.endAt) < new Date()).length, 
    trend: 'N/A', 
    icon: 'fas fa-archive', 
    bg: 'bg-slate-500/10 text-slate-500' 
  },
  { 
    label: 'Candidate Pool', 
    value: store.polls.reduce((sum, p) => sum + p.candidates.length, 0), 
    trend: '+4', 
    icon: 'fas fa-user-tie', 
    bg: 'bg-amber-500/10 text-amber-500' 
  },
]);

const exportData = () => {
  alert("Generating CSV secure export...");
  // Logic for CSV generation would go here
};
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.6s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
