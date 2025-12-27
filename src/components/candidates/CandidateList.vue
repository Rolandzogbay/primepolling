<template>
  <div class="candidate-list">
    <CandidateCard
      v-for="c in candidates"
      :key="c.id"
      :candidate="c"
      @vote="$emit('vote', $event)"
    />
  </div>
</template>

<script>
import CandidateCard from "./CandidateCard.vue";
export default {
  name: "CandidateList",
  components: { CandidateCard },
  props: {
    candidates: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.candidate-list{display:flex;flex-direction:column;gap:8px}
</style>
