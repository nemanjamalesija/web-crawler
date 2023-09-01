const { normalizeURL, getURLsFomHTML } = require('./crawl.js');
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

// getURLsFomHTML
test('getURLsFomHTML', () => {
  const inputHTMLBody = `<html> 
               <body> 
                  <a 
                   href="http://blog.boot.dev/path">My blog
                 </a>
               </body>  
            </html>`;

  const inputBaseURL = 'http://blog.boot.dev/path';

  const expected = ['http://blog.boot.dev/path'];

  const actual = getURLsFomHTML(inputHTMLBody, inputBaseURL);

  expect(actual).toEqual(expected);
});

// account for relative URLS
test('getURLsFomHTML', () => {
  const inputHTMLBody = `<html> 
               <body> 
                   <a 
                   href="/path">My blog
                 </a>
               </body>  
            </html>`;

  const inputBaseURL = 'http://blog.boot.dev';

  const expected = ['http://blog.boot.dev/path'];

  const actual = getURLsFomHTML(inputHTMLBody, inputBaseURL);

  expect(actual).toEqual(expected);
});

// test for both absolute and relative URLS
test('getURLsFomHTML', () => {
  const inputHTMLBody = `<html> 
               <body> 
                 <a 
                   href="http://blog.boot.dev/path1">My blog 1
                 </a>
                   <a 
                   href="/path2">My blog 2
                 </a>
               </body>  
            </html>`;

  const inputBaseURL = 'http://blog.boot.dev';

  const expected = ['http://blog.boot.dev/path1', 'http://blog.boot.dev/path2'];

  const actual = getURLsFomHTML(inputHTMLBody, inputBaseURL);

  expect(actual).toEqual(expected);
});

// test for invalid URL
test('getURLsFomHTML', () => {
  const inputHTMLBody = `<html> 
               <body> 
                 <a 
                   href="invalid URL">My blog 1
                 </a>
               </body>  
            </html>`;

  const inputBaseURL = 'http://blog.boot.dev';

  const expected = [];

  const actual = getURLsFomHTML(inputHTMLBody, inputBaseURL);

  expect(actual).toEqual(expected);
});
