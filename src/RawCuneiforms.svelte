<script>
  import { afterUpdate } from "svelte";
  import store from "./store.js";

  let rawString = "";

  const copyToClipboard = async () => {
    if (!navigator.clipboard) {
      try {
        document.execCommand("copy");
      } catch (error) {
        console.log("Unable to copy to clipboard!");
      }
    }

    try {
      await navigator.clipboard.writeText(rawString);
    } catch (error) {
      console.log("Unable to copy to clipboard!");
    }
  };

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
    if ($store.interpunct) {
      rawString = rawString.replace(" ", "᛫");
    }
  });
</script>

<style>
  .rendering {
    border: solid 2px white;
  }
</style>

{#if !!rawString}
  <div class="rendering is-size-4 cuneiform-sign">
    <div
      class="has-text-grey-light is-size-7"
      style="float:right;cursor:pointer"
      on:click={copyToClipboard}>
      copy
    </div>
    {rawString}
  </div>
{:else}
  <div>Cuneiform Rendering</div>
{/if}
