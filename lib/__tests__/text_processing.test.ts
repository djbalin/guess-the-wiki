import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { censorText, extractSnippetFromText } from "@/lib/text_processing";

describe("censorText", () => {
  it("censors title words that appear in the body", () => {
    assert.equal(
      censorText("Nirvana was an American rock band.", "Nirvana", "en"),
      "### was an American rock band.",
    );
  });

  it("matches case-insensitively", () => {
    assert.equal(
      censorText("nirvana was formed in 1987.", "Nirvana", "en"),
      "### was formed in 1987.",
    );
  });

  it("does not censor a title word inside a longer word", () => {
    assert.equal(
      censorText("The Kingdom of Denmark. King Frederik.", "King", "en"),
      "The Kingdom of Denmark. ### Frederik.",
    );
  });

  it("does not throw on titles containing regex metacharacters", () => {
    assert.equal(
      censorText("C++ is a programming language.", "C++", "en"),
      "C++ is a programming language.",
    );
    assert.doesNotThrow(() => censorText("A pop group.", "*NSYNC", "en"));
    assert.doesNotThrow(() =>
      censorText("A rock band.", "Nirvana (band)", "en"),
    );
  });

  it("censors title words wrapped in punctuation", () => {
    assert.equal(
      censorText("Nirvana was a band.", "Nirvana (band)", "en"),
      "### was a ###.",
    );
  });

  it("leaves the text untouched when there is nothing to censor", () => {
    const text = "It is a 1986 horror novel.";
    assert.equal(censorText(text, "It", "en"), text);
    assert.equal(censorText(text, "The", "en"), text);
  });

  it("collapses runs of adjacent censored words into one marker", () => {
    assert.equal(
      censorText("Bjarne Stroustrup wrote it.", "Bjarne Stroustrup", "en"),
      "### wrote it.",
    );
  });

  it("skips stop words in the article's own language", () => {
    // "aber" is a common German word and must not be censored.
    assert.equal(censorText("aber Berlin", "aber Berlin", "de"), "aber ###");
  });
});

describe("extractSnippetFromText", () => {
  const text = Array.from({ length: 100 }, (_, i) => `w${i}`).join(" ");

  it("returns a snippet of the requested length", () => {
    assert.equal(extractSnippetFromText(text, 10, 0.5).split(" ").length, 10);
  });

  it("is deterministic for a given seeded value", () => {
    assert.equal(
      extractSnippetFromText(text, 10, 0.42),
      extractSnippetFromText(text, 10, 0.42),
    );
  });

  it("stays within bounds at the extremes of the seeded value", () => {
    assert.equal(extractSnippetFromText(text, 10, 0), "w0 w1 w2 w3 w4 w5 w6 w7 w8 w9");
    assert.equal(
      extractSnippetFromText(text, 10, 1),
      "w90 w91 w92 w93 w94 w95 w96 w97 w98 w99",
    );
  });

  it("returns the whole text when it is shorter than the snippet", () => {
    assert.equal(extractSnippetFromText("a b c", 10, 0.5), "a b c");
  });

  it("drops the references section", () => {
    assert.equal(
      extractSnippetFromText("body text == References == junk here", 3, 0),
      "body text",
    );
  });

  it("strips wiki header markers", () => {
    assert.equal(extractSnippetFromText("== History == one two", 3, 0), "History one two");
  });
});
