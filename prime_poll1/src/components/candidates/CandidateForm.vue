<template>
  <form @submit.prevent="submit">
    <div class="field">
      <label>Name</label>
      <input v-model="local.name" required />
    </div>

    <div class="field">
      <label>Manifesto</label>
      <input v-model="local.manifesto" />
    </div>

    <div class="field">
      <label>Image</label>
      <input type="file" accept="image/*" @change="handleFile" />
    </div>

    <div class="actions">
      <button type="submit">Add</button>
    </div>
  </form>
</template>

<script>
import { reactive } from "vue";
export default {
  name: "CandidateForm",
  emits: ["add"],
  setup(_, { emit }) {
    const local = reactive({ name: "", manifesto: "", image: null });

    const handleFile = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        local.image = reader.result;
      };
      reader.readAsDataURL(file);
    };

    const submit = () => {
      if (!local.name) return;
      emit("add", { name: local.name, manifesto: local.manifesto, image: local.image });
      local.name = "";
      local.manifesto = "";
      local.image = null;
    };

    return { local, handleFile, submit };
  },
};
</script>

<style scoped>
.field{display:flex;flex-direction:column;margin-bottom:8px}
.actions{display:flex;justify-content:flex-end}
button{background:var(--brand-color,#10b981);color:white;border:none;padding:6px 10px;border-radius:4px}
</style>
