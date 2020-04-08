<script>
  import insertTextAtCursor from "insert-text-at-cursor";
  import { onMount } from "svelte";
  import syllableParser from "./syllableParser.js";
  import cuneiformsGenerator from "./cuneiformsGenerator.js";

  let input = "";
  let info = [];
  let suggestions = [];
  let result, textareaRef, parsedSyllables, cuneiforms;

  $: if (input.length === 0) {
    info = [];
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
    let text = event.target.value;
    // replaces unformated values
    charCorrespondences.forEach(pair => {
      const regex = new RegExp(`${pair.corr}`, "g");
      text = text.toLowerCase().replace(regex, pair.char);
    });
    // updates input
    input = text;
    // parses syllables
    parsedSyllables = text
      .trim()
      .split(/\s/g)
      .map(word => syllableParser(word));
    // generates cuneiforms
    cuneiforms = parsedSyllables.map(syllables =>
      cuneiformsGenerator(syllables.syllables)
    );

    info = parsedSyllables.map((el, index) => ({
      ...el,
      cuneiformBreakDown: cuneiforms[index]
        .map(el => el.cuneiformBreakDown)
        .flat(Infinity),
      cuneiforms: cuneiforms[index].map(el => el.cuneiforms).flat(Infinity)
    }));
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
    overflow-wrap: break-word;
    min-height: 80px;
  }

  .cuneiform-word {
    padding: 5px 2px;
    border: solid 2px white;
    border-radius: 10px;
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
      value={input}
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
    <div class="box cuneiforms">
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
        <div class="column is-four-fifths">
          {#each info as el}
            {#if el.syllables !== 'ERROR'}
              <span
                class="cuneiform-sign cuneiform-word is-size-4"
                data-word={el.word}
                on:mouseover={() => (suggestions = [...suggestions, { text: el.word }])}
                on:mouseout={() => (suggestions = suggestions.filter(el => el.text === el.word))}>
                {#each el.cuneiforms as symbol, index}
                  <span
                    class="has-tooltip-top"
                    data-tooltip={el.cuneiformBreakDown[index]}>
                    {symbol.sign}
                  </span>
                {:else}Ø{/each}
              </span>
            {:else}Ø{/if}
          {:else}Cuneiform Rendering{/each}
        </div>
      </div>
    </div>
    <div class="box">
      <h3 class="subtitle">Information:</h3>
      <div class="columns is-multiline">
        {#each info as el}
          <div class="column is-half">
            <table
              class="table is-bordered is-striped is-narrow is-hoverable
              is-fullwidth">
              <tbody>
                <tr>
                  <td>Word</td>
                  <td>{el.word}</td>
                </tr>
                <tr>
                  <td>Syllable Count</td>
                  <td>{el.syllableCount}</td>
                </tr>
                <tr>
                  <td>Syllables</td>
                  <td>
                    {el.syllables === 'ERROR' ? 'ERROR' : el.syllables.join('/')}
                  </td>
                </tr>
                <tr>
                  <td>Cuneiform Break Down</td>
                  <td>
                    {el.syllables === 'ERROR' ? 'ERROR' : el.cuneiformBreakDown.join('-')}
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
