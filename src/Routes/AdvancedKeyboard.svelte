<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import store from "../store.js";
  import { monoconsonants as syllabary } from "../databases/syllabary.json";
  import { biconsonants } from "../databases/syllabary.json";
  import sumerianCuneiforms from "../databases/sumerianCuneiforms.json";
  import dictionary from "../databases/dictionary.json";

  let cuneiformSuggestions = [];
  let input = "";
  let cuneiforms = "";
  let transcription = [];
  let selectedCuneiform = 0;
  let charCorrespondences, unicodeCorrespondences;

  const processInput = event => {
    cuneiformSuggestions = [];
    let text = event.target.value.toLowerCase();
    // replaces unformated values
    charCorrespondences.forEach(pair => {
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
    } else if (/[a-z]+[0-9]+/.test(text)) {
      // checks if the input is not a sign with a number
      const entry = text.replace(/[0-9]+/, "");
      sumerianCuneiforms[entry].forEach(el => {
        if (el.value.toLowerCase() === text) {
          cuneiformSuggestions.push({
            sign: el.cuneiform,
            value: el.value
          });
        }
      });
    } else if (
      dictionary.hasOwnProperty(text[0]) &&
      dictionary[text[0]].hasOwnProperty(text)
    ) {
      cuneiformSuggestions.push({
        sign: dictionary[text[0]][text].cuneiform.sign,
        value: text
      });
    }
  };

  const transformInput = event => {
    if (event.key === "Enter") {
      // on Enter
      cuneiforms += cuneiformSuggestions[selectedCuneiform].sign;
      input = "";
      cuneiformSuggestions = [];
      selectedCuneiform = 0;
      makeTranscription(cuneiforms);
    } else if (event.key === "ArrowLeft" && selectedCuneiform > 0) {
      selectedCuneiform--;
    } else if (
      event.key === "ArrowRight" &&
      selectedCuneiform < cuneiformSuggestions.length - 1
    ) {
      selectedCuneiform++;
    }
  };

  const insertCuneiform = sign => {
    cuneiforms += sign;
    input = "";
    cuneiformSuggestions = [];
    selectedCuneiform = 0;
    makeTranscription(cuneiforms);
  };

  const makeTranscription = value => {
    const cuneiforms = Array.from(value);
    // gets unicode points of every character in the textarea
    const unicodePoints = cuneiforms.map(el => el.codePointAt(0).toString(16));
    if (unicodePoints.length > 0) {
      transcription = [];
      unicodePoints.forEach((unicode, i) => {
        // checks what kind of character it is and builds the transcription
        if (unicodeCorrespondences[unicode]) {
          const values = unicodeCorrespondences[unicode].map(sign => sign.sign);
          if (
            transcription.filter(el => el.cuneiform === cuneiforms[i])
              .length === 0
          ) {
            transcription.push({ cuneiform: cuneiforms[i], values });
          }
        }
      });
    }
  };

  onMount(() => {
    charCorrespondences = $store.charCorrespondences.filter(
      corr => !["â", "ê", "î", "û"].includes(corr.char)
    );
    // builds unicode correspondences dictionary
    unicodeCorrespondences = {};
    Object.keys(sumerianCuneiforms).forEach(key => {
      sumerianCuneiforms[key].forEach(sign => {
        if (!unicodeCorrespondences.hasOwnProperty(sign.unicode)) {
          unicodeCorrespondences[sign.unicode] = [];
        }

        unicodeCorrespondences[sign.unicode].push({
          sign: sign.value,
          cuneiform: sign.cuneiform
        });
      });
    });
  });
</script>

<style>
  .cuneiform-box {
    height: 400px;
  }

  .cuneiform-rendering {
    width: 100%;
    height: 70%;
  }

  .transcription {
    padding: 10px 0px;
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
    <h3 class="subtitle">Advanced</h3>
    <div class="buttons navigation">
      <button class="button is-link is-light" on:click={() => push('/')}>
        Classic
      </button>
      <button
        class="button is-warning is-light"
        on:click={() => push('/advanced')}>
        Advanced
      </button>
    </div>
    <div class="box cuneiform-box">
      <h4 class="title is-4">Cuneiforms</h4>
      <textarea
        class="textarea cuneiform-rendering cuneiform-sign is-size-4"
        bind:value={cuneiforms}
        on:input={event => makeTranscription(event.target.value)} />
      <div class="transcription has-text-left">
        {#each transcription as el}
          <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
              <button
                class="button"
                aria-haspopup="true"
                aria-controls="dropdown-cuneiform">
                <span class="cuneiform-sign is-size-5" style="margin-top:-3px">
                  {el.cuneiform}
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-cuneiform" role="menu">
              <div class="dropdown-content">
                {#each el.values as value}
                  <div class="dropdown-item is-size-7">{value}</div>
                {/each}
              </div>
            </div>
          </div>
          &nbsp;
        {:else}No text{/each}
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
