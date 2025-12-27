import { computed } from "vue";
import { usePollStore } from "@/stores/pollstore";

export function useVoting() {
  const store = usePollStore();

  const rankCandidates = (pollId) => {
    const poll = store.getPollById(pollId);
    if (!poll) return [];
    return [...poll.candidates].sort((a, b) => b.votes - a.votes);
  };

  const hasVoted = (pollId, voterIdentifier) => {
    const poll = store.getPollById(pollId);
    if (!poll) return false;
    const voter = poll.voters.find((v) => v.identifier === voterIdentifier);
    return !!(voter && voter.hasVoted);
  };

  const cast = (pollId, candidateId, voterIdentifier, customWeight = 1) => {
    // Prevent double voting at composable level
    if (hasVoted(pollId, voterIdentifier)) return { success: false, error: "Voter has already voted" };

    store.addVoterToPoll(pollId, voterIdentifier); // ensure voter exists
    store.castVote(pollId, candidateId, voterIdentifier, customWeight);

    return { success: true };
  };

  const reset = (pollId, voterIdentifier) => store.resetUserVote(pollId, voterIdentifier);

  return {
    rankCandidates,
    hasVoted,
    cast,
    reset,
  };
}
