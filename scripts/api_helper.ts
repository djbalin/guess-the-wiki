// NOTE: Documentation for the functions in this file has been written with the help of ChatGPT.

import axios from "axios";
import { THOUSAND_MOST_COMMON_WORDS } from "../assets/1000_most_common_words";
import { Language, Languages, WikiDocument } from "../resources/TypesEnums";

function wikiEndpoint(language: Language) {
  return `https://${language}.wikipedia.org/w/api.php?action=query`;
}
// const WIKI_ENDPOINT = "https://en.wikipedia.org/w/api.php?action=query";
const STANDARD_PARAMS = ["&format=json", "&origin=*"];
const RANDOM_TITLE_EXTRA_PARAMS = [
  "&generator=random",
  "&grnnamespace=0",
  "&prop=info",
  "&inprop=url",
];
const RANDOM_WIKIPAGES_EXTRA_PARAMS = [
  "&explaintext",
  "&formatversion=2",
  "&prop=extracts",
];
const RANDOM_TITLE_PARAMS = STANDARD_PARAMS.concat(RANDOM_TITLE_EXTRA_PARAMS);
const RANDOM_WIKIPAGE_PARAMS = STANDARD_PARAMS.concat(
  RANDOM_WIKIPAGES_EXTRA_PARAMS
);

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
function censorText(rawText: string, phraseToCensor: string): string {
  const censorCandidates: string[] = phraseToCensor.replace(",", "").split(" ");
  const wordsToCensor: string[] = censorCandidates.filter(
    (word) => word.length > 2 && !THOUSAND_MOST_COMMON_WORDS.has(word)
  );
  //
  // TODO
  // TODO
  // TODO
  //
  // This is buggy: It replaces occurrences of an input word if it forms a substring of another word, if e.g. "King" is to be censored, "Kingdom" becomes "###dom"
  const regEx = new RegExp(wordsToCensor.join("|"), "gi");
  return rawText.replaceAll(regEx, "###");
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
function extractSnippetFromText(fullText: string, snippetLength: number) {
  // The Wikipedia API surrounds headers with 2 or more equals symbols (=) in the text outputted, e.g.: == Results ==
  // These equals symbols are simply removed for now.
  const fullTextHeadersRemoved = fullText.replaceAll(/={2,}/g, "");
  const allTypesOfWhitespace = RegExp(/\s+|\r+|\t+|\v+|\n+/g);
  const words = fullTextHeadersRemoved.split(allTypesOfWhitespace);

  if (words.length <= snippetLength) {
    return words.join(" ");
  }

  const beginIndex: number = Math.floor(
    Math.round(Math.random() * (words.length - snippetLength))
  );
  const endIndex = beginIndex + snippetLength;

  return words.slice(beginIndex, endIndex).join(" ");
}

/**
 * Fetches random Wikipedia page titles with their IDs.
 *
 * This function sends a request to the Wikipedia API to retrieve a specified number of random
 * Wikipedia page titles. Utilizes the MediaWiki "Random" API described at: {@link}https://www.mediawiki.org/wiki/API:Random
 * This API returns titles and internal WikiData id's for the requested number of random articles.
 *
 * @param numPages - The number of random Wikipedia page titles to fetch.
 * @returns A Promise that resolves to an array of WikiPageTitleObject.
 * @throws {Error} If there's an issue with the HTTP request or if the response doesn't match the expected format.
 */
export async function fetchRandomWikiPageTitles(
  numPages: number,
  language: Language
): Promise<WikiDocument[]> {
  const numPagesParam = "&grnlimit=" + numPages;
  const randomTitlesEndpoint =
    wikiEndpoint(language) + numPagesParam + RANDOM_TITLE_PARAMS.join("");
  const randomWikiTitles: WikiDocument[] = [];
  const result = await axios.get(randomTitlesEndpoint);

  Object.values(result.data.query.pages).forEach((element: any) => {
    const wikiTitle: WikiDocument = {
      title: element.title,
      id: element.pageid,
      url: element.fullurl,
      content_censored: null,
      content_raw: null,
    };

    randomWikiTitles.push(wikiTitle);
  });
  return randomWikiTitles;
}

/**
 * Fetches the content of a Wikipedia page based on its title using the main WikiMedia API described at: {@link https://www.mediawiki.org/wiki/API:Main_page}
 *
 *
 * @param pageTitle - The title of the Wikipedia page whose content is to be fetched.
 * @returns A Promise that resolves to the content of the Wikipedia page as a string.
 * @throws {Error} If there's an issue with the HTTP request, if the page is not found, or if the response doesn't match the expected format.
 */
export async function fetchWikiPageContent(
  pageTitle: string,
  language: Language
): Promise<string> {
  const randomPageEndpoint =
    wikiEndpoint(language) +
    "&titles=" +
    pageTitle +
    RANDOM_WIKIPAGE_PARAMS.join("");
  const wikiConfig = {
    timeout: 5000,
  };
  const response = await axios.get(randomPageEndpoint, wikiConfig);
  return response.data.query.pages[0].extract;
}

/**
 * Fetch a specified number of random Wikipedia pages with their titles and content.
 *
 * This function fetches the title and content of a specified number of random Wikipedia pages using WikiMedia API's.
 *
 * @param numPages - The number of random Wikipedia pages to fetch.
 * @returns A Promise that resolves to an array of WikiPageObject, each containing title, raw content, placeholder field for censored content, and ID.
 */
export async function fetchRandomWikiPages(
  numPages: number,
  language: Language
): Promise<WikiDocument[]> {
  const wikiPages: WikiDocument[] = await fetchRandomWikiPageTitles(
    numPages,
    language
  );
  for await (const wikiPage of wikiPages) {
    const wikiPageContent = await fetchWikiPageContent(
      wikiPage.title,
      language
    );
    wikiPage["content_raw"] = wikiPageContent;
  }

  return wikiPages;
}

/**
 * Fetches random Wikipedia articles (title and content) and extracts and censors snippets of a specified length from their content.
 *
 * @param numPages - The number of random Wikipedia pages to fetch.
 * @param snippetLength - The desired length of the extracted snippets.
 * @returns A Promise that resolves to an array of WikiPageObject, each containing title, raw content snippet, censored content snippet, and ID.
 */
export async function fetchAndSnippetRandomWikiPages(
  numPages: number,
  snippetLength: number,
  language: Language
): Promise<WikiDocument[]> {
  const wikiPages = await fetchRandomWikiPages(numPages, language);

  for (const wikiPage of wikiPages) {
    if (!wikiPage.content_raw) {
      console.log(wikiPage);
      throw Error("Error fetching Wiki snippets: raw content is null");
    }
    const raw_censored: string = censorText(
      wikiPage.content_raw,
      wikiPage.title
    );

    const extractedSnippet: string = extractSnippetFromText(
      raw_censored,
      snippetLength
    );

    wikiPage.content_censored = extractedSnippet;

    // const newWikiPage: WikiDocument = {
    //   title: wikiPage.title,
    //   content_raw: extractedSnippet,
    //   content_censored: extractedSnippet,
    //   id: wikiPage.id,
    // };
    // wikiPagesSnippeted.push(newWikiPage);
  }
  return wikiPages;
}

// TODO
// TODO
// TODO
// TODO
// Implement this function (re-fetches pages until they can be snippeted to sufficiently long length)

// export async function fetchSufficientlyLongWikiPages(
//   numPages: number
// ): Promise<WikiPageObject[]> {
//   const wikiPageTitles: WikiPageTitleObject[] =
//     await fetchRandomWikiPageTitleObjects(numPages);

//   const wikiPagesAndTitles: WikiPageObject[] = [];
//   for (const wikiPageTitle of wikiPageTitles) {
//     const wikiPageContent = await fetchWikiPageContent(wikiPageTitle.title);
//     const pageObject = {
//       title: wikiPageTitle.title,
//       content_raw: wikiPageContent,
//       content_censored: "",
//       id: wikiPageTitle.id,
//     };
//     wikiPagesAndTitles.push(pageObject);
//   }
//   return wikiPagesAndTitles;
// }
