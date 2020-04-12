<script>
  import store from "./store.js";

  export let word, newLinesPos, wordPos;

  let displayBadge = false;
</script>

<style>
  .cuneiform-word {
    padding: 0px;
    border: solid 2px transparent;
    border-radius: 10px;
    white-space: nowrap;
    transition: 0.4s;
  }

  .cuneiform-word:hover {
    border: solid 2px orange;
  }
</style>

<span
  class={`cuneiform-sign cuneiform-word is-size-4 ${displayBadge ? 'has-badge-rounded has-badge-large has-badge-warning' : ''}`}
  data-badge={displayBadge ? word : undefined}
  on:mouseover={() => (displayBadge = true)}
  on:mouseout={() => (displayBadge = false)}>
  {#if Object.keys($store.syllabogramsToSwitch).includes(word)}
    <span class="has-tooltip-top" data-tooltip={word}>
      {$store.syllabogramsToSwitch[word]}
    </span>
  {:else}
    {#each $store.words[word].cuneiforms as symbol}
      <span class="has-tooltip-top" data-tooltip={symbol.syllable}>
        {#each symbol.cuneiforms as cuneiform}{cuneiform.sign}{/each}
      </span>
    {:else}Ø{/each}
  {/if}
</span>
{#if newLinesPos.includes(wordPos)}
  <br />
{/if}
