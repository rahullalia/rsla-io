import { createClient } from '@sanity/client'

export const projectId = 'yz25oyux'
export const dataset = 'production'
export const apiVersion = '2025-03-01'

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    token: import.meta.env.VITE_SANITY_API_TOKEN,
})
