'use strict'

module.exports = function (options) {
  if (!options) {
    options = {}
  }

  if (options.replaceExtension === undefined) {
    options.replaceExtension = false
  }

  return function posthtmlWebp (tree) {
    tree.match({ tag: 'img' }, function (imgNode) {
      if (imgNode.skip) return imgNode
      return getPicture(imgNode, options)
    })

    tree.match({ tag: 'amp-img' }, function (imgNode) {
      if (imgNode.skip) return imgNode
      return getAmpPicture(imgNode, options)
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
  if (options.replaceExtension) {
    src = removeExtension(src)
  }
  src += '.webp'

  return {
    tag: 'picture',
    content: [
      {
        tag: 'source',
        attrs: {
          type: 'image/webp',
          srcset: src
        }
      },
      imgNode
    ]
  }
}
