import { computed } from "vue";
import { usePollStore } from "@/stores/pollstore";

export function usePolls() {
  const store = usePollStore();

  const allPolls = computed(() => store.polls);

  // `getPollById` is exposed as a function on the store, call it directly
  const getPoll = (id) => store.getPollById(id);

  const create = (pollData) => store.createPoll(pollData);

  const update = (id, data) => store.updatePoll(id, data);

  const remove = (id) => store.deletePoll(id);

  const importFromJson = (json) => store.importData(json);

  const clearAll = () => store.clearAllData();

  return {
    allPolls,
    getPoll,
    create,
    update,
    remove,
    importFromJson,
    clearAll,
  };
}
