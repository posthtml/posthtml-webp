# posthtml-webp <img align="right" width="220" height="200" title="PostHTML logo" src="http://posthtml.github.io/posthtml/logo.svg">

[![NPM][npm]][npm-url]
[![Deps][deps]][deps-url]
[![Build][build]][build-badge]
[![Coverage][cover]][cover-badge]
[![Standard Code Style][style]][style-url]
[![Chat][chat]][chat-badge]

This plugin add webp supporting in your html. Also supports [`<amp-img>`](https://amp.dev/documentation/components/amp-img/)

## Install
```bash
$ npm i posthtml posthtml-webp
```

## Usage

``` js
const fs = require('fs');
const posthtml = require('posthtml');
const posthtmlWebp = require('posthtml-webp');

posthtml()
    .use(posthtmlWebp(/* Plugin options */))
    .process(html/*, options */)
    .then(result => fs.writeFileSync('./after.html', result.html));
```
## Example 

Before:
``` html
<img src="image.jpg">
<amp-img alt="photo" width="550" height="368" layout="responsive" src="photo.png"></amp-img>
```

After:
``` html
<picture>
    <source type="image/webp" srcset="image.jpg.webp">
    <img src="image.jpg">
</picture>
<amp-img alt="photo" width="550" height="368" layout="responsive" src="photo.png.webp">
    <amp-img alt="photo" width="550" height="368" layout="responsive" src="photo.png" fallback=""></amp-img>
</amp-img>
```

## Options

#### `replaceExtension`

Type: `Boolean`  
Default: `false`  
Description: *Replace the extension of the source image with .webp instead of appending .webp to the original filename*  
Example: `image.jpg => image.webp (instead of image.jpg.webp)`

#### `classIgnore`

Type: `Array<string>`  
Default: `[]`  
Description: *list of classes for which the transformation will be ignored*  
Example: `classIgnore: ['ignore-webp']` will ignore transformation for images with the class `ignore-web` 

#### `extensionIgnore`

Type: `Array<string>`  
Default: `[]`  
Description: *list of extension for which the transformation will be ignored*  
Example: `extensionIgnore: ['svg']` will ignore transformation for images with the `svg` extension

#### `lazySrcset`

Type: `String`  
Default: `data-srcset`  
Description: *The attribute used for lazy webp loading. Use it if you have lazy attribute for `srcset` on your images. It will be set on created `<source>` to later be processed by external lazy loading library.*  
Example: `lazySrcset: 'my-srcset'` will set `my-srcset` attribute on `<source>`

#### `lazySrc`

Type: `String`  
Default: `data-src`  
Description: *The attribute used for lazy webp loading. The original `<img>` may not contain `src` at all, but instead some custom lazy-loading attribute. Or it may contain just a placeholder image inside `src` which shouldn't be used for webp conversion. `lazySrc` will define a custom attribute name to look at when processing your lazy loaded images. Note that `lazySrcset` is still needed even if `<img>` has only `lazySrc` defined, because `srcset` is the mechanism for defining a source file for the `<source>`. See `lazySrcset` option description.*  
Example: `lazySrc: 'my-src'` will convert an image inside `my-src` attribute, instead of regular `src`.

### License [MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/posthtml-webp.svg
[npm-url]: https://npmjs.com/package/posthtml-webp

[deps]: https://david-dm.org/posthtml/posthtml-webp.svg
[deps-url]: https://david-dm.org/posthtml/posthtml-webp

[style]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[style-url]: http://standardjs.com/

[build]: https://travis-ci.org/posthtml/posthtml-webp.svg
[build-badge]: https://travis-ci.org/posthtml/posthtml-webp

[cover]: https://coveralls.io/repos/posthtml/posthtml-webp/badge.svg
[cover-badge]: https://coveralls.io/r/posthtml/posthtml-webp

[chat]: https://badges.gitter.im/posthtml/posthtml.svg
[chat-badge]: https://gitter.im/posthtml/posthtml?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"
