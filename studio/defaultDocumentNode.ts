import { DefaultDocumentNodeResolver } from 'sanity/structure'
import { PreviewPane } from './components/PreviewPane'

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
    // Frontend live preview tab for relevant library content types
    const previewTypes = ['race', 'species', 'class', 'subclass', 'background', 'spell', 'item', 'feat']
    
    if (previewTypes.includes(schemaType)) {
        return S.document().views([
            S.view.form(),
            S.view.component(PreviewPane).title('Web Preview')
        ])
    }

    return S.document().views([
        S.view.form()
    ])
}
