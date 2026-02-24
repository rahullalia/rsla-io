import { createClient } from '@sanity/client'

// Use VITE_ env vars instead of NEXT_PUBLIC_
export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'yz25oyux'
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2025-03-01'

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true, // Enable CDN for faster reads (edge caching)
    token: import.meta.env.VITE_SANITY_API_TOKEN,
})
