import { Card, Text } from '@sanity/ui'
import React from 'react'
import { UserViewComponent } from 'sanity/structure'

// Use the local frontend URL for preview
const FRONTEND_URL = 'http://localhost:5173'

export const PreviewPane: UserViewComponent = ({ document }) => {
    const { displayed } = document
    const { slug } = displayed as any

    if (!slug?.current) {
        return (
            <Card tone="caution" padding={4} radius={2} shadow={1}>
                <Text>The document needs a slug to be previewed.</Text>
            </Card>
        )
    }

    // Determine the path based on the document type
    let path = ''
    switch (displayed._type) {
        case 'race':
        case 'class':
        case 'subclass':
        case 'background':
            // Currently, the frontend seems to render these in the Character Creator or Library.
            // Since specific detail pages for these might not exist or depend on state,
            // we'll point to the relevant library section or creator for now.
            // Ideally, we'd have dedicated routes like /race/:slug, but for now we'll route to Library.
            // Based on App.tsx, we have /library and /creator.
            // Let's try to pass the ID or slug as a query param if supported, or just open the relevant page.
            // For now, we'll default to the home page with a suggestion to navigate.
            // But actually, looking at App.tsx, there are no dynamic routes like /library/:id.
            // So the preview might just show the main page.
            // Let's just point to the root for now, as specific preview routing requires frontend changes.
            path = `/?preview=${displayed._type}&slug=${slug.current}`
            break
        default:
            path = `/?preview=${displayed._type}&slug=${slug.current}`
    }

    const url = `${FRONTEND_URL}${path}`

    return (
        <Card style={{ width: '100%', height: '100%' }}>
            <iframe
                style={{ width: '100%', height: '100%', border: 'none' }}
                src={url}
                title="Web Preview"
            />
        </Card>
    )
}
