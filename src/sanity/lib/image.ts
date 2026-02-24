import { createImageUrlBuilder } from '@sanity/image-url'
import { projectId, dataset } from './client'

const imageBuilder = createImageUrlBuilder({
    projectId,
    dataset,
})

export const urlForImage = (source: any) => {
    if (!source) return null
    return imageBuilder.image(source)
}
