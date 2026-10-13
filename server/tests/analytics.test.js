const test = require("node:test");
const assert = require("node:assert/strict");
const { _test } = require("../controllers/analytics.controller");

test("classifies common acquisition sources without retaining full URLs", () => {
  assert.deepEqual(_test.getSource(""), { source: "direct", referrerHost: "" });
  assert.equal(_test.getSource("https://www.google.com/search?q=cognora").source, "search");
  assert.equal(_test.getSource("https://www.linkedin.com/feed/").source, "social");
  assert.deepEqual(_test.getSource("https://example.com/private/path?token=secret"), { source: "external", referrerHost: "example.com" });
});

test("normalizes analytics dates to UTC day boundaries", () => {
  assert.equal(_test.dayStart(new Date("2026-10-13T18:30:00.000Z")).toISOString(), "2026-10-13T00:00:00.000Z");
});

test("admin article validation detects executable markup and counts readable words", () => {
  assert.equal(_test.unsafeHtml("<p>Safe article</p>"), false);
  assert.equal(_test.unsafeHtml("<img src=x onerror=alert(1)>"), true);
  assert.equal(_test.wordCount("<p>One two <strong>three</strong></p>"), 3);
});
