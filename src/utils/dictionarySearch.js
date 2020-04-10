import dictionary from "../databases/dictionary.json";

export default (word) => {
  // gets initial letter
  const initial = word[0];
  // loads glossary for that letter
  const glossary = dictionary[initial];
  // if word is in the glossary
  if (glossary) {
    const glossaryEntry = glossary[word];
    if (glossaryEntry) {
      return { word, baseForm: true, entry: glossaryEntry };
    } else {
      /*
       * CHECKS IF WORD MAY BE A NOUN
       */
      // checks declension endings
      const mimationEnding = word.slice(-2);
      const plMascEnding = word.slice(-1);
      if (["im", "am", "ān", "īn"].includes(mimationEnding)) {
        // saves case
        let decl =
          mimationEnding === "im" || mimationEnding === "īn"
            ? "genitive"
            : "accusative";
        // searches word
        const entry = word.slice(0, -2) + "um";
        const glossaryEntry = glossary[entry];
        if (glossaryEntry) {
          return {
            word,
            baseForm: false,
            info: { text: `(${entry})`, case: decl },
            entry: glossaryEntry,
          };
        } else {
          return { word, error: "Word not found" };
        }
      } else if (["ū", "ī"].includes(plMascEnding)) {
        const entry = word.slice(0, -1) + "um";
        const glossaryEntry = glossary[entry];
        if (glossaryEntry) {
          return {
            word,
            baseForm: false,
            info: {
              text: `(${entry})`,
              case: plMascEnding === "ū" ? "nominative" : "genitive/accusative",
            },
            entry: glossaryEntry,
          };
        } else {
          return { word, error: "Word not found" };
        }
      } else {
        return { word, error: "No such glossary" };
      }
    }
  } else {
    return { word, error: "Glossary not found" };
  }
};
