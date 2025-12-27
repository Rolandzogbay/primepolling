<template>
  <div class="max-w-4xl mx-auto px-2 sm:px-4 pb-20">
    <div class="mb-6 sm:mb-8 md:mb-10 text-center md:text-left">
      <h1 class="text-xl sm:text-2xl md:text-4xl font-black text-white">
        Create <span class="text-emerald-500">NewPoll</span>
      </h1>
      <p class="text-slate-500 mt-2 text-sm md:text-base">
        Set up your voting event, add candidates, and authorize voters.
      </p>
    </div>

    <div class="flex gap-4 md:gap-8 border-b border-slate-800 mb-6 md:mb-10 overflow-x-auto text-sm md:text-base pb-4 -mx-2 px-2">
      <button
        type="button"
        @click="setTab(1)"
        :class="tabClass(activeTab === 1)"
        class="whitespace-nowrap"
      >
        1. General Info
      </button>
      <button
        type="button"
        @click="setTab(2)"
        :class="tabClass(activeTab === 2)"
        class="whitespace-nowrap"
      >
        2. Candidates
      </button>
      <button
        type="button"
        @click="setTab(3)"
        :class="tabClass(activeTab === 3)"
        class="whitespace-nowrap"
      >
        3. Voter Access
      </button>
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
      <div v-if="activeTab === 1" class="space-y-6">
        <div>
          <label
            class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2"
            >Poll Title</label
          >
          <input
            v-model="formData.title"
            type="text"
            placeholder="e.g. Annual Board Election"
            class="form-input w-full bg-slate-950 border-slate-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label
            class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2"
            >Description</label
          >
          <textarea
            v-model="formData.description"
            rows="3"
            class="form-input w-full bg-slate-950 border-slate-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Details about the poll..."
          ></textarea>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label
              class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2"
              >Start Date</label
            >
            <input
              v-model="formData.startAt"
              type="datetime-local"
              class="form-input w-full bg-slate-950 border border-slate-800 text-white p-2 sm:p-3 rounded-lg md:rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <div>
            <label
              class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2"
              >End Date</label
            >
            <input
              v-model="formData.endAt"
              type="datetime-local"
              class="form-input w-full bg-slate-950 border border-slate-800 text-white p-2 sm:p-3 rounded-lg md:rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div v-if="activeTab === 2" class="space-y-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-white">Nominees</h3>
          <button
            @click="addCandidateField"
            class="text-xs bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/30 hover:bg-emerald-600/30 transition-all"
          >
            + Add Candidate
          </button>
        </div>
        <div
          v-for="(c, index) in formData.candidates"
          :key="index"
          class="p-3 sm:p-4 bg-slate-950 rounded-lg sm:rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center"
        >
          <div
            class="w-14 h-14 shrink-0 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="c.image"
              :src="c.image"
              alt="candidate"
              class="w-full h-full object-cover"
            />
            <div v-else class="text-white font-bold">
              {{ getInitials(c.name) }}
            </div>
          </div>

          <div class="flex-1 space-y-3">
            <input
              v-model="c.name"
              placeholder="Name"
              class="w-full bg-slate-900 border border-slate-800 text-white p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all duration-200"
            />
            <input
              v-model="c.manifesto"
              placeholder="Manifesto/Bio"
              class="w-full bg-slate-900 border border-slate-800 text-slate-400 text-sm p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all duration-200"
            />
            <div class="flex items-center gap-2 mt-2">
              <label
                class="text-xs px-3 py-1 rounded-md bg-slate-800 text-slate-200 cursor-pointer border border-slate-700 hover:bg-slate-700 transition-all"
              >
                Upload Photo
                <input
                  @change="(e) => handleCandidateImage(e, c)"
                  type="file"
                  accept="image/*"
                  class="hidden"
                />
              </label>
              <button
                v-if="c.image"
                @click.prevent="removeCandidateImage(c)"
                class="text-xs text-rose-400 hover:text-rose-300 transition-all"
              >
                Remove Photo
              </button>
            </div>
          </div>

          <button
            @click="removeCandidate(index)"
            class="ml-2 px-3 py-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
            title="Remove candidate"
          >
            ✕
          </button>
        </div>
      </div>

      <div v-if="activeTab === 3" class="space-y-6">
        <label class="block text-xs font-bold text-slate-400 uppercase mb-2"
          >Voter IDs (One per line)</label
        >
        <textarea
          v-model="voterList"
          rows="8"
          class="w-full bg-slate-950 border-slate-800 text-white p-4 rounded-xl font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all duration-200"
        ></textarea>
      </div>

      <div class="mt-10 flex justify-between">
        <button
          type="button"
          v-if="activeTab > 1"
          @click="prevTab"
          class="text-slate-400 font-bold"
        >
          Back
        </button>
        <div v-else></div>
        <button
          type="button"
          v-if="activeTab < 3"
          @click="nextTab"
          class="px-8 py-2 bg-slate-800 text-white rounded-xl font-bold"
        >
          Next
        </button>
        <button
          v-else
          type="button"
          @click="handleSubmit"
          class="px-8 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all"
        >
          Launch Poll
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { usePollStore } from "@/stores/pollstore";
import { usePolls } from "@/composables/usePolls";

const router = useRouter();
const store = usePollStore();
const { create } = usePolls();

const activeTab = ref(1);
const voterList = ref("");

const setTab = (n) => {
  activeTab.value = n;
};
const nextTab = () => {
  if (activeTab.value < 3) activeTab.value++;
};
const prevTab = () => {
  if (activeTab.value > 1) activeTab.value--;
};

const formData = reactive({
  title: "",
  description: "",
  startAt: new Date().toISOString().slice(0, 16),
  endAt: "",
  candidates: [{ name: "", manifesto: "", image: null }],
});

const tabClass = (isActive) =>
  `pb-4 text-sm font-bold transition-all border-b-2 ${
    isActive
      ? "text-emerald-400 border-emerald-500"
      : "text-slate-600 border-transparent"
  }`;
const addCandidateField = () =>
  formData.candidates.push({ name: "", manifesto: "", image: null });
const removeCandidate = (index) => formData.candidates.splice(index, 1);

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const handleCandidateImage = (e, candidate) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const MAX_BYTES = 2 * 1024 * 1024; // 2MB
  if (!file.type || !file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    return;
  }
  if (file.size > MAX_BYTES) {
    alert("Image is too large. Maximum size is 2MB.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    candidate.image = reader.result;
  };
  reader.readAsDataURL(file);
};
const removeCandidateImage = (candidate) => {
  candidate.image = null;
};

const handleSubmit = () => {
  if (!formData.title || !formData.endAt) return alert("Fill all fields");

  const voters = voterList.value
    .split("\n")
    .filter((v) => v.trim())
    .map((v) => ({ identifier: v.trim(), hasVoted: false }));

  // Ensure candidates have IDs, 0 votes and include image if provided
  const finalCandidates = formData.candidates.map((c) => ({
    ...c,
    id: "c-" + Math.random().toString(36).substr(2, 9),
    votes: 0,
    image: c.image || null,
  }));

  create({
    ...formData,
    candidates: finalCandidates,
    voters,
  });

  router.push("/");
};
</script>
