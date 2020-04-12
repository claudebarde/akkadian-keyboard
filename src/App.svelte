<script>
  import insertTextAtCursor from "insert-text-at-cursor";
  import { onMount } from "svelte";
  import syllableParser from "./utils/syllableParser.js";
  import cuneiformsGenerator from "./utils/cuneiformsGenerator.js";
  import dictionarySearch from "./utils/dictionarySearch.js";
  import stressMarker from "./utils/stressMarker.js";
  import store from "./store.js";
  import CuneiformWord from "./CuneiformWord.svelte";

  let newLinesPos = [];
  let textareaRef;

  $: if ($store.input.length === 0) {
    newLinesPos = [];
    store.resetWords();
  }

  let charCorrespondences = [
    { char: "š", corr: "sh" },
    { char: "ṣ", corr: "s'" },
    { char: "ṭ", corr: "t'" },
    { char: "ḫ", corr: "kh" },
    { char: "ā", corr: "aa" },
    { char: "ē", corr: "ee" },
    { char: "ī", corr: "ii" },
    { char: "ū", corr: "uu" },
    { char: "â", corr: "3" },
    { char: "ê", corr: "4" },
    { char: "î", corr: "7" },
    { char: "û", corr: "8" }
  ];

  const processInput = event => {
    let parsedSyllables, cuneiforms;
    let text = event.target.value;
    // replaces unformated values
    charCorrespondences.forEach(pair => {
      const regex = new RegExp(`${pair.corr}`, "g");
      text = text.toLowerCase().replace(regex, pair.char);
    });
    // updates input
    store.updateInput(text);
    // removes all punctuation
    text = text.trim().replace(/[.,\/\?#!$%\^&\*;:{}=\-_`~()]/g, "");
    // calculates new lines positions in textarea to insert <br> in cuneiforms rendering
    const lines = text.split(/[\r\n]/);
    newLinesPos = [];
    if (lines.length > 1) {
      // found new line(s)
      lines.forEach(str => {
        const lastPos = str.split(/ +/g).length;
        newLinesPos =
          newLinesPos.length === 0
            ? [lastPos]
            : [...newLinesPos, lastPos + newLinesPos[newLinesPos.length - 1]];
      });
    }
    const words = text.split(/\s/g);
    // parses syllables
    parsedSyllables = words.map((word, index) => syllableParser(word, index));
    // generates cuneiforms
    cuneiforms = parsedSyllables.map(syllables => ({
      word: syllables.word,
      cuneiforms: cuneiformsGenerator(syllables.syllables)
    }));
    store.updateSyllables(parsedSyllables);
    store.updateCuneiforms(cuneiforms);
    // search words in dictionary
    words.forEach(word => {
      const searchWords = dictionarySearch(word);
      if (searchWords.entry) {
        // prevents double entries
        if (
          !$store.suggestions.filter(
            sugg => sugg.word === searchWords.word && sugg.type === "dictionary"
          ).length
        ) {
          store.addSuggestion({
            ...searchWords,
            text: `<span>${searchWords.word}</span><br/>${
              searchWords.info ? searchWords.info.text + "<br/>" : ""
            }<span class="cuneiform-sign">${
              searchWords.entry.cuneiform.sign
            }</span>`,
            type: "dictionary"
          });
        }
      }
    });
    // cleans up suggestions that are not in the text anymore
    $store.suggestions.map(sugg => {
      if (sugg.type === "dictionary" && !words.includes(sugg.word)) {
        store.removeSuggestion(sugg.word, "dictionary");
      }
    });
    // creates stress markers for words
    const stressedWords = Object.keys($store.words).map(word =>
      stressMarker(word, $store.words[word])
    );
    store.updateStressedWords(stressedWords);
  };

  const displayStress = word => {
    if (word.stressPosition === undefined) return "---";

    return (
      word.word.slice(0, word.stressPosition) +
      "<strong><u>" +
      word.word[word.stressPosition] +
      "</u></strong>" +
      word.word.slice(word.stressPosition + 1)
    );
  };

  const addLogogram = info => {
    if (info.baseForm) {
      store.addLogogram({ word: info.word, sign: info.entry.cuneiform.sign });
    }
  };

  onMount(() => {
    textareaRef = document.getElementById("textarea-input");
  });

  /*
ana šēpī ša dayyānim šuāti
eli ḫarrānim šuāti
kīma šakānim ša mātim šuāti
kišādum ša kalbim šuāti
ana nakirim ṣabtim šuāšim
kakkum šū
nārum šaplûm šī
ana napištim šuāšim
ištu bītātim šuāti
itti ṭuppātim šaṭrātim šuati
  */
</script>

<style>
  .input {
    width: 100%;
    min-height: 200px;
    margin-bottom: 20px;
  }

  .latin-code {
    padding-left: 5px;
  }

  .cuneiforms {
    min-height: 80px;
    line-height: 2 !important;
  }

  .top-left-corner {
    position: fixed;
    top: 10px;
    left: 10px;
  }
  .top-right-corner {
    position: fixed;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: row;
  }
  .top-right-corner div {
    padding: 0px 10px;
  }
  .bottom-right-corner {
    position: fixed;
    bottom: 10px;
    right: 10px;
    font-size: 0.5rem;
  }

  .mobile-links {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .mobile-links div {
    margin: 0px 5px;
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
<div class="bottom-right-corner is-hidden-touch">Claude Barde 2020</div>
<div class="columns">
  <div class="column is-three-fifths is-offset-one-fifth has-text-centered">
    <h1 class="title">Akkadian Keyboard</h1>
    <textarea
      class="input"
      id="textarea-input"
      on:input={processInput}
      value={$store.input}
      placeholder="Type your text here" />
    <div class="tabs is-toggle is-centered is-small ">
      <ul>
        {#each charCorrespondences as chars}
          <li
            class="has-background-white"
            on:click={() => insertTextAtCursor(textareaRef, chars.char)}>
            <a href="#">
              {chars.char}
              <span class="latin-code is-size-7">({chars.corr})</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
    <div class="box">
      <div class="columns">
        <div class="column is-one-fifth">
          <table class="table">
            <tbody>
              {#each $store.suggestions as sugg}
                <tr>
                  {#if sugg.type === 'dictionary'}
                    <td
                      class="is-size-7"
                      style={sugg.baseForm ? 'cursor:pointer' : 'cursor: not-allowed'}
                      on:click={() => addLogogram(sugg)}>
                      {@html sugg.text}
                    </td>
                  {:else}
                    <td class="is-size-7">
                      {@html sugg.text}
                    </td>
                  {/if}
                </tr>
              {:else}
                <tr>
                  <td>...</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="column is-four-fifths cuneiforms has-text-left">
          {#each $store.input
            .trim()
            .replace(/[.,\/\?#!$%\^&\*;:{}=\-_`~()]/g, '')
            .split(/\s+/)
            .filter(el => el) as word}
            {#if $store.words[word].syllables !== 'ERROR'}
              <CuneiformWord {word} {newLinesPos} />
            {:else}Ø{/if}
          {:else}
            <span>Cuneiform Rendering</span>
          {/each}
        </div>
      </div>
    </div>
    <div class="box">
      <h3 class="subtitle">Stress:</h3>
      <div>
        {#each $store.stressedWords as word, index}
          <span>
            {@html displayStress(word).trim()}
          </span>
          {#if index < $store.stressedWords.length - 1}-&nbsp;{/if}
        {:else}No input{/each}
      </div>
    </div>
    <div class="box">
      <h3 class="subtitle">Information:</h3>
      <div class="columns is-multiline">
        {#each Object.keys($store.words) as word}
          <div class="column is-half">
            <table
              class="table is-bordered is-striped is-narrow is-hoverable
              is-fullwidth">
              <tbody>
                <tr>
                  <td>Word</td>
                  <td>{word}</td>
                </tr>
                <tr>
                  <td>Syllable Count</td>
                  <td>{$store.words[word].syllableCount}</td>
                </tr>
                <tr>
                  <td>Syllables</td>
                  <td>
                    {$store.words[word].syllables === 'ERROR' ? 'ERROR' : $store.words[word].syllables.join('/')}
                  </td>
                </tr>
                <tr>
                  <td>Cuneiform Breakdown</td>
                  <td>
                    {$store.words[word].syllables === 'ERROR' ? 'ERROR' : $store.words[
                          word
                        ].cuneiforms
                          .map(symbol => symbol.cuneiformBreakDown.join('-'))
                          .join('-')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        {:else}
          <div class="column is-fullwidth has-text-centered">No info</div>
        {/each}
      </div>
    </div>
  </div>
</div>
<!-- ONLY VISIBLE ON MOBILE-->
<div
  class="columns is-vcentered is-hidden-desktop is-mobile"
  style="padding:10px 0px">
  <div class="column is-one-third">
    <img class="image is-48x48" src="logo.png" alt="logo" />
  </div>
  <div class="column is-one-third has-text-centered is-size-7">
    Claude Barde 2020
  </div>
  <div class="column is-one-third mobile-links">
    <div class="image is-24x24">
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSfbvc2XGv0ePLXQsrYUAVecO72dc6UYDojAC7W6cV3nVoVjGA/viewform"
        target="_blank"
        rel="noopener noreferrer">
        <img src="mail.svg" alt="contact" />
      </a>
    </div>
    <div class="image is-24x24">
      <a
        href="https://github.com/claudebarde/akkadian-keyboard"
        target="_blank"
        rel="noopener noreferrer">
        <img src="github.svg" alt="github" />
      </a>
    </div>
  </div>
</div>
