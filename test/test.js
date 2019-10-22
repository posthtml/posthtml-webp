'use strict'

const test = require('ava')
const plugin = require('..')
const { readFileSync } = require('fs')
const path = require('path')
const posthtml = require('posthtml')
const fixtures = path.join(__dirname, 'fixtures')

test('basic', (t) => {
  return compare(t, 'basic')
})

test('Replace extension', (t) => {
  return compare(t, 'extension', {
    replaceExtension: true
  })
})

test('Append extension', (t) => {
  return compare(t, 'no-extension', {
    replaceExtension: false
  })
})

test('Default behaviour', (t) => {
  return compare(t, 'no-extension')
})

test('Multi srcset', (t) => {
  return compare(t, 'multisrcset', {
    replaceExtension: true
  })
})

test('Class ignore', (t) => {
  return compare(t, 'ignore', {
    classIgnore: ['ignore-class']
  })
})

function compare (t, name, options) {
  const html = readFileSync(path.join(fixtures, `${name}.html`), 'utf8')
  const expected = readFileSync(path.join(fixtures, `${name}.expected.html`), 'utf8')

  return posthtml([plugin(options)])
    .process(html)
    .then((res) => t.deepEqual(res.html, expected))
}
