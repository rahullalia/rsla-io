import { createImageUrlBuilder } from '@sanity/image-url'
import { projectId, dataset } from './client'

const imageBuilder = createImageUrlBuilder({
    projectId,
    dataset,
})

export const urlForImage = (source: Parameters<typeof imageBuilder.image>[0]) => {
    if (!source) return null
    return imageBuilder.image(source).auto('format').quality(80)
}
