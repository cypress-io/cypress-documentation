import { DocSearch } from '@docsearch/react'
import '@docsearch/css'

export default function SearchAlgolia() {
  return (
    <DocSearch
      appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY}
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
      disableUserPersonalization={true}
    />
  )
}
