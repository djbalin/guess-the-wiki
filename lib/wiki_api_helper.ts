// NOTE: Documentation for the functions in this file has been written with the help of ChatGPT.

import axios from "axios";
import { WikiDocument, WikiMetaData } from "../types/wiki";
import { censorText, extractSnippetFromText } from "./text_processing";
import { LanguageCode } from "@/types/language";
import { prngAlea } from "ts-seedrandom";

const cfg = {
  timeout: 5000,
  headers: {
    "User-Agent": "GuessTheWiki/1.0 (jgbalin@gmail.com)",
  },
};

function baseWikiEndpoint(language: LanguageCode) {
  const BASE_ENDPOINT = `https://${language}.wikipedia.org/w/api.php?action=query`;
  const STANDARD_PARAMS = ["&format=json", "&origin=*", "&redirects"];
  return BASE_ENDPOINT + STANDARD_PARAMS.join("");
}

const METADATA_ENDPOINTS = ["&prop=info", "&inprop=url"];

function generateRandomTitlesEndpoint(
  language: LanguageCode,
  numPages: number,
) {
  const RANDOM_TITLE_PARAMS = ["&generator=random", "&grnnamespace=0"].concat(
    METADATA_ENDPOINTS,
  );
  const numPagesParam = "&grnlimit=" + numPages;
  const randomTitlesEndpoint =
    baseWikiEndpoint(language) + numPagesParam + RANDOM_TITLE_PARAMS.join("");
  return randomTitlesEndpoint;
}

function generateRandomPageEndpoint(language: LanguageCode, pageTitle: string) {
  const RANDOM_WIKIPAGE_PARAMS = [
    "&explaintext",
    "&formatversion=2",
    "&prop=extracts",
  ];
  const randomPageEndpoint =
    baseWikiEndpoint(language) +
    "&titles=" +
    pageTitle +
    RANDOM_WIKIPAGE_PARAMS.join("");

  return randomPageEndpoint;
}

function generateMetadataByIdEndpoint(language: LanguageCode, ids: string[]) {
  return (
    baseWikiEndpoint(language) +
    `&pageids=${ids.join("|")}` +
    METADATA_ENDPOINTS.join("")
  );
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
async function fetchRandomWikiMetadata(
  numPages: number,
  language: LanguageCode,
): Promise<WikiMetaData[]> {
  const randomTitlesEndpoint = generateRandomTitlesEndpoint(language, numPages);
  console.log("randomtitlesendpoint: ", randomTitlesEndpoint);
  const apiResult = await axios.get(randomTitlesEndpoint, cfg);

  const randomWikiMetadata: WikiMetaData[] = Object.values(
    apiResult.data.query.pages as WikiMetaData[],
  ).map(({ title, pageid, fullurl }) => {
    return {
      title,
      pageid,
      fullurl,
    };
  });

  return randomWikiMetadata;
}

async function fetchWikiMetadataByIds(
  language: LanguageCode,
  ids: string[],
): Promise<WikiMetaData[]> {
  const endpoint = generateMetadataByIdEndpoint(language, ids);
  const apiResult = await axios.get(endpoint, cfg);
  const metaData: WikiMetaData[] = Object.values(
    apiResult.data.query.pages as WikiMetaData[],
  ).map(({ fullurl, pageid, title }) => {
    return {
      title,
      pageid,
      fullurl,
    };
  });
  return metaData;
}

/**
 * Fetches the content of a Wikipedia page based on its title using the main WikiMedia API described at: {@link https://www.mediawiki.org/wiki/API:Main_page}
 *
 *
 * @param pageTitle - The title of the Wikipedia page whose content is to be fetched.
 * @returns A Promise that resolves to the content of the Wikipedia page as a string.
 * @throws {Error} If there's an issue with the HTTP request, if the page is not found, or if the response doesn't match the expected format.
 */
async function fetchWikiPageContent(
  pageTitle: string,
  language: LanguageCode,
): Promise<string> {
  const randomPageEndpoint = generateRandomPageEndpoint(language, pageTitle);

  const response = await axios.get(randomPageEndpoint, cfg);
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
async function fetchWikiPages(
  numPages: number,
  language: LanguageCode,
  seededIds: string[] | null,
): Promise<WikiDocument[]> {
  const wikiTitles: WikiMetaData[] = seededIds
    ? await fetchWikiMetadataByIds(language, seededIds)
    : await fetchRandomWikiMetadata(numPages, language);

  const wikiPages: WikiDocument[] = await Promise.all(
    wikiTitles.map(async (wikiPage) => {
      const wikiPageContent = await fetchWikiPageContent(
        wikiPage.title,
        language,
      );

      return {
        ...wikiPage,
        content_raw: wikiPageContent,
        content_censored: null,
      };
    }),
  );

  return wikiPages;
}

/**
 * Fetches random Wikipedia articles (title and content) and extracts and censors snippets of a specified length from their content.
 *
 * @param numPages - The number of random Wikipedia pages to fetch.
 * @param snippetLength - The desired length of the extracted snippets.
 * @returns A Promise that resolves to an array of WikiPageObject, each containing title, raw content snippet, censored content snippet, and ID.
 */
export async function fetchAndSnippetWikiPages(
  numPages: number,
  snippetLength: number,
  language: LanguageCode,
  seed: number | null,
  ids: string[] | null,
): Promise<{ wikiPages: WikiDocument[]; parsedSeed: string | number }> {
  const parsedSeed = seed ?? Math.random();
  const seededRnd = prngAlea(parsedSeed).double();

  const wikiPages = await fetchWikiPages(numPages, language, ids);

  for (const wikiPage of wikiPages) {
    if (!wikiPage.content_raw) {
      throw Error(
        `Error fetching Wiki snippets: raw content is null. wiki page id: ${wikiPage.pageid}, title: ${wikiPage.title}, url: ${wikiPage.fullurl}`,
      );
    }
    const raw_censored: string = censorText(
      wikiPage.content_raw,
      wikiPage.title,
      language,
    );

    const extractedSnippet: string = extractSnippetFromText(
      raw_censored,
      snippetLength,
      seededRnd,
    );

    wikiPage.content_censored = extractedSnippet;
  }
  return { wikiPages, parsedSeed };
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
