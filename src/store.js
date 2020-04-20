import { writable } from "svelte/store";

const store = () => {
  const { subscribe, set, update } = writable({
    input: "",
    words: {},
    suggestions: [],
    stressedWords: [],
    syllabogramsToSwitch: {},
    doubleLongVowels: true,
  });

  return {
    subscribe,
    updateInput: (input) => {
      update((currentStore) => ({ ...currentStore, input }));
    },
    resetWords: () => {
      update((currentStore) => ({ ...currentStore, words: {} }));
    },
    updateSyllables: (syllables) => {
      update((currentStore) => ({
        ...currentStore,
        words: Object.fromEntries(
          syllables.map((el) => [
            el.word,
            {
              syllableCount: el.syllableCount,
              syllables: el.syllables,
              position: el.position,
            },
          ])
        ),
      }));
    },
    updateCuneiforms: (cuneiforms) => {
      update((currentStore) => {
        let newWords = { ...currentStore.words };
        cuneiforms.forEach((el) => {
          newWords[el.word] = {
            ...newWords[el.word],
            cuneiforms: el.cuneiforms,
          };
        });

        return { ...currentStore, words: newWords };
      });
    },
    addSuggestion: (sugg) => {
      update((currentStore) => ({
        ...currentStore,
        suggestions: [...currentStore.suggestions, sugg],
      }));
    },
    removeSuggestion: (sugg, type) => {
      update((currentStore) => ({
        ...currentStore,
        suggestions: currentStore.suggestions.filter(
          (el) => el.word !== sugg || el.type !== type
        ),
      }));
    },
    updateStressedWords: (words) => {
      update((currentStore) => ({ ...currentStore, stressedWords: words }));
    },
    addLogogram: (logogram) => {
      update((currentStore) => ({
        ...currentStore,
        syllabogramsToSwitch: {
          ...currentStore.syllabogramsToSwitch,
          [logogram.word]: logogram.sign,
        },
        suggestions: [
          ...currentStore.suggestions.filter((el) => el.word !== logogram.word),
        ],
      }));
    },
    updateLongVowelDisplay: () => {
      update((currentStore) => ({
        ...currentStore,
        doubleLongVowels: !currentStore.doubleLongVowels,
      }));
    },
  };
};

export default store();
