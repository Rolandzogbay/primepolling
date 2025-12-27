<template>
  <div class="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
    
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/50">
      <div>
        <h1 class="text-4xl font-black text-white tracking-tight">
          User <span :style="{ color: store.settings.primaryColor }">Registry</span>
        </h1>
        <p class="text-slate-500 mt-2 font-medium">Manage and audit authorized voter identifiers.</p>
      </div>
      <div class="flex items-center gap-4">
        <button @click="showAddModal = true" 
                :style="{ backgroundColor: store.settings.primaryColor }"
                class="px-6 py-3 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 hover:brightness-110">
          <i class="fas fa-plus mr-2"></i> Add Authorized ID
        </button>
        <div class="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <div class="px-4 py-2 text-xs font-bold text-slate-400 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full animate-pulse" :style="{ backgroundColor: store.settings.primaryColor }"></span>
            {{ totalVoters }} Total Records
          </div>
        </div>
      </div>
    </header>

    <div class="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center">
      <div class="relative flex-1 w-full">
        <label for="search" class="sr-only">Search Voter ID or Poll</label>
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true"></i>
        <input id="search" v-model="searchQuery" type="text" placeholder="Search by Voter ID or Poll..." 
               class="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-12 py-3 text-white outline-none transition-all focus-visible:ring-2 focus-visible:ring-offset-2"
               :style="{ '--tw-ring-color': store.settings.primaryColor }">

        <button v-if="searchQuery" @click="clearSearch" type="button" aria-label="Clear search"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-2 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-offset-2"
                :style="{ '--tw-ring-color': store.settings.primaryColor }">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <select v-model="statusFilter" 
              class="bg-slate-950 border border-slate-800 text-white px-6 py-3 rounded-2xl outline-none focus:ring-2 w-full md:w-auto"
              :style="{ '--tw-ring-color': store.settings.primaryColor }">
        <option value="all">All Statuses</option>
        <option value="voted">Voted</option>
        <option value="pending">Pending</option>
      </select>
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <!-- Mobile list (visible on small screens) -->
      <div class="sm:hidden p-4 space-y-3">
        <div v-for="user in filteredUsers" :key="user.pollId + user.id" class="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-3">
              <div class="font-mono text-sm font-bold text-white truncate">
                <span v-if="!store.settings.observerMode">{{ user.id }}</span>
                <span v-else class="text-slate-500 tracking-widest">{{ user.id.slice(0,3) }}•••••{{ user.id.slice(-2) }}</span>
              </div>
              <div>
                <span :style="getStatusStyle(user.hasVoted)" class="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border">
                  {{ user.hasVoted ? 'Completed' : 'Awaiting Vote' }}
                </span>
              </div>
            </div>
            <div class="text-slate-400 mt-2 text-sm truncate">{{ user.pollTitle }}</div>
          </div>

          <div class="ml-2 flex flex-col items-end gap-2">
            <div v-if="!user.pollIsDone" class="flex gap-2">
              <button v-if="user.hasVoted" @click="handleResetVote(user)" class="w-8 h-8 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg flex items-center justify-center transition-all">
                <i class="fas fa-undo-alt text-xs"></i>
              </button>
              <button @click="handleDeleteVoter(user)" class="w-8 h-8 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center transition-all">
                <i class="fas fa-user-minus text-xs"></i>
              </button>
            </div>
            <div v-else class="text-[10px] font-bold text-slate-600 uppercase">Poll Locked</div>
          </div>
        </div>

        <div v-if="filteredUsers.length === 0" class="text-center py-8">
          <div class="flex flex-col items-center justify-center space-y-4">
            <div class="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
              <i class="fas fa-search text-slate-500 text-lg"></i>
            </div>
            <div>
              <h3 class="text-white font-bold text-base">No matching records found</h3>
              <p class="text-slate-500 text-sm">Clear your filters or try a different search term.</p>              <div class="mt-4 flex justify-center">
                <button @click="showAddModal = true" :style="{ backgroundColor: store.settings.primaryColor }" class="px-4 py-2 text-white rounded-xl font-bold hover:brightness-110">Add Authorized ID</button>
              </div>            </div>
          </div>
        </div>
      </div>

      <!-- Desktop / Tablet table (hidden on small screens) -->
      <div class="hidden sm:block">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-950/50 border-b border-slate-800">
              <th class="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Voter Identifier</th>
              <th class="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Poll Title</th>
              <th class="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th class="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/50">
            <tr v-for="user in filteredUsers" :key="user.pollId + user.id" class="group hover:bg-slate-800/20 transition-colors">

              <td class="px-8 py-5 font-mono text-sm">
                <span v-if="!store.settings.observerMode" class="text-white font-bold">{{ user.id }}</span>
                <span v-else class="text-slate-500 font-bold tracking-widest">
                  {{ user.id.slice(0, 3) }}•••••{{ user.id.slice(-2) }}
                </span>
              </td>

              <td class="px-8 py-5 text-slate-400">{{ user.pollTitle }}</td>
              <td class="px-8 py-5">
                <span :style="getStatusStyle(user.hasVoted)" 
                      class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border">
                  {{ user.hasVoted ? 'Completed' : 'Awaiting Vote' }}
                </span>
              </td>
              <td class="px-8 py-5 text-right">
              <div v-if="!user.pollIsDone" class="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button v-if="user.hasVoted" @click="handleResetVote(user)" aria-label="Reset vote for this user" title="Reset vote"
                        class="w-9 h-9 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-xl flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-offset-2"
                        :style="{ '--tw-ring-color': store.settings.primaryColor }">
                  <i class="fas fa-undo-alt" aria-hidden="true"></i>
                </button>
                <button @click="handleDeleteVoter(user)" aria-label="Delete this voter" title="Remove voter"
                        class="w-9 h-9 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-offset-2"
                        :style="{ '--tw-ring-color': store.settings.primaryColor }">
                  <i class="fas fa-user-minus" aria-hidden="true"></i>
                  </button>
                </div>
                <span v-else class="text-[10px] font-bold text-slate-600 uppercase">Poll Locked</span>
              </td>
            </tr>

            <tr v-if="filteredUsers.length === 0">
              <td colspan="4" class="px-8 py-24 text-center">
                <div class="flex flex-col items-center justify-center space-y-4">
                  <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                    <i class="fas fa-search text-slate-500 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="text-white font-bold text-lg">No matching records found</h3>
                    <p class="text-slate-500 text-sm">Clear your filters or try a different search term.</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="addVoterTitle" tabindex="-1" @keydown.esc="showAddModal = false">
      <div class="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 animate-in zoom-in duration-200 shadow-2xl" role="document">
        <div class="flex items-start justify-between mb-4">
          <h2 id="addVoterTitle" class="text-2xl font-black text-white mb-0">Authorize New ID</h2>
          <button @click="showAddModal = false" aria-label="Close add voter dialog" class="p-2 rounded-md text-slate-400 hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2" :style="{ '--tw-ring-color': store.settings.primaryColor }">✕</button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Poll</label>
            <select v-model="newVoter.pollId" ref="pollSelect"
                    class="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl mt-1 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    :style="{ '--tw-ring-color': store.settings.primaryColor }">
              <option value="" disabled>Choose a poll...</option>
              <option v-for="poll in activePollsForAdding" :key="poll.id" :value="poll.id">{{ poll.title }}</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Voter ID</label>
            <input v-model="newVoter.id" @keyup.enter="handleAddVoter" type="text" placeholder="Enter unique ID..." 
                   class="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl mt-1 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                   :style="{ '--tw-ring-color': store.settings.primaryColor }">
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="showAddModal = false" class="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2">Cancel</button>
          <button @click="handleAddVoter" 
                  :style="{ backgroundColor: store.settings.primaryColor }"
                  class="flex-1 py-3 text-white rounded-xl font-bold hover:brightness-110 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { usePollStore } from '@/stores/pollstore';

const store = usePollStore();
const searchQuery = ref('');
const statusFilter = ref('all');
const showAddModal = ref(false);
const newVoter = ref({ pollId: '', id: '' });
const pollSelect = ref(null);

const clearSearch = () => { searchQuery.value = ''; };

watch(showAddModal, async (val) => {
  if (val) {
    await nextTick();
    if (pollSelect.value && pollSelect.value.focus) pollSelect.value.focus();
  }
});

// Helper to check if poll is inactive
const isPollComplete = (poll) => {
  const isExpired = new Date(poll.endAt) < new Date();
  const total = poll.voters?.length || 0;
  const voted = poll.voters?.filter(v => v.hasVoted).length || 0;
  return isExpired || (total > 0 && voted >= total);
};

// Flatten polls and voters for the registry list
const allVoters = computed(() => {
  const list = [];
  store.polls.forEach(poll => {
    if (poll.voters) {
      poll.voters.forEach(voter => {
        list.push({
          id: voter.identifier,
          hasVoted: voter.hasVoted,
          pollTitle: poll.title,
          pollId: poll.id,
          pollIsDone: isPollComplete(poll)
        });
      });
    }
  });
  return list;
});

const totalVoters = computed(() => allVoters.value.length);
const activePollsForAdding = computed(() => store.polls.filter(p => !isPollComplete(p)));

const filteredUsers = computed(() => {
  return allVoters.value.filter(user => {
    const matchesSearch = user.id.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                         user.pollTitle.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = statusFilter.value === 'all' || 
                         (statusFilter.value === 'voted' && user.hasVoted) || 
                         (statusFilter.value === 'pending' && !user.hasVoted);
    return matchesSearch && matchesStatus;
  });
});

// Dynamic status pill styling
const getStatusStyle = (hasVoted) => {
  const color = hasVoted ? store.settings.primaryColor : '#f59e0b';
  return {
    color: color,
    backgroundColor: color + '10',
    borderColor: color + '20'
  };
};

const handleResetVote = (user) => {
  if (confirm(`Reset vote for ${user.id}?`)) store.resetUserVote(user.pollId, user.id);
};

const handleDeleteVoter = (user) => {
  if (confirm(`Remove ${user.id}?`)) store.removeVoter(user.pollId, user.id);
};

const handleAddVoter = () => {
  if (!newVoter.value.pollId || !newVoter.value.id) return alert("Please fill all fields");
  store.addVoterToPoll(newVoter.value.pollId, newVoter.value.id);
  newVoter.value = { pollId: '', id: '' };
  showAddModal.value = false;
};
</script>
