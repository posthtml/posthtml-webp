'use strict'

module.exports = function (options) {
  if (!options) {
    options = {}
  }

  if (options.classIgnore === undefined) {
    options.classIgnore = []
  }

  if (options.extensionIgnore === undefined) {
    options.extensionIgnore = []
  }

  if (options.replaceExtension === undefined) {
    options.replaceExtension = false
  }

  return function posthtmlWebp (tree) {
    tree.match([{ tag: 'img' }, { tag: 'amp-img' }], function (imgNode) {
      if (imgNode.skip) return imgNode
      var classes = imgNode.attrs && imgNode.attrs.class && (imgNode.attrs.class.split(' ') || [])
      var extension = imgNode.attrs.src.split('.').pop()
      var isIgnoredByClass = options.classIgnore.filter(className => classes.includes(className)).length > 0
      var isIgnoredByExtension = options.extensionIgnore.filter(fileExtension => fileExtension === extension).length > 0
      var isIgnore = isIgnoredByClass || isIgnoredByExtension
      if (isIgnore) return imgNode
      switch (imgNode.tag) {
        case 'amp-img':
          return getAmpPicture(imgNode, options)
        default:
          return getPicture(imgNode, options)
      }
    })

    return tree
  }
}

function removeExtension (filename) {
  var extIndex = filename.lastIndexOf('.')
  if (extIndex === -1) {
    // Filename has no extension
    return filename
  } else {
    return filename.substring(0, extIndex)
  }
}

function getAmpPicture (imgNode, options) {
  imgNode.skip = true

  var src = imgNode.attrs.src
  if (options.replaceExtension) {
    src = removeExtension(src)
  }
  src += '.webp'
  return {
    tag: 'amp-img',
    attrs: {
      ...imgNode.attrs,
      src
    },
    content: [
      {
        ...imgNode,
        attrs: {
          ...imgNode.attrs,
          fallback: ''
        }
      }
    ]
  }
}

function getPicture (imgNode, options) {
  imgNode.skip = true

  var src = imgNode.attrs.src
  var srcset = (imgNode.attrs.srcset || '')
    .split(',')
    .concat(src)
    .filter(Boolean)
    .map(value => {
      value = value.trim().split(/\s/)
      var path = options.replaceExtension ? removeExtension(value[0]) : value[0]
      var size = value[1]

      return [path + '.webp', size].filter(Boolean).join(' ')
    })
    .join(', ')

  return {
    tag: 'picture',
    content: [
      {
        tag: 'source',
        attrs: {
          type: 'image/webp',
          srcset
        }
      },
      imgNode
    ]
  }
}
