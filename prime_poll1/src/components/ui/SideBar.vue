<template>
  <aside
    ref="root"
    :aria-hidden="!open"
    :role="open ? 'dialog' : 'complementary'"
    :aria-modal="open ? 'true' : undefined"
    tabindex="-1"
    class="w-64 sm:w-72 bg-[#0F172A] flex flex-col h-screen sticky top-0 overflow-hidden text-gray-300"
  >
    <div
      class="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"
    ></div>

    <!-- Live region for screen reader announcements -->
    <div class="sr-only" aria-live="polite">{{ liveMessage }}</div>

    <div class="relative z-10 flex flex-col h-full">
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 sm:gap-3 min-w-0">
            <div class="relative group shrink-0">
              <div
                class="absolute -inset-1 bg-linear-to-r from-emerald-600 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000"
              ></div>
              <div
                class="relative w-8 sm:w-10 h-8 sm:h-10 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 shrink-0"
              >
                <svg
                  class="w-5 sm:w-6 h-5 sm:h-6 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <span
              class="text-base sm:text-2xl md:text-3xl lg:text-4xl font-family-mono font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white tracking-tight truncate"
            >
              PrimePoll
            </span>
          </div>


          <button
            v-if="open"
            @click="$emit('close')"
            ref="closeButton"
            class="md:hidden p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 transition transform duration-200 ease-out hover:scale-105 active:scale-95"
            aria-label="Close sidebar"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
        <section class="border-b border-t px-2 py-4 space-y-6">
          <div class="space-y-2">
            <router-link
              to="/"
              @click="handleNavClick"
              class="group nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              active-class="bg-emerald-500/10 text-emerald-400"
            >
              <i class="fas fa-th-large text-lg"></i>
              <span class="font-medium">Poll Dashboard</span>
            </router-link>

            <router-link
              to="/create"
              @click="handleNavClick"
              class="group nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              active-class="bg-emerald-500/10 text-emerald-400"
            >
              <i class="fas fa-plus-circle text-lg"></i>
              <span class="font-medium">Create New Poll</span>
            </router-link>

            <router-link
              to="/analytics"
              @click="handleNavClick"
              class="group nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              active-class="bg-emerald-500/10 text-emerald-400"
            >
              <i class="fas fa-chart-line text-lg"></i>
              <span class="font-medium">Voter Analytics</span>
            </router-link>
          </div>
        </section>

        <section class="border-b px-2 pb-4 space-y-6">
          <h3
            class="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4"
          >
            Live Monitoring
          </h3>
          <div class="space-y-1">
            <div
              class="filter-item cursor-pointer group flex items-center px-4 py-2 hover:bg-slate-800/50 rounded-lg transition-all"
            >
              <span
                class="w-2 h-2 rounded-full mr-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"
              ></span>
              <span class="flex-1 text-sm font-medium">Ongoing</span>
              <span
                class="bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md text-slate-300 border border-slate-700"
              >
                {{ ongoingAndActiveCount }}
              </span>
            </div>

            <div
              class="filter-item group cursor-pointer flex items-center px-4 py-2 hover:bg-slate-800/50 rounded-lg transition-all"
            >
              <span class="w-2 h-2 rounded-full mr-3 bg-amber-500"></span>
              <span class="flex-1 text-sm cursor-pointer font-medium"
                >Upcoming</span
              >
              <span
                class="bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md text-slate-300 border border-slate-700"
              >
                {{ store.upcomingPolls?.length || 0 }}
              </span>
            </div>

            <div
              class="filter-item group cursor-pointer flex items-center px-4 py-2 hover:bg-slate-800/50 rounded-lg transition-all"
            >
              <span class="w-2 h-2 rounded-full mr-3 bg-slate-600"></span>
              <span class="flex-1 text-sm font-medium">History/Full</span>
              <span
                class="bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md text-slate-300 border border-slate-700"
              >
                {{ historyAndCompletedCount }}
              </span>
            </div>
          </div>
        </section>

        <section>
          <div class="space-y-2">
            <router-link
              to="/manage"
              @click="handleNavClick"
              class="group nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              active-class="bg-emerald-500/10 text-emerald-400"
            >
              <i class="fas fa-users-cog text-lg"></i>
              <span class="font-medium">User Registry</span>
            </router-link>
            <router-link
              to="/settings"
              @click="handleNavClick"
              class="group nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              active-class="bg-emerald-500/10 text-emerald-400"
            >
              <i class="fas fa-cog text-lg"></i>
              <span class="font-medium">Global Settings</span>
            </router-link>
          </div>
        </section>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, watch, nextTick, onBeforeUnmount } from "vue";
import { usePollStore } from "@/stores/pollstore";

const props = defineProps({ open: Boolean });
const emit = defineEmits(["close"]);

const store = usePollStore();
const root = ref(null);
const closeButton = ref(null);
const liveMessage = ref("");

const focusableSelectors =
  'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

const handleKeydown = (e) => {
  if (!props.open) return;

  if (e.key === "Escape") {
    emit("close");
    return;
  }

  if (e.key === "Tab") {
    const focusable = root.value
      ? Array.from(root.value.querySelectorAll(focusableSelectors))
      : [];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  }
};

watch(
  () => props.open,
  async (val) => {
    // Announce the change for screen readers
    liveMessage.value = val ? "Sidebar opened" : "Sidebar closed";

    if (val) {
      await nextTick();
      // Focus the close button or first focusable element
      setTimeout(() => {
        const focusable = root.value
          ? root.value.querySelectorAll(focusableSelectors)
          : [];
        if (focusable.length) focusable[0].focus();
      }, 0);
      document.addEventListener("keydown", handleKeydown);
      document.body.style.overflow = "hidden";
      // Clear live message after a brief delay so it doesn't read repeatedly
      setTimeout(() => {
        liveMessage.value = "";
      }, 1500);
    } else {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
      setTimeout(() => {
        liveMessage.value = "";
      }, 1500);
    }
  }
);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});

const isPollDone = (poll) => {
  const total = poll.voters?.length || 0;
  const voted = poll.voters?.filter((v) => v.hasVoted).length || 0;
  return total > 0 && voted >= total;
};

const ongoingAndActiveCount = computed(() => {
  const now = new Date();
  return store.polls.filter((p) => {
    const isPast = new Date(p.endAt) <= now;
    const isFuture = new Date(p.startAt) > now;
    return !isPast && !isFuture && !isPollDone(p);
  }).length;
});

const historyAndCompletedCount = computed(() => {
  const now = new Date();
  return store.polls.filter((p) => {
    const isPast = new Date(p.endAt) <= now;
    return isPast || isPollDone(p);
  }).length;
});

// Close the mobile sidebar when a nav link is clicked
const handleNavClick = () => {
  if (props.open) emit("close");
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
.font-family-mono {
  font-family: "Ubuntu", sans-serif;
}
</style>
