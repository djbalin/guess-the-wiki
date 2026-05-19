import {
  HUNDRED_MOST_COMMON_WORDS,
  THOUSAND_MOST_COMMON_WORDS,
} from "@/assets/most_common_words";
import { LanguageCode } from "@/types/language";
import { prngAlea } from "ts-seedrandom";

const ALL_TYPES_OF_WHITESPACE = RegExp(/\s+|\r+|\t+|\v+|\n+/g);

function stripReferencesSection(text: string): string {
  const refText = "== References ==";
  const referencesSection = text.indexOf(refText);
  if (referencesSection === -1) {
    return text;
  }
  return text.substring(0, referencesSection);
}

/**
 *
 * The Wikipedia API surrounds headers with 2 or more equals symbols (=) in the text outputted, e.g.: == Results ==
 * These equals symbols are simply removed for now.
 * @param text - The text to strip the article headers from.
 * @returns The text with the article headers stripped.
 *
 */
function stripArticleHeaders(text: string): string {
  return text.replaceAll(/={2,}/g, "");
}

/**
 * Extract a snippet (or substring) with a specified length from the provided string.
 *
 * The input string is assumed to be a response from the WikiMedia API's as described elsewhere in this file.
 * Repeated equals symbols (==) are removed. These symbols appear in the API response and surround article headers.
 *
 * @param fullText - The full text from which to extract a snippet.
 * @param snippetLength - The desired length of the extracted snippet.
 * @returns The extracted text snippet.
 */
export function extractSnippetFromText(
  fullText: string,
  snippetLength: number,
  seededRnd: number,
) {
  const fullTextReferencesRemoved = stripReferencesSection(fullText);
  const fullTextHeadersRemoved = stripArticleHeaders(fullTextReferencesRemoved);

  const words = fullTextHeadersRemoved.split(ALL_TYPES_OF_WHITESPACE);

  if (words.length <= snippetLength) {
    console.log("Returning early");
    return words.join(" ");
  }

  const beginIndex: number = Math.floor(
    Math.round(seededRnd * (words.length - snippetLength)),
  );
  const endIndex = beginIndex + snippetLength;

  return words.slice(beginIndex, endIndex).join(" ");
}

/**
 * Replaces specified words in a given input string.
 *
 * The words to replace/censor are assumed to be provided as a space-separated string. Occurrences of these words are replaced by
 * the string "###" provided that the given word does not appear in the list of the 1000 most common words in English.
 *
 * @param rawText - The original text to be censored.
 * @param phraseToCensor - Words or phrases to be censored (comma-separated).
 * @returns The censored text with '###' replacing the specified words or phrases.
 */
export function censorText(
  rawText: string,
  phraseToCensor: string,
  language: LanguageCode,
): string {
  const censorCandidates: string[] = phraseToCensor.replace(",", "").split(" ");
  const wordsToCensor: string[] = censorCandidates.filter(
    (word) => word.length > 2 && !HUNDRED_MOST_COMMON_WORDS[language].has(word),
  );
  //
  // TODO
  // TODO
  // TODO
  //
  // This is buggy: It replaces occurrences of an input word if it forms a substring of another word, if e.g. "King" is to be censored, "Kingdom" becomes "###dom"
  const regEx = new RegExp(wordsToCensor.join("|"), "gi");
  return rawText
    .replaceAll(regEx, "###")
    .replaceAll(/###(?:\s+###)+/g, "###");
}
