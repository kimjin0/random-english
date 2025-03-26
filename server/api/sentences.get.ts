// Nuxt 3 API endpoint using fs to read local JSON file
// File: /server/api/sentences.get.ts

import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  console.log('sentences.get')
  const filePath = join(process.cwd(), 'server/data/sentences.json')
  const json = await readFile(filePath, 'utf-8')
  return JSON.parse(json)
})
