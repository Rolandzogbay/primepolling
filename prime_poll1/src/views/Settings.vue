<template>
  <div class="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
    
    <header class="pb-6 border-b border-slate-800/50">
      <h1 class="text-4xl font-black text-white tracking-tight">
        App <span :style="{ color: store.settings.primaryColor }">Settings</span>
      </h1>
      <p class="text-slate-500 mt-2 font-medium">Configure system preferences and data management.</p>
    </header>

    <div class="space-y-6">
      
      <section class="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
        <div class="p-8 border-b border-slate-800 bg-slate-950/30">
          <h2 class="text-xl font-bold text-white flex items-center gap-3">
            <i class="fas fa-palette" :style="{ color: store.settings.primaryColor }"></i>
            Interface & Branding
          </h2>
        </div>

        <div class="p-8 space-y-6">
          <div class="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800">
            <div>
              <h3 class="text-white font-bold text-sm">Brand Accent Color</h3>
              <p class="text-slate-500 text-xs">Personalize the primary highlight color of the platform.</p>
            </div>
            <div class="flex gap-2">
              <button v-for="color in ['#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b']" 
                :key="color" 
                @click="store.settings.primaryColor = color"
                :style="{ backgroundColor: color }"
                class="w-8 h-8 rounded-full border-4 border-slate-900 transition-transform hover:scale-110 shadow-lg"
                :class="{ 'ring-2 ring-white scale-110': store.settings.primaryColor === color }">
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800">
            <div class="flex gap-4 items-center">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/10 text-purple-500">
                <i class="fas fa-eye-slash"></i>
              </div>
              <div>
                <h3 class="text-white font-bold text-sm">Observer Mode</h3>
                <p class="text-slate-500 text-xs">Mask Voter IDs and hide live results for public presentations.</p>
              </div>
            </div>
            <button 
              @click="store.settings.observerMode = !store.settings.observerMode"
              :class="store.settings.observerMode ? 'bg-purple-600' : 'bg-slate-700'"
              class="w-14 h-7 rounded-full relative transition-colors duration-200 p-1"
            >
              <div :class="store.settings.observerMode ? 'translate-x-7' : 'translate-x-0'"
                class="w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm"></div>
            </button>
          </div>
        </div>
      </section>

      <section class="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
        <div class="p-8 border-b border-slate-800 bg-slate-950/30">
          <h2 class="text-xl font-bold text-white flex items-center gap-3">
            <i class="fas fa-gavel" :style="{ color: store.settings.primaryColor }"></i>
            Governance Logic
          </h2>
        </div>
        <div class="p-8">
          <div class="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800">
            <div class="flex gap-4 items-center">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500">
                <i class="fas fa-balance-scale"></i>
              </div>
              <div>
                <h3 class="text-white font-bold text-sm">Weighted Voting</h3>
                <p class="text-slate-500 text-xs">Enable voting power based on custom weight attributes.</p>
              </div>
            </div>
            <button 
              @click="store.settings.weightedVoting = !store.settings.weightedVoting"
              :class="store.settings.weightedVoting ? 'bg-amber-600' : 'bg-slate-700'"
              class="w-14 h-7 rounded-full relative transition-colors duration-200 p-1"
            >
              <div :class="store.settings.weightedVoting ? 'translate-x-7' : 'translate-x-0'"
                class="w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm"></div>
            </button>
          </div>
        </div>
      </section>

      <section class="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
        <div class="p-8 border-b border-slate-800 bg-slate-950/30">
          <h2 class="text-xl font-bold text-white flex items-center gap-3">
            <i class="fas fa-database" :style="{ color: store.settings.primaryColor }"></i>
            Data Management
          </h2>
        </div>

        <div class="p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl space-y-4">
              <div class="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                <i class="fas fa-file-export"></i>
              </div>
              <h3 class="text-white font-bold">Export Backup</h3>
              <p class="text-slate-500 text-xs">Save all current polls and voters to a local file.</p>
              <button @click="exportData" class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all">
                Download JSON
              </button>
            </div>

            <div class="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl space-y-4">
              <div class="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
                <i class="fas fa-file-import"></i>
              </div>
              <h3 class="text-white font-bold">Restore Data</h3>
              <p class="text-slate-500 text-xs">Upload a backup file to restore your database.</p>
              <input type="file" ref="fileInput" @change="handleFileUpload" class="hidden" accept=".json">
              <button @click="$refs.fileInput.click()" class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all">
                Upload Backup
              </button>
            </div>
          </div>

          <div class="h-px bg-slate-800"></div>

          <div class="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800">
            <div>
              <h3 class="text-white font-bold text-sm">Auto-Archive Polls</h3>
              <p class="text-slate-500 text-xs">Move finished polls to history automatically.</p>
            </div>
            <button 
              @click="store.toggleAutoArchive()"
              :class="store.settings?.autoArchive ? 'bg-emerald-600' : 'bg-slate-700'"
              class="w-14 h-7 rounded-full relative transition-colors duration-200 p-1"
            >
              <div :class="store.settings?.autoArchive ? 'translate-x-7' : 'translate-x-0'"
                class="w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm"></div>
            </button>
          </div>

          <div class="flex items-center justify-between gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
            <div>
              <h3 class="text-red-500 font-bold text-sm">Nuclear Option</h3>
              <p class="text-slate-500 text-xs">Permanently wipe the entire local database.</p>
            </div>
            <button @click="handleNuclearReset" class="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs transition-all">
              RESET SYSTEM
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
  
import { ref } from 'vue';
import { usePollStore } from '@/stores/pollstore';

const store = usePollStore();
const fileInput = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const result = store.importData(e.target.result);
    if (result.success) {
      alert("Data successfully restored!");
      window.location.reload();
    } else {
      alert("Error: " + result.error);
    }
  };
  reader.readAsText(file);
};

const handleNuclearReset = () => {
  if (confirm("DANGER: This will delete ALL polls. This cannot be undone.")) {
    const confirmText = prompt("Type 'DELETE' to confirm.");
    if (confirmText === 'DELETE') {
      store.clearAllData();
      window.location.reload();
    }
  }
};

const exportData = () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.polls));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `vuepoint_backup_${new Date().toLocaleDateString()}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};
</script>
