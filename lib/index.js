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

    if (options.lazySrc === undefined) {
        options.lazySrc = 'data-src'
    }

    if (options.lazySrcset === undefined) {
        options.lazySrcset = 'data-srcset'
    }

    if (options.extension === undefined) {
        options.extension = '.webp'
    }

    return function posthtmlWebp(tree) {
        tree.match([{ tag: 'img' }, { tag: 'amp-img' }], function (imgNode) {
            if (imgNode.skip) return imgNode
            var classes = (imgNode.attrs && imgNode.attrs.class && imgNode.attrs.class.split(' ')) || []
            // Extract extension from lazy loading attribute, because it always contains the right image. (`src` can contain "preview")
            // Use `src` if there are no lazy loading attributes.
            var extension = (imgNode.attrs[options.lazySrc] || imgNode.attrs[options.lazySrcset] || imgNode.attrs.src || imgNode.attrs.srcset).split('.').pop().split(/\s+/)[0]
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

function removeExtension(filename) {
    var extIndex = filename.lastIndexOf('.')
    if (extIndex === -1) {
        // Filename has no extension
        return filename
    } else {
        return filename.substring(0, extIndex)
    }
}

function getAmpPicture(imgNode, options) {
    imgNode.skip = true

    var src = imgNode.attrs.src
    if (options.replaceExtension) {
        src = removeExtension(src)
    }
    src += options.extension
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

function getPicture(imgNode, options) {
    imgNode.skip = true
    var srcset = (imgNode.attrs.srcset || imgNode.attrs[options.lazySrcset] || imgNode.attrs[options.lazySrc] || imgNode.attrs.src)
        .split(',')
        .filter(Boolean)
        .map(value => {
            value = value.trim().split(/\s/)
            var path = options.replaceExtension ? removeExtension(value[0]) : value[0]
            var size = value[1]

            return [path + options.extension, size].filter(Boolean).join(' ')
        })
        .join(', ')

    var sourceAttrs = {
        type: 'image/webp'
    }

    sourceAttrs[imgNode.attrs[options.lazySrcset] || imgNode.attrs[options.lazySrc] ? options.lazySrcset : 'srcset'] = srcset

    return {
        tag: 'picture',
        content: [
            {
                tag: 'source',
                attrs: sourceAttrs
            },
            imgNode
        ]
    }
}
