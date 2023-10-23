const api = require("../scripts/api_helper");

test("fetchRandomWikiPageTitles works", async () => {
  const res = await api.fetchRandomWikiPageTitleObjects(3);

  expect(Array.isArray(res)).toBe(true);
  expect(res.length).toBe(3);
  for (const titleObject of res) {
    expect(titleObject.title.length).toBeGreaterThan(0);
    expect(typeof titleObject.title).toBe("string");
    expect(titleObject.id).toBeTruthy();
    expect(typeof titleObject.id).toBe("number");
  }
});

test("fetchWikiPageContent works", async () => {
  const res = await api.fetchWikiPageContent("Denmark");

  expect(typeof res).toBe("string");
  expect(Array.isArray(res)).toBe(false);
  expect(res.length).toBeGreaterThan(0);
});

test("fetchRandomWikiPages works", async () => {
  const num = 3;
  const res = await api.fetchRandomWikiPages(num);

  expect(Array.isArray(res)).toBe(true);
  expect(typeof res[0]).toBe("object");
  expect(res.length).toBe(num);

  expect(typeof res[0].content_raw).toBe("string");
});
