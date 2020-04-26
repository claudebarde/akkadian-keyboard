<script>
  import store from "../store.js";
  import { monoconsonants as syllabary } from "../databases/syllabary.json";
  import { biconsonants } from "../databases/syllabary.json";
  import sumerianCuneiforms from "../databases/sumerianCuneiforms.json";

  let cuneiformSuggestions = [];
  let input = "";
  let cuneiforms = "";
  let selectedCuneiform = 0;

  const processInput = event => {
    cuneiformSuggestions = [];
    let text = event.target.value.toLowerCase();
    // replaces unformated values
    $store.charCorrespondences.forEach(pair => {
      const regex = new RegExp(`${pair.corr}`, "g");
      text = text.toLowerCase().replace(regex, pair.char);
    });
    input = text;
    // checks first if the input is in the syllabary
    if (syllabary[text]) {
      cuneiformSuggestions = [{ sign: syllabary[text].sign, value: text }];
    }
    // checks then if the input appears in the Sumerian cuneiforms
    if (sumerianCuneiforms[text]) {
      sumerianCuneiforms[text].forEach(el => {
        if (
          cuneiformSuggestions.filter(
            cun => cun.value.toLowerCase() === el.value.toLowerCase()
          ).length === 0
        ) {
          cuneiformSuggestions.push({
            sign: el.cuneiform,
            value: el.value
          });
        }
      });
    }
  };

  const transformInput = event => {
    if (event.key == "Enter") {
      // on Enter
      cuneiforms += cuneiformSuggestions[0].sign;
      input = "";
      cuneiformSuggestions = [];
      selectedCuneiform = 0;
    }
  };

  const insertCuneiform = sign => {
    cuneiforms += sign;
    input = "";
    cuneiformSuggestions = [];
    selectedCuneiform = 0;
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
      <input
        id="text-input"
        type="text"
        class="input is-large"
        on:input={processInput}
        on:keydown={transformInput}
        value={input} />
      <br />
      <br />
      <div class="buttons">
        {#each cuneiformSuggestions as sugg, index}
          <button
            class="button is-medium cuneiform-sign"
            class:is-focused={selectedCuneiform === index}
            on:click={() => {
              selectedCuneiform = index;
              insertCuneiform(sugg.sign);
              document.getElementById('text-input').focus();
            }}>
            <span>{sugg.sign}</span>
            <span class="is-size-7">({sugg.value.toUpperCase()})</span>
          </button>
        {:else}
          <button class="button is-medium is-static">No text</button>
        {/each}
      </div>
    </div>
  </div>
</div>
