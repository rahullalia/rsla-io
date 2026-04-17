/**
 * fixGenericHeadings.mjs
 *
 * Removes "Introduction" H2 blocks and replaces "Conclusion" H2 text
 * with "The bottom line" across all published blogPostV2 posts.
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

const SANITY_TOKEN = readFileSync('/Users/rahullalia/lalia/4-Resources/mcp/sanity.env', 'utf-8')
  .split('\n')
  .find(line => line.startsWith('SANITY_API_TOKEN_V2='))
  ?.split('=')[1]
  ?.trim()

if (!SANITY_TOKEN) throw new Error('Missing SANITY_API_TOKEN_V2 in sanity.env')

const client = createClient({
  projectId: 'yz25oyux',
  dataset: 'production',
  apiVersion: '2025-03-01',
  token: SANITY_TOKEN,
  useCdn: false,
})

// Posts with "Introduction" H2 — block will be removed entirely
const introductions = [
  { id: '4h6ZovbNJGIiFWW2xZWva7', key: '9fd9f8c2-0e2' },
  { id: '4h6ZovbNJGIiFWW2xZWySF', key: 'e845c0e9-494' },
  { id: '4h6ZovbNJGIiFWW2xZX26x', key: 'b675f4ce-59d' },
  { id: '4h6ZovbNJGIiFWW2xZX3c4', key: '3a2ef5e7-2ed' },
  { id: '4h6ZovbNJGIiFWW2xZX3wJ', key: 'e2498646-66a' },
  { id: '4h6ZovbNJGIiFWW2xZX4GY', key: '18f78417-b6f' },
  { id: '4h6ZovbNJGIiFWW2xZX4mw', key: 'd75e8594-8c5' },
  { id: '4h6ZovbNJGIiFWW2xZX5NN', key: '6cd0c0b3-cf4' },
  { id: '4h6ZovbNJGIiFWW2xZX6UC', key: 'c17dcbcb-6d5' },
  { id: '4h6ZovbNJGIiFWW2xZX7Os', key: 'cbb4f2e5-b30' },
  { id: '4h6ZovbNJGIiFWW2xZX7j7', key: '4ec6843a-547' },
  { id: '4h6ZovbNJGIiFWW2xamFKS', key: '7fc9be12-db6' },
  { id: '4h6ZovbNJGIiFWW2xamTpC', key: 'ac9da674-507' },
  { id: '4h6ZovbNJGIiFWW2xamU5O', key: '79d33c62-02c' },
  { id: '4h6ZovbNJGIiFWW2xamXDi', key: '3d2cad08-db9' },
  { id: 'r5ze5pNXPqeIpD1SeOF4YZ', key: '1ce83e0ffb5f' },
  { id: 'r5ze5pNXPqeIpD1SeOF4zv', key: '0c88c2c0-9cf' },
  { id: 'r5ze5pNXPqeIpD1SeOF56l', key: 'c81c96a2-d1e' },
  { id: 'r5ze5pNXPqeIpD1SeOF5ln', key: '460d3922-2ec' },
  { id: 'r5ze5pNXPqeIpD1SeOk0th', key: '69799026-7a9' },
  { id: 'yfy9cLha6032ya4d21mg4n', key: 'da97b33c-18f' },
  { id: 'yfy9cLha6032ya4d21mg7S', key: '49c654fb-3bf' },
  { id: 'yfy9cLha6032ya4d21mgA7', key: '48c93ac8-1ec' },
  { id: 'yfy9cLha6032ya4d21mgCm', key: 'd49bf424-e88' },
  { id: 'yfy9cLha6032ya4d21y7ky', key: '8d7ddb93-07c' },
  { id: 'yfy9cLha6032ya4d21y7oh', key: '4d0c9a7f-ece' },
  { id: 'yfy9cLha6032ya4d21y9UU', key: '8d66bea1-078' },
  { id: 'yfy9cLha6032ya4d21y9YD', key: '44d9b19b-a06' },
]

// Posts with "Conclusion" H2 — text will be replaced with "The bottom line"
const conclusions = [
  { id: '4h6ZovbNJGIiFWW2xZWva7', key: '1a792a40-6c5' },
  { id: '4h6ZovbNJGIiFWW2xZWySF', key: 'a548c18b-e87' },
  { id: '4h6ZovbNJGIiFWW2xZX26x', key: '56f3b422-40c' },
  { id: '4h6ZovbNJGIiFWW2xZX3c4', key: 'dd55642e-d7d' },
  { id: '4h6ZovbNJGIiFWW2xZX3wJ', key: '19e36fee-b99' },
  { id: '4h6ZovbNJGIiFWW2xZX4GY', key: '1de66aab-722' },
  { id: '4h6ZovbNJGIiFWW2xZX4mw', key: 'f82ae8e7-d71' },
  { id: '4h6ZovbNJGIiFWW2xZX5NN', key: '30397c98-f3b' },
  { id: '4h6ZovbNJGIiFWW2xZX6UC', key: 'dc9f9be5-c7a' },
  { id: '4h6ZovbNJGIiFWW2xZX7Os', key: 'babc5d54-a06' },
  { id: '4h6ZovbNJGIiFWW2xZX7j7', key: 'f03f64f4-8e8' },
  { id: '4h6ZovbNJGIiFWW2xamFKS', key: '8415e341-92a' },
  { id: '4h6ZovbNJGIiFWW2xamTpC', key: '023d5940-1cf' },
  { id: '4h6ZovbNJGIiFWW2xamU5O', key: 'ce5ef1dc-e03' },
  { id: '4h6ZovbNJGIiFWW2xamXDi', key: '15664bc3-42e' },
  { id: 'r5ze5pNXPqeIpD1SeOF4YZ', key: 'aef87b52b7ac' },
  { id: 'r5ze5pNXPqeIpD1SeOF4zv', key: 'd64521d0-50f' },
  { id: 'r5ze5pNXPqeIpD1SeOF56l', key: 'f95b13ac-79b' },
  { id: 'r5ze5pNXPqeIpD1SeOF5ln', key: 'b5609ee7-938' },
  { id: 'r5ze5pNXPqeIpD1SeOk0th', key: '51fbfb52-77c' },
  { id: 'yfy9cLha6032ya4d21mg7S', key: '8e5db1eb-254' },
  { id: 'yfy9cLha6032ya4d21mgCm', key: '4558c668-462' },
  { id: 'yfy9cLha6032ya4d21y7ky', key: '7b98bad5-e0a' },
  { id: 'yfy9cLha6032ya4d21y7oh', key: '2ad0a513-e8b' },
  { id: 'yfy9cLha6032ya4d21y9UU', key: '3dcd7d2b-21f' },
  { id: 'yfy9cLha6032ya4d21y9YD', key: '91ae29f5-8f8' },
]

async function run() {
  // Group all operations by document ID so we can combine them
  const opsById = new Map()

  for (const { id, key } of introductions) {
    if (!opsById.has(id)) opsById.set(id, { unset: [], set: {} })
    opsById.get(id).unset.push(`body[_key=="${key}"]`)
  }

  for (const { id, key } of conclusions) {
    if (!opsById.has(id)) opsById.set(id, { unset: [], set: {} })
    opsById.get(id).set[`body[_key=="${key}"].children[0].text`] = 'The bottom line'
  }

  const mutations = []
  for (const [id, ops] of opsById) {
    const patch = { id }
    if (ops.unset.length > 0) patch.unset = ops.unset
    if (Object.keys(ops.set).length > 0) patch.set = ops.set
    mutations.push({ patch })
  }

  console.log(`Sending ${mutations.length} mutations (${introductions.length} intro removals + ${conclusions.length} conclusion renames)...`)

  const result = await client.mutate(mutations)
  console.log(`Done. Transaction: ${result.transactionId}`)
  console.log(`Results: ${result.results.length} documents updated`)
}

run().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
