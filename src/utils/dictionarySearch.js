import dictionary from "../databases/dictionary.json";

export default (word) => {
  const initial = word[0];
  const glossary = dictionary[initial];
  if (glossary) {
    const glossaryEntry = glossary[word];
    if (glossaryEntry) {
      return { word, entry: glossaryEntry };
    } else {
      return { word, error: "Word not found" };
    }
  } else {
    return { word, error: "No such glossary" };
  }
};
