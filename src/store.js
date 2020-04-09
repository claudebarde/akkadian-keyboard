import { writable } from "svelte/store";

const store = () => {
  const { subscribe, set, update } = writable({ input: "", words: {} });

  return {
    subscribe,
    updateInput: (input) => {
      update((currentStore) => ({ ...currentStore, input }));
    },
    /*updateWords: (words) => {
      update((currentStore) => ({
        ...currentStore,
        words: Object.fromEntries(words.map((word) => [word, {}])),
      }));
    },*/
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
  };
};

export default store();
