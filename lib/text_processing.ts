import { HUNDRED_MOST_COMMON_WORDS } from "@/assets/most_common_words";
import { LanguageCode } from "@/types/language";

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

  // Splitting can yield empty strings at either end (leading/trailing
  // whitespace, or whitespace left behind by a stripped header). They would
  // otherwise be counted against snippetLength and show up as stray spaces.
  const words = fullTextHeadersRemoved
    .split(ALL_TYPES_OF_WHITESPACE)
    .filter(Boolean);

  if (words.length <= snippetLength) {
    return words.join(" ");
  }

  const beginIndex: number = Math.floor(
    Math.round(seededRnd * (words.length - snippetLength)),
  );
  const endIndex = beginIndex + snippetLength;

  return words.slice(beginIndex, endIndex).join(" ");
}

/** Escapes regular-expression metacharacters so a word can be matched literally. */
function escapeRegExp(word: string): string {
  return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Replaces specified words in a given input string.
 *
 * The words to censor are taken from the article title. Occurrences are
 * replaced by the string "###" provided that the given word does not appear in
 * the list of the most common words in the article's language.
 *
 * Matching is whole-word only, so censoring "King" no longer turns "Kingdom"
 * into "###dom", and every candidate is escaped before it reaches the regular
 * expression, so titles containing metacharacters ("C++", "*NSYNC") no longer
 * throw.
 *
 * @param rawText - The original text to be censored.
 * @param phraseToCensor - The article title whose words should be censored.
 * @param language - Language of the article, used to pick the stop-word list.
 * @returns The censored text with '###' replacing the specified words.
 */
export function censorText(
  rawText: string,
  phraseToCensor: string,
  language: LanguageCode,
): string {
  const commonWords = HUNDRED_MOST_COMMON_WORDS[language];
  const wordsToCensor = phraseToCensor
    .split(/[\s,]+/)
    // Strip punctuation that clings to a title word, e.g. "(band)" or "Who?".
    .map((word) => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""))
    .filter((word) => word.length > 2 && !commonWords.has(word.toLowerCase()));

  // An empty pattern matches at every position, which would replace the whole
  // article with "###". Nothing to censor means nothing to do.
  if (wordsToCensor.length === 0) {
    return rawText;
  }

  const regEx = new RegExp(
    `(?<![\\p{L}\\p{N}])(?:${wordsToCensor.map(escapeRegExp).join("|")})(?![\\p{L}\\p{N}])`,
    "giu",
  );

  return rawText.replaceAll(regEx, "###").replaceAll(/###(?:\s+###)+/g, "###");
}
