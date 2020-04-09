<script>
  import insertTextAtCursor from "insert-text-at-cursor";
  import { onMount } from "svelte";
  import syllableParser from "./syllableParser.js";
  import cuneiformsGenerator from "./cuneiformsGenerator.js";
  import store from "./store.js";

  let info = [];
  let suggestions = [];
  let newLinesPos = [];
  let result, textareaRef;

  $: if ($store.input.length === 0) {
    info = [];
    newLinesPos = [];
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
    text = text.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
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
    //store.updateWords(words);
    // parses syllables
    parsedSyllables = words.map((word, index) => syllableParser(word, index));
    // generates cuneiforms
    cuneiforms = parsedSyllables.map(syllables => ({
      word: syllables.word,
      cuneiforms: cuneiformsGenerator(syllables.syllables)
    }));
    store.updateSyllables(parsedSyllables);
    store.updateCuneiforms(cuneiforms);
    console.log($store);

    /*info = parsedSyllables.map((el, index) => ({
      ...el,
      cuneiformBreakDown: cuneiforms[index]
        .map(el => el.cuneiformBreakDown)
        .flat(Infinity),
      cuneiforms: cuneiforms[index].map(el => el.cuneiforms).flat(Infinity)
    }));*/
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

<div class="columns">
  <div class="column is-three-fifths is-offset-one-fifth has-text-centered">
    <h1 class="title">Akkadian Keyboard</h1>
    <textarea
      class="input"
      id="textarea-input"
      on:input={processInput}
      value={$store.input}
      placeholder="Type your text here" />
    <div class="tabs is-toggle is-centered is-small">
      <ul>
        {#each charCorrespondences as chars}
          <li on:click={() => insertTextAtCursor(textareaRef, chars.char)}>
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
              {#each suggestions as sugg}
                <tr>
                  <td>{sugg.text}</td>
                </tr>
              {:else}
                <tr>
                  <td>...</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="column is-four-fifths cuneiforms">
          {#each Object.keys($store.words) as word}
            {#if $store.words[word].syllables !== 'ERROR'}
              <span
                class="cuneiform-sign cuneiform-word is-size-4"
                data-word={word}
                on:mouseover={() => (suggestions = [...suggestions, { text: word }])}
                on:mouseout={() => (suggestions = suggestions.filter(el => el.text !== word))}>
                {#each $store.words[word].cuneiforms as symbol}
                  <span class="has-tooltip-top" data-tooltip={symbol.syllable}>
                    {#each symbol.cuneiforms as cuneiform}
                      {cuneiform.sign}
                    {/each}
                  </span>
                {:else}Ø{/each}
              </span>
              {#if newLinesPos.includes($store.words[word].position)}
                <br />
              {/if}
            {:else}Ø{/if}
          {:else}Cuneiform Rendering{/each}
        </div>
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
                  <td>Cuneiform Break Down</td>
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
        {:else}No info{/each}
      </div>
    </div>
  </div>
</div>
