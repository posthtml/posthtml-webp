'use strict'

const test = require('ava')
const plugin = require('..')
const {readFileSync} = require('fs')
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

function compare (t, name, options) {
  const html = readFileSync(path.join(fixtures, `${name}.html`), 'utf8')
  const expected = readFileSync(path.join(fixtures, `${name}.expected.html`), 'utf8')

  return posthtml([plugin(options)])
    .process(html)
    .then((res) => t.truthy(res.html === expected))
}
