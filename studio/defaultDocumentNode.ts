import { DefaultDocumentNodeResolver } from 'sanity/structure'
import { PreviewPane } from './components/PreviewPane'

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
    // Add the preview view to all document types that have a slug
    // We can filter by schemaType if we only want it for specific types
    switch (schemaType) {
        case 'race':
        case 'class':
        case 'subclass':
        case 'background':
            return S.document().views([
                S.view.form(),
                S.view.component(PreviewPane).title('Web Preview'),
            ])
        default:
            return S.document().views([S.view.form()])
    }
}
