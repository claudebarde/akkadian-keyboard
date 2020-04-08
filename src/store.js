import { writable } from "svelte/store";

const store = () => {
  const { subscribe, set, update } = writable({ input: "" });

  return {
    subscribe,
    updateInput: (input) => {
      update((currentStore) => ({ ...currentStore, input }));
    },
  };
};

export default store();
