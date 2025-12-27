<template>
  <div class="max-w-5xl mx-auto px-2 sm:px-4">
    <div v-if="!isVerified && !hasVoted" class="flex justify-center py-12 sm:py-16 md:py-20">
      <div
        class="bg-slate-900 border border-slate-800 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl w-full max-w-sm text-center shadow-2xl"
      >
        <div
          class="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-emerald-500/20"
        >
          <svg
            class="w-6 h-6 sm:w-8 sm:h-8"
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
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-2">Voter Verification</h2>
        <p class="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6">
          Please enter your authorized ID to access the ballot.
        </p>

        <input
          v-model="voterIdInput"
          @keyup.enter="verifyVoter"
          type="text"
          placeholder="Enter Voter ID"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white mb-3 sm:mb-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
        />
        <button
          @click="verifyVoter"
          class="w-full py-2 sm:py-3 bg-emerald-600 text-white rounded-lg sm:rounded-xl font-bold hover:bg-emerald-500 transition-all active:scale-95 text-sm"
        >
          Verify ID
        </button>
        <p
          v-if="errorMsg"
          class="text-red-400 text-[11px] sm:text-xs mt-3 sm:mt-4 flex items-center justify-center gap-1"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            />
          </svg>
          {{ errorMsg }}
        </p>
      </div>
    </div>

    <div
      v-else-if="isVerified && !hasVoted && currentPoll"
      class="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div class="mb-6 sm:mb-8 md:mb-10">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white">{{ currentPoll.title }}</h1>
        <p class="text-slate-500 mt-2 text-sm md:text-base">
          Select one candidate from the list below. This action cannot be
          undone.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <label
          v-for="candidate in currentPoll.candidates"
          :key="candidate.id"
          class="relative flex flex-col p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border-2 cursor-pointer transition-all"
          :class="
            selectedCandidate === candidate.id
              ? 'border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-900/20'
              : 'border-slate-800 bg-slate-900 hover:border-slate-700'
          "
        >
          <input
            type="radio"
            :value="candidate.id"
            v-model="selectedCandidate"
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
              <div v-else class="text-white font-bold text-sm">
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
                selectedCandidate === candidate.id
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-slate-700'
              "
            >
              <div
                v-if="selectedCandidate === candidate.id"
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
          @click="confirmVote"
          :disabled="!selectedCandidate"
          class="px-8 sm:px-12 md:px-20 py-3 sm:py-4 rounded-lg sm:rounded-2xl font-black text-base sm:text-xl transition-all shadow-xl"
          :class="
            selectedCandidate
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

    <div
      v-else-if="hasVoted"
      class="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-center animate-in zoom-in duration-500"
    >
      <div
        class="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20"
      >
        <svg
          class="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M5 13l4 4L19 7"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h1 class="text-4xl font-black text-white mb-4">Vote Recorded!</h1>
      <p class="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">
        Thank you for participating in
        <span class="text-white font-bold">{{ currentPoll?.title }}</span
        >. Your selection has been securely added to the ledger and the
        participation count has been updated.
      </p>

      <div class="flex gap-4">
        <button
          @click="router.push('/')"
          class="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
        >
          Return to Dashboard
        </button>
        <router-link
          :to="'/poll/' + route.params.id"
          class="px-8 py-3 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 rounded-xl font-bold hover:bg-emerald-600/20 transition-all"
        >
          View Live Results
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePollStore } from "@/stores/pollstore";
import { useVoting } from "@/composables/useVoting";

const route = useRoute();
const router = useRouter();
const store = usePollStore();
const { cast } = useVoting();

const voterIdInput = ref("");
const isVerified = ref(false);
const hasVoted = ref(false); // New state for Thank You page
const errorMsg = ref("");
const selectedCandidate = ref(null);

const currentPoll = computed(() => store.getPollById(route.params.id));

const verifyVoter = () => {
  const poll = currentPoll.value;
  if (!poll) return;

  const voter = poll.voters?.find(
    (v) => v.identifier.trim() === voterIdInput.value.trim()
  );

  if (!voter) {
    errorMsg.value = "Voter ID not found in this poll's registry.";
  } else if (voter.hasVoted) {
    errorMsg.value = "This ID has already cast a vote.";
  } else {
    isVerified.value = true;
    errorMsg.value = "";
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

const confirmVote = () => {
  if (!selectedCandidate.value) return;

  // Final check
  if (confirm("Are you sure? This action is permanent.")) {
    const res = cast(
      currentPoll.value.id,
      selectedCandidate.value,
      voterIdInput.value
    );
    if (!res || !res.success) {
      alert(res?.error || "Unable to cast vote.");
      return;
    }

    // Switch to Thank You state instead of immediate redirect
    hasVoted.value = true;
    isVerified.value = false;
  }
};
</script>
