<template>
  <div class="flex h-screen bg-[#020617] overflow-hidden text-slate-200">
    <!-- Desktop / Tablet sidebar (visible from md and up) -->
    <SideBar class="hidden md:flex shrink-0" />

    <!-- Mobile sidebar overlay (shown when `sidebarOpen` is true) -->
    <transition name="slide">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-40 md:hidden"
        role="presentation"
      >
        <!-- backdrop -->
        <div
          class="absolute inset-0 bg-black/40"
          @click="sidebarOpen = false"
        ></div>
        <!-- sidebar panel -->
        <div class="relative h-full z-10">
          <SideBar :open="sidebarOpen" @close="sidebarOpen = false" />
        </div>
      </div>
    </transition>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <AppNavBar
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        :sidebar-open="sidebarOpen"
      />

      <main
        class="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 md:p-6 lg:p-10 bg-slate-950/50"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <div :key="$route.path">
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppNavBar from "./components/ui/AppNavBar.vue";
import SideBar from "./components/ui/SideBar.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";

const sidebarOpen = ref(false);

const onKeydown = (e) => {
  if (e.key === "Escape" && sidebarOpen.value) sidebarOpen.value = false;
};

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<style>
/* Custom Scrollbar for the dark theme */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Slide-in for mobile sidebar */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from {
  transform: translateX(-12px);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(-12px);
  opacity: 0;
}
</style>
