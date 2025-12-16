import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { media } from 'sanity-plugin-media'

import { defaultDocumentNode } from './defaultDocumentNode'

export default defineConfig({
  name: 'default',
  title: 'D&D Omni-Archive',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'ylk0tk34',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool({ defaultDocumentNode }), visionTool(), media()],

  schema: {
    types: schemaTypes,
  },
})
