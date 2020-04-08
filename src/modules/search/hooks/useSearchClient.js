import algoliasearch from 'algoliasearch/lite'
import { useMemo } from 'react'

/**
 * Returns algolia search client
 * @param {*} algoliaId
 * @param {*} algoliaKey
 */
export const useSearchClient = (algoliaId, algoliaKey) =>
  useMemo(() => {
    let client = false
    try {
      const algoliaClient = algoliasearch(
        algoliaId,
        algoliaKey,
        {
          _useRequestCache: true
        }
      )
      client = {
        search(requests) {
          // only search when non-empty string
          const shouldSearch = requests.some(
            ({ params: { query } }) => query !== ''
          )
          if (!shouldSearch)
            return Promise.resolve({
              results: [{ hits: [] }]
            })
          return algoliaClient.search(requests)
        },
        searchForFacetValues: algoliaClient.searchForFacetValues
      }
    } catch (e) {
      console.error(e.message)
    } finally {
      return client
    }
  }, [algoliaId, algoliaKey])
