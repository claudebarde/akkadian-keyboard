const vowels = ["a", "e", "i", "u", "ā", "ē", "ī", "ū", "â", "ê", "î", "û"];

const syllableCount = (word) =>
  word.split("").filter((char) => vowels.includes(char)).length;

const sliceCharPairs = ({ string, indices }) => {
  let syllables = [];
  if (indices.length === 1) {
    // only one pair
    syllables.push(string.slice(0, indices[0] + 1));
    syllables.push(string.slice(indices[0] + 1));
  } else if (indices.length > 1) {
    // two pairs or more
    for (let i = 0; i < indices.length; i++) {
      if (i === 0) {
        syllables.push(string.slice(0, indices[0] + 1));
        syllables.push(string.slice(indices[i] + 1, indices[i + 1] + 1));
      } else if (i === indices.length - 1) {
        syllables.push(string.slice(indices[i] + 1));
      } else {
        syllables.push(string.slice(indices[i] + 1, indices[i + 1] + 1));
      }
    }
  } else {
    syllables.push(string);
  }

  return syllables;
};

const lastIndexOfCVC = (string) => {
  let result;
  let startpos = string.length;
  const regex = new RegExp(
    "([bdfgḫklmnpqrstzšṣṭyw]{1}[aeiuāēīūâêîû]{1}[bdfgḫklmnpqrstzšṣṭyw]{1})",
    "g"
  );

  var stringToWorkWith = string.substring(0, startpos + 1);
  var lastIndexOf = -1;
  var nextStop = 0;
  while ((result = regex.exec(stringToWorkWith)) != null) {
    lastIndexOf = result.index;
    regex.lastIndex = ++nextStop;
  }
  return lastIndexOf;
};

export default (word, wordPos) => {
  // counts vowel to verify number of syllables
  let string = word;
  let syllables = [];

  // breaks word at double consonants
  const doubleConsonantMatches = word.matchAll("([bdfgḫklmnpqrstzšṣṭyw]{2})");
  const doubleConsIndices = [...doubleConsonantMatches].map((arr) => arr.index);
  syllables = sliceCharPairs({ string, indices: doubleConsIndices });
  // breaks word at double vowels
  syllables = syllables
    .map((syll) => {
      const doubleVowelsMatches = syll.matchAll(`([${vowels.join("")}]{2})`);
      const doubleVowelsIndices = [...doubleVowelsMatches].map(
        (arr) => arr.index
      );
      return sliceCharPairs({ string: syll, indices: doubleVowelsIndices });
    })
    .flat(Infinity);
  // finds syllables starting with a vowel
  syllables = syllables
    .map((syll) => {
      if (vowels.includes(syll[0]) && syll.length > 2) {
        return [syll[0], syll.slice(1)];
      } else {
        return syll;
      }
    })
    .flat(Infinity);
  // finds CVC groups
  syllables = syllables
    .map((syll) => {
      if (syll.length > 3 && !vowels.includes(syll[syll.length - 1])) {
        const lastIndex = lastIndexOfCVC(syll);

        return [syll.slice(0, lastIndex), syll.slice(lastIndex)];
      } else {
        return syll;
      }
    })
    .flat(Infinity);
  // finds CV groups
  syllables = syllables
    .map((syll) => {
      if (syll.length > 3) {
        const results = [
          ...syll.matchAll(
            `([bdfgḫklmnpqrstzšṣṭyw]{1}[${vowels.join("")}]{1})`
          ),
        ];

        return results.map((arr) => arr[0]);
      } else {
        return syll;
      }
    })
    .flat(Infinity);

  return {
    word,
    position: wordPos + 1,
    syllableCount: syllableCount(word),
    syllables: syllables.length === syllableCount(word) ? syllables : "ERROR",
  };
};
