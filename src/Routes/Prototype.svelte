<script>
  import store from "../store.js";
  import { monoconsonants as syllabary } from "../databases/syllabary.json";
  import { biconsonants } from "../databases/syllabary.json";

  let cuneiformSuggestions = [];
  let input = "";
  let cuneiforms = "";
  let selectedCuneiform = 0;

  const processInput = event => {
    let text = event.target.value;
    // replaces unformated values
    $store.charCorrespondences.forEach(pair => {
      const regex = new RegExp(`${pair.corr}`, "g");
      text = text.toLowerCase().replace(regex, pair.char);
    });
    input = text;
    if (syllabary[input]) {
      cuneiformSuggestions = [syllabary[input].sign];
    } else {
      cuneiformSuggestions = [];
    }
  };

  const transformInput = event => {
    if (event.key == "Enter") {
      // on Enter
      cuneiforms += cuneiformSuggestions[0];
      input = "";
      cuneiformSuggestions = [];
    } else if (event.key === "Backspace") {
      // on Backspace
      console.log("Backspace");
    }
  };
</script>

<style>
  .cuneiform-box {
    height: 300px;
    overflow: auto;
  }
</style>

<div class="image is-64x64 top-left-corner is-hidden-touch">
  <img src="logo.png" alt="logo" />
</div>
<div class="top-right-corner is-hidden-touch">
  <div class="image is-28x28">
    <a
      href="https://docs.google.com/forms/d/e/1FAIpQLSfbvc2XGv0ePLXQsrYUAVecO72dc6UYDojAC7W6cV3nVoVjGA/viewform"
      target="_blank"
      rel="noopener noreferrer">
      <img src="mail.svg" alt="contact" />
    </a>
  </div>
  <div class="image is-28x28">
    <a
      href="https://github.com/claudebarde/akkadian-keyboard"
      target="_blank"
      rel="noopener noreferrer">
      <img src="github.svg" alt="github" />
    </a>
  </div>
</div>
<div class="bottom-right-corner is-hidden-touch">
  v {$store.version} - Claude Barde 2020
</div>
<div class="columns">
  <div class="column is-three-fifths is-offset-one-fifth has-text-centered">
    <h1 class="title">Akkadian Keyboard</h1>
    <h3 class="subtitle">Prototype</h3>
    <div class="box cuneiform-box">
      <h4 class="title is-4">Cuneiforms</h4>
      <div class="cuneiform-rendering cuneiform-sign is-size-4 has-text-left">
        {cuneiforms}
      </div>
    </div>
    <div class="box cuneiform-input">
      <div class="buttons">
        {#each cuneiformSuggestions as sugg, index}
          <button
            class="button is-medium cuneiform-sign"
            class:is-focused={selectedCuneiform === index}
            on:click={() => (selectedCuneiform = index)}>
            {sugg}
          </button>
        {:else}
          <button class="button is-medium is-static">No text</button>
        {/each}
      </div>
      <input
        type="text"
        class="input is-large"
        on:input={processInput}
        on:keydown={transformInput}
        value={input} />
    </div>
  </div>
</div>
