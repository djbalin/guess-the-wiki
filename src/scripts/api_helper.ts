import axios from "axios";
import { commonWords } from "../assets/1000_most_common_english_words";
import {
  WikiPageObject,
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

// async function fetchRandomWikiPageTitlesJson(numPages: number) {
//   const numPagesParam = "&rnlimit=" + numPages;
//   const combinedParams = standardParams.concat(randomPageTitleParams);

//   const res = await axios.get(
//     wikiEndpoint + numPagesParam + combinedParams.join("&")
//   );
//   const titles: string[] = [];
//   res.data.query.random.forEach((element: any) => {
//     titles.push(element);
//   });

//   return titles;
// }

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

export async function fetchWikiPageContent(pageTitle: string): Promise<string> {
  const url =
    wikiEndpoint + "&titles=" + pageTitle + randomWikiPageParams.join("");
  const wikiConfig = {
    timeout: 3000,
  };

  const jsonResponse = await axios.get(url, wikiConfig);
  return jsonResponse.data.query.pages[0].extract;
}

function censorText(rawText: string, phraseToCensor: string): string {
  const censorCandidates: string[] = phraseToCensor.replace(",", "").split(" ");
  const wordsToCensor: string[] = censorCandidates.filter(
    (word) => word.length > 2 && !commonWords.has(word)
  );
  const regEx = new RegExp(wordsToCensor.join("|"), "gi");
  return rawText.replaceAll(regEx, "###");
}

export async function fetchRandomWikiPages(
  numPages: number
): Promise<WikiPageObject[]> {
  const wikiPageTitleObjects: WikiPageTitleObject[] =
    await fetchRandomWikiPageTitleObjects(numPages);

  const wikiPageObjects: WikiPageObject[] = [];

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

export async function fetchSufficientlyLongWikiPages(
  numPages: number
): Promise<WikiPageObject[]> {
  const wikiPageTitles: WikiPageTitleObject[] =
    await fetchRandomWikiPageTitleObjects(numPages);

  const wikiPagesAndTitles: WikiPageObject[] = [];
  for (const wikiPageTitle of wikiPageTitles) {
    const wikiPageContent = await fetchWikiPageContent(wikiPageTitle.title);
    const pageObject = {
      title: wikiPageTitle.title,
      content_raw: wikiPageContent,
      content_censored: "",
      id: wikiPageTitle.id,
    };
    wikiPagesAndTitles.push(pageObject);
  }
  return wikiPagesAndTitles;
}

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

export async function fetchAndSnippetRandomWikiPages(
  numPages: number,
  snippetLength: number
): Promise<WikiPageObject[]> {
  const wikiPageObjects = await fetchRandomWikiPages(numPages);
  const wikiPagesSnippeted: WikiPageObject[] = [];

  for (const wikiPageObject of wikiPageObjects) {
    const raw_censored: string = censorText(
      wikiPageObject.content_raw,
      wikiPageObject.title
    );

    const extractedSnippet: string = extractSnippetFromText(
      raw_censored,
      snippetLength
    );

    const newWikiPage: WikiPageObject = {
      title: wikiPageObject.title,
      content_raw: extractedSnippet,
      content_censored: extractedSnippet,
      id: wikiPageObject.id,
    };
    wikiPagesSnippeted.push(newWikiPage);
  }
  return wikiPagesSnippeted;
}

// async function fetchWikiPageSnippets(numPages: number, snippetLength: number) {
//   const randomWikiPages = await fetchRandomWikiPages(numPages);

//   const snippetsOfWikiPages: string[] = [];
//   // randomWikiPages.forEach((randomWikiPage) =>
//   // )
// }

// async function fetchSnippetOfWikiPage(
//   pageTitle: string,
//   snippetLength: number
// ) {
//   const fullWikiPage = await fetchWikiPage(pageTitle);
//   const words: string[] = fullWikiPage.query.pages[0].extract.split(" ");
//   const beginIndex: number = Math.floor(
//     Math.round(Math.random() * (words.length - snippetLength))
//   );
//   const endIndex = beginIndex + snippetLength;

//   return words.slice(beginIndex, endIndex).join(" ");
// }
