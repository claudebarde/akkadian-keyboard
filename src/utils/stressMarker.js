const vowels = ["a", "e", "i", "u", "ā", "ē", "ī", "ū", "â", "ê", "î", "û"];

export default (word, info) => {
  if (info.syllables === "ERROR") return { word, stressPosition: undefined };

  // If the last syllable is ultraheavy, it bears the stress
  const finalUltraheavy = word.match(
    /[āēīū][bdfgḫklmnpqrstzšṣṭyw]{1}$|[âêîû][bdfgḫklmnpqrstzšṣṭyw]?$/
  );
  if (finalUltraheavy) {
    return { word, stressPosition: finalUltraheavy.index };
  } else {
    // Otherwise, stress falls on the last non-final heavy or ultraheavy syllable
    let stressedSyllable = undefined;
    let syllables = [...info.syllables];
    syllables.reverse().shift();
    for (let syll of syllables) {
      if (syll.match(/[âêîû]$|[āēīūâêîû].{1}|[āēīū]$|[aeiu].{1}/)) {
        stressedSyllable = syll;
        break;
      }
    }
    if (stressedSyllable) {
      // calculates position
      let position = undefined;
      if (vowels.includes(stressedSyllable[0])) {
        position = word.lastIndexOf(stressedSyllable);
      } else {
        position = word.lastIndexOf(stressedSyllable) + 1;
      }

      return { word, stressPosition: position };
    } else {
      if (word.match(/[āēīūâêîû].+/) === null) {
        // if no long vowel
        if (["a", "e", "i", "u"].includes(word[0])) {
          return { word, stressPosition: 0 };
        } else {
          return { word, stressPosition: 1 };
        }
      } else {
        return { word, stressPosition: undefined };
      }
    }
  }
};
