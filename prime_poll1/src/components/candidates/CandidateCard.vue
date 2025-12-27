<template>
  <div class="candidate-card">
    <div class="avatar">
      <img v-if="candidate.image" :src="candidate.image" :alt="candidate.name" />
      <div v-else class="initials">{{ initials }}</div>
    </div>

    <div class="meta">
      <h4 class="name">{{ candidate.name }}</h4>
      <p class="manifesto" v-if="candidate.manifesto">{{ candidate.manifesto }}</p>
    </div>

    <div class="actions">
      <span class="votes">{{ candidate.votes || 0 }} votes</span>
      <button class="vote-btn" @click="$emit('vote', candidate.id)">Vote</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CandidateCard",
  props: {
    candidate: {
      type: Object,
      required: true,
    },
  },
  computed: {
    initials() {
      return (this.candidate.name || "").split(" ").map(n => n[0]).slice(0,2).join("");
    }
  }
};
</script>

<style scoped>
.candidate-card{display:flex;align-items:center;gap:12px;padding:8px;border-radius:6px;background:var(--card-bg,#111);color:#fff}
.avatar img{width:48px;height:48px;border-radius:50%;object-fit:cover}
.avatar .initials{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#333}
.meta{flex:1}
.actions{display:flex;flex-direction:column;align-items:flex-end}
.vote-btn{background:var(--brand-color,#10b981);border:none;color:white;padding:6px 10px;border-radius:4px;cursor:pointer}
</style>
