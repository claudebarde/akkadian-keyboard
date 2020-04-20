import syllabary from "../databases/syllabary.json";
import { get } from "svelte/store";
import store from "../store";

const longVowels = ["ā", "ē", "ī", "ū", "â", "ê", "î", "û"];
const shortVowels = ["a", "e", "i", "u"];
const vowelsLongToShort = {
  ā: "a",
  ē: "e",
  ī: "i",
  ū: "u",
  â: "a",
  ê: "e",
  î: "i",
  û: "u",
};

const matchWithCuneiform = (syll) =>
  syllabary[syll] || { sign: "Ø", utf8: "Ø" };

export default (syllables) => {
  if (syllables === "ERROR") {
    return [{ cuneiformBreakDown: "ERROR" }];
  }

  return syllables
    .map((syll) => {
      let cuneiformBreakDown = ["ERROR"];

      if (syll.length === 1) {
        // may be short or long vowel
        if (longVowels.includes(syll)) {
          // if user wants double vowels to be doubled
          if (get(store).doubleLongVowels) {
            cuneiformBreakDown = [
              vowelsLongToShort[syll],
              vowelsLongToShort[syll],
            ];
          } else {
            cuneiformBreakDown = [vowelsLongToShort[syll]];
          }
        } else {
          cuneiformBreakDown = [syll];
        }
      } else if (syll.length === 2) {
        // may be of type VC or CV with short or long vowels
        if (longVowels.includes(syll[0])) {
          if (get(store).doubleLongVowels) {
            cuneiformBreakDown = [
              vowelsLongToShort[syll[0]],
              vowelsLongToShort[syll[0]] + syll[1],
            ];
          } else {
            cuneiformBreakDown = [vowelsLongToShort[syll[0]] + syll[1]];
          }
        } else if (longVowels.includes(syll[1])) {
          if (get(store).doubleLongVowels) {
            cuneiformBreakDown = [
              syll[0] + vowelsLongToShort[syll[1]],
              vowelsLongToShort[syll[1]],
            ];
          } else {
            cuneiformBreakDown = [syll[0] + vowelsLongToShort[syll[1]]];
          }
        } else {
          cuneiformBreakDown = [syll];
        }
      } else if (syll.length === 3) {
        // syllable of type CVC
        if (longVowels.includes(syll[1])) {
          if (get(store).doubleLongVowels) {
            cuneiformBreakDown = [
              syll[0] + vowelsLongToShort[syll[1]],
              vowelsLongToShort[syll[1]],
              vowelsLongToShort[syll[1]] + syll[2],
            ];
          } else {
            cuneiformBreakDown = [
              syll[0] + vowelsLongToShort[syll[1]],
              vowelsLongToShort[syll[1]] + syll[2],
            ];
          }
        } else {
          cuneiformBreakDown = [syll[0] + syll[1], syll[1] + syll[2]];
        }
      }

      return {
        syllable: syll,
        cuneiformBreakDown,
        cuneiforms: cuneiformBreakDown.map((el) => matchWithCuneiform(el)),
      };
    })
    .flat(Infinity);
};
