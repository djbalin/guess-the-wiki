import { LanguageCode } from "@/types/language";

const limit = 50;
const exploreLimit = 50;

export function findCategoriesUrl(search: string, languageCode: LanguageCode) {
  return `https://${languageCode}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(search)}&gsrlimit=${limit}&gsrnamespace=14&prop=info&inprop=url&format=json&origin=*&redirects`;
}

export function getSubcategoriesUrl(
  categoryTitle: string,
  languageCode: LanguageCode,
) {
  const normalizedTitle = normalizeCategoryTitle(categoryTitle);
  return `https://${languageCode}.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(normalizedTitle)}&cmtype=subcat&cmlimit=${limit}&prop=info&inprop=url&format=json&origin=*`;
}

export function findPagesInCategoryUrl(
  search: string,
  languageCode: LanguageCode,
) {
  return `https://${languageCode}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(search)}&gsrlimit=${limit}&prop=info&inprop=url&format=json&origin=*&redirects`;
}

function getCategoryContentsUrl(
  categoryTitle: string,
  languageCode: LanguageCode,
) {
  const normalizedTitle = normalizeCategoryTitle(categoryTitle);
  return `https://${languageCode}.wikipedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=${encodeURIComponent(normalizedTitle)}&gcmtype=subcat|page&gcmlimit=${exploreLimit}&prop=info&inprop=url&format=json&origin=*&redirects`;
}

export type WikiResult = {
  title: string;
  fullurl: string;
  pageid: number;
};

export type CategoryContents = {
  subcategories: WikiResult[];
  pages: WikiResult[];
};

export async function fetchCategoryTitles(
  query: string,
  languageCode: LanguageCode,
): Promise<WikiResult[]> {
  const result = await fetch(findCategoriesUrl(query, languageCode));
  if (!result.ok) {
    throw new Error(
      `HTTP error! status: ${result.status} (${result.statusText})`,
    );
  }
  const json = await result.json();
  const categories = Object.values(json.query.pages) as WikiResult[];
  return categories;
}

function normalizeCategoryTitle(categoryTitle: string) {
  return categoryTitle.startsWith("Category:")
    ? categoryTitle
    : `Category:${categoryTitle}`;
}

export async function fetchSubcategories(
  categoryTitle: string,
  languageCode: LanguageCode,
): Promise<WikiResult[]> {
  const result = await fetch(getSubcategoriesUrl(categoryTitle, languageCode));
  if (!result.ok) {
    throw new Error(
      `HTTP error! status: ${result.status} (${result.statusText})`,
    );
  }
  const data = await result.json();
  console.log(data);
  return Object.values(data.query.categorymembers) as WikiResult[];
}

export async function fetchPagesInCategory(
  query: string,
  languageCode: LanguageCode,
): Promise<WikiResult[]> {
  const result = await fetch(findPagesInCategoryUrl(query, languageCode));
  if (!result.ok) {
    throw new Error(
      `HTTP error! status: ${result.status} (${result.statusText})`,
    );
  }
  const data = await result.json();
  return Object.values(data.query.pages) as WikiResult[];
}

/**
 * Fetch the immediate members of a category, split into subcategories
 * (namespace 14) and articles (namespace 0). Uses `generator=categorymembers`
 * so each result includes `fullurl` for direct links.
 */
export async function fetchCategoryContents(
  categoryTitle: string,
  languageCode: LanguageCode,
): Promise<CategoryContents> {
  const result = await fetch(
    getCategoryContentsUrl(categoryTitle, languageCode),
  );
  if (!result.ok) {
    throw new Error(
      `HTTP error! status: ${result.status} (${result.statusText})`,
    );
  }
  const data = await result.json();
  const rawPages = (data.query?.pages ?? {}) as Record<
    string,
    WikiResult & { ns: number }
  >;

  const subcategories: WikiResult[] = [];
  const pages: WikiResult[] = [];
  for (const item of Object.values(rawPages)) {
    const { title, fullurl, pageid, ns } = item;
    if (ns === 14) {
      subcategories.push({ title, fullurl, pageid });
    } else if (ns === 0) {
      pages.push({ title, fullurl, pageid });
    }
  }

  subcategories.sort((a, b) => a.title.localeCompare(b.title));
  pages.sort((a, b) => a.title.localeCompare(b.title));

  return { subcategories, pages };
}
