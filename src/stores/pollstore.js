import { defineStore } from "pinia";
import { ref, computed, watch, onMounted } from "vue";

export const usePollStore = defineStore("pollStore", () => {
  // --- STATE ---
  const polls = ref([]);

  // UPDATED: Added themeMode to the settings object
  const settings = ref(
    JSON.parse(localStorage.getItem("vuepoint_settings")) || {
      autoArchive: true,
      maintenanceMode: false,
      observerMode: false,
      primaryColor: "#10b981", // Default Emerald
      themeMode: "dark",       // New: "light" or "dark"
      weightedVoting: false,
    }
  );

  const currentTime = ref(new Date());

  // --- PERSISTENCE LOGIC ---

  // Load Polls from LocalStorage
  const savedPolls = localStorage.getItem("vuepoint_polls");
  if (savedPolls) polls.value = JSON.parse(savedPolls);

  // Watcher for Polls
  watch(
    polls,
    (newPolls) => {
      localStorage.setItem("vuepoint_polls", JSON.stringify(newPolls));
    },
    { deep: true }
  );

  // Watcher for Settings (Handles Theme Color, Theme Mode & LocalStorage)
  watch(
    settings,
    (newSettings) => {
      localStorage.setItem("vuepoint_settings", JSON.stringify(newSettings));
      
      // 1. Apply the brand color globally
      document.documentElement.style.setProperty(
        "--brand-color",
        newSettings.primaryColor
      );

      // 2. Apply the Theme Mode (injects 'light' or 'dark' into the <html> tag)
      document.documentElement.setAttribute("data-theme", newSettings.themeMode);
      
      // Optional: If you use Tailwind's 'class' strategy for dark mode
      if (newSettings.themeMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    { deep: true, immediate: true }
  );

  onMounted(() => {
    setInterval(() => {
      currentTime.value = new Date();
    }, 60000);
  });

  // --- GETTERS ---
  const getPollById = computed(() => (id) => {
    return polls.value.find((poll) => poll.id === id);
  });

  const ongoingPolls = computed(() => {
    return polls.value.filter(
      (p) =>
        new Date(p.startAt) <= currentTime.value &&
        new Date(p.endAt) >= currentTime.value
    );
  });

  const upcomingPolls = computed(() => {
    return polls.value.filter((p) => new Date(p.startAt) > currentTime.value);
  });

  const endedPolls = computed(() => {
    return polls.value.filter((p) => new Date(p.endAt) < currentTime.value);
  });

  const activeWorkspace = computed(() => {
    return [...ongoingPolls.value, ...upcomingPolls.value];
  });

  const totalVotersCount = computed(() => {
    return polls.value.reduce((acc, poll) => {
      const votedInThisPoll = poll.voters
        ? poll.voters.filter((v) => v.hasVoted).length
        : 0;
      return acc + votedInThisPoll;
    }, 0);
  });

  // --- ACTIONS ---

  const clearAllData = () => {
    if (confirm("Are you sure you want to wipe all polls and settings?")) {
      polls.value = [];
      localStorage.removeItem("vuepoint_polls");
      localStorage.removeItem("vuepoint_settings");
      window.location.reload();
    }
  };

  const toggleAutoArchive = () => {
    settings.value.autoArchive = !settings.value.autoArchive;
  };

  const importData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        polls.value = parsed;
        return { success: true };
      }
      return { success: false, error: "Invalid format" };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const createPoll = (pollData) => {
    const newPoll = {
      ...pollData,
      id: pollData.id || crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      voters: pollData.voters || [],
      candidates: (pollData.candidates || []).map((c) => ({
        id: c.id || crypto.randomUUID(),
        votes: c.votes || 0,
        name: c.name,
        manifesto: c.manifesto,
        image: c.image || null,
      })),
    };
    polls.value.push(newPoll);
  };

  const updatePoll = (id, updatedData) => {
    const index = polls.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      polls.value[index] = { ...polls.value[index], ...updatedData };
    }
  };

  const deletePoll = (id) => {
    polls.value = polls.value.filter((p) => p.id !== id);
  };

  const castVote = (pollId, candidateId, voterIdentifier, customWeight = 1) => {
    const poll = polls.value.find((p) => p.id === pollId);
    if (!poll) return;

    const candidate = poll.candidates.find((c) => c.id === candidateId);
    const voter = poll.voters.find((v) => v.identifier === voterIdentifier);

    if (candidate && voter && !voter.hasVoted) {
      const voteWeight = settings.value.weightedVoting ? customWeight : 1;
      candidate.votes += voteWeight;
      voter.hasVoted = true;
      voter.votedFor = candidateId;
      voter.appliedWeight = voteWeight;
    }
  };

  const resetUserVote = (pollId, voterIdentifier) => {
    const poll = polls.value.find((p) => p.id === pollId);
    if (!poll) return;

    const voter = poll.voters.find((v) => v.identifier === voterIdentifier);

    if (voter && voter.hasVoted) {
      const candidate = poll.candidates.find((c) => c.id === voter.votedFor);
      if (candidate) {
        candidate.votes -= voter.appliedWeight || 1;
      }
      voter.hasVoted = false;
      voter.votedFor = null;
      voter.appliedWeight = null;
    }
  };

  const removeVoter = (pollId, voterIdentifier) => {
    const poll = polls.value.find((p) => p.id === pollId);
    if (poll) {
      const voter = poll.voters.find((v) => v.identifier === voterIdentifier);
      if (voter && voter.hasVoted) {
        const candidate = poll.candidates.find((c) => c.id === voter.votedFor);
        if (candidate) candidate.votes -= voter.appliedWeight || 1;
      }
      poll.voters = poll.voters.filter((v) => v.identifier !== voterIdentifier);
    }
  };

  const addVoterToPoll = (pollId, voterIdentifier) => {
    const poll = polls.value.find((p) => p.id === pollId);
    if (poll) {
      const exists = poll.voters.some((v) => v.identifier === voterIdentifier);
      if (!exists) {
        poll.voters.push({
          identifier: voterIdentifier,
          hasVoted: false,
          votedFor: null,
          appliedWeight: null,
        });
      }
    }
  };

  return {
    polls,
    ongoingPolls,
    upcomingPolls,
    endedPolls,
    activeWorkspace,
    settings,
    totalVotersCount,
    getPollById,
    importData,
    clearAllData,
    toggleAutoArchive,
    createPoll,
    updatePoll,
    deletePoll,
    castVote,
    resetUserVote,
    removeVoter,
    addVoterToPoll,
  };
});