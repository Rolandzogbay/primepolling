<template>
  <div v-if="formData" class="max-w-4xl mx-auto px-3 sm:px-4 md:px-0 pb-12 sm:pb-16">
    <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl md:text-3xl font-black text-white">Edit Poll</h1>
        <p class="text-slate-500 mt-2 font-mono text-xs">ID: {{ $route.params.id }}</p>
      </div>
      <button
        @click="handleDelete"
        class="px-3 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
      >
        DELETE
      </button>
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
      <div class="space-y-6">
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase mb-2"
            >Title</label
          >
          <input v-model="formData.title" type="text" class="form-input" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Start Time</label>
            <input v-model="formData.startAt" type="datetime-local" class="form-input" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-2">End Time</label>
            <input v-model="formData.endAt" type="datetime-local" class="form-input" />
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-sm font-bold text-white mb-3">Candidates</h3>
          <div class="space-y-3">
            <div
              v-for="(c, idx) in formData.candidates"
              :key="c.id"
              class="p-3 sm:p-4 bg-slate-950 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
            >
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-white font-bold shrink-0">
                <img v-if="c.image" :src="c.image" alt="candidate" class="w-full h-full object-cover" />
                <span v-else>{{ getInitials(c.name) }}</span>
              </div>

              <div class="flex-1">
                <input v-model="c.name" class="w-full bg-slate-900 border border-slate-800 text-white p-2 rounded-lg" placeholder="Name" />
                <input v-model="c.manifesto" class="w-full bg-slate-900 border border-slate-800 text-slate-400 p-2 rounded-lg mt-2" placeholder="Manifesto (optional)" />
                <div class="flex gap-2 mt-2">
                  <label class="px-3 py-1 bg-slate-800 rounded-md text-xs cursor-pointer">Upload
                    <input @change="(e) => handleCandidateImage(e, c)" type="file" accept="image/*" class="hidden" />
                  </label>
                  <button v-if="c.image" @click.prevent="c.image = null" class="px-3 py-1 bg-rose-600 text-white rounded-md text-xs">Remove</button>
                </div>
              </div>

              <button @click.prevent="removeCandidate(idx)" class="text-rose-400 self-start sm:self-auto">Remove</button>
            </div>
            <button
              @click="addCandidate"
              class="px-3 py-2 bg-emerald-600/20 text-emerald-400 rounded-md text-sm"
            >
              + Add Candidate
            </button>
          </div>
        </div>

        <button
          @click="saveChanges"
          class="w-full py-3 sm:py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20"
        >
          SAVE CHANGES
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
// Ensure the filename matches your actual file (pollStore.js)
import { usePollStore } from "@/stores/pollstore";
import { usePolls } from "@/composables/usePolls";

const route = useRoute();
const router = useRouter();
const store = usePollStore();
const { getPoll, update, remove } = usePolls();

const formData = reactive({
  id: "",
  title: "",
  description: "",
  startAt: "",
  endAt: "",
  candidates: [],
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

const addCandidate = () =>
  formData.candidates.push({
    id: "c-" + Math.random().toString(36).substr(2, 9),
    name: "",
    manifesto: "",
    votes: 0,
    image: null,
  });
const removeCandidate = (idx) => formData.candidates.splice(idx, 1);

onMounted(() => {
  // getPoll is provided by the composable
  const poll = getPoll(route.params.id);
  if (poll) {
    // Fill the reactive form with existing poll data
    Object.assign(formData, {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      startAt: poll.startAt,
      endAt: poll.endAt,
      candidates: poll.candidates ? poll.candidates.map((c) => ({ ...c })) : [],
    });
  } else {
    router.push("/");
  }
});

const saveChanges = () => {
  // Use composable update
  update(route.params.id, { ...formData });
  router.push("/poll/" + route.params.id);
};

const handleDelete = () => {
  if (confirm("Permanently delete this poll and all its data?")) {
    remove(route.params.id);
    router.push("/");
  }
};
</script>
