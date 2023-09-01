const { normalizeURL } = require('./crawl.js');
const { test, expect } = require('@jest/globals');

// strip protocol
test('normalizeURL strip protocol', () => {
  const input = 'https://blog.boot.dev/path';
  const expected = 'blog.boot.dev/path';

  const actual = normalizeURL(input);

  expect(actual).toEqual(expected);
});

// remove trailing slashes ex: prot:://path//
test('normalizeURL remove trailing slash', () => {
  const input = 'https://blog.boot.dev/path/';
  const expected = 'blog.boot.dev/path';

  const actual = normalizeURL(input);

  expect(actual).toEqual(expected);
});

// if capitals ex: prot:://PATH.com
test('normalizeURL capitals', () => {
  const input = 'https://BLOG.boot.dev/path/';
  const expected = 'blog.boot.dev/path';

  const actual = normalizeURL(input);

  expect(actual).toEqual(expected);
});

// http(s)
test('normalizeURL strip http', () => {
  const input = 'http://BLOG.boot.dev/path/';
  const expected = 'blog.boot.dev/path';

  const actual = normalizeURL(input);

  expect(actual).toEqual(expected);
});
