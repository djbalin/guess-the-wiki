// NOTE: Documentation for the functions in this file has been written with the help of ChatGPT.

import axios from "axios";
import { commonWords } from "../assets/1000_most_common_english_words";
import {
  WikiDocument,
  WikiPageTitleObject,
} from "../resources/WikiHelperTypes";

const wikiEndpoint = "https://en.wikipedia.org/w/api.php?action=query";
const standardParams = ["&format=json", "&origin=*"];
const randomWikiPageParamsExtra = [
  "&explaintext",
  "&formatversion=2",
  "&prop=extracts",
];
const randomPageTitleParamsExtra = ["&list=random", "&rnnamespace=0"];
const randomPageTitleParams = standardParams.concat(randomPageTitleParamsExtra);
const randomWikiPageParams = standardParams.concat(randomWikiPageParamsExtra);

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
    (word) => word.length > 2 && !commonWords.has(word)
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
export function fetchRandomWikiPageTitleObjects(
  numPages: number
): Promise<WikiPageTitleObject[]> {
  const numPagesParam = "&rnlimit=" + numPages;
  const url = wikiEndpoint + numPagesParam + randomPageTitleParams.join("");
  const titles: WikiPageTitleObject[] = [];

  return axios.get(url).then((response) => {
    response.data.query.random.forEach((element: any) => {
      titles.push({ title: element.title, id: element.id });
    });
    return titles;
  });
}

/**
 * Fetches the content of a Wikipedia page based on its title using the main WikiMedia API described at: {@link https://www.mediawiki.org/wiki/API:Main_page}
 *
 *
 * @param pageTitle - The title of the Wikipedia page whose content is to be fetched.
 * @returns A Promise that resolves to the content of the Wikipedia page as a string.
 * @throws {Error} If there's an issue with the HTTP request, if the page is not found, or if the response doesn't match the expected format.
 */
export async function fetchWikiPageContent(pageTitle: string): Promise<string> {
  const url =
    wikiEndpoint + "&titles=" + pageTitle + randomWikiPageParams.join("");
  const wikiConfig = {
    timeout: 5000,
  };

  const jsonResponse = await axios.get(url, wikiConfig);
  return jsonResponse.data.query.pages[0].extract;
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
  numPages: number
): Promise<WikiDocument[]> {
  const wikiPageTitleObjects: WikiPageTitleObject[] =
    await fetchRandomWikiPageTitleObjects(numPages);

  const wikiPageObjects: WikiDocument[] = [];

  for (const wikiPageTitleObject of wikiPageTitleObjects) {
    const wikiPageContent = await fetchWikiPageContent(
      wikiPageTitleObject.title
    );
    const pageObject = {
      title: wikiPageTitleObject.title,
      content_raw: wikiPageContent,
      content_censored: "",
      id: wikiPageTitleObject.id,
    };
    wikiPageObjects.push(pageObject);
  }
  return wikiPageObjects;
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
  snippetLength: number
): Promise<WikiDocument[]> {
  const wikiPageObjects = await fetchRandomWikiPages(numPages);
  const wikiPagesSnippeted: WikiDocument[] = [];

  for (const wikiPageObject of wikiPageObjects) {
    const raw_censored: string = censorText(
      wikiPageObject.content_raw,
      wikiPageObject.title
    );

    const extractedSnippet: string = extractSnippetFromText(
      raw_censored,
      snippetLength
    );

    const newWikiPage: WikiDocument = {
      title: wikiPageObject.title,
      content_raw: extractedSnippet,
      content_censored: extractedSnippet,
      id: wikiPageObject.id,
    };
    wikiPagesSnippeted.push(newWikiPage);
  }
  return wikiPagesSnippeted;
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
