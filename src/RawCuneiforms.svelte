<script>
  import { afterUpdate } from "svelte";
  import store from "./store.js";

  let rawString = "";

  afterUpdate(() => {
    rawString = $store.input;
    for (let word in $store.words) {
      if ($store.words[word].syllables !== "ERROR") {
        // if word is a logogram
        if ($store.syllabogramsToSwitch.hasOwnProperty(word)) {
          const regex = new RegExp(word, "g");
          rawString = rawString.replace(
            regex,
            $store.syllabogramsToSwitch[word]
          );
        } else {
          const regex = new RegExp(word, "g");
          rawString = rawString.replace(
            regex,
            $store.words[word].cuneiforms
              .map(syll => syll.cuneiforms.map(el => el.sign).join(""))
              .join("")
          );
        }
      }
    }
  });
</script>

<style>
  .rendering {
    border: solid 2px white;
  }
</style>

{#if !!rawString}
  <div class="rendering is-size-4">{rawString}</div>
{:else}
  <div>Cuneiform Rendering</div>
{/if}
