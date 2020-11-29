import {useQuery, queryCache} from 'react-query'
import {client} from 'utils/api-client'
import {useClient} from 'context/context'

import imgLoading from 'assets/book-placeholder.svg'

const bookLoading = {
  author: 'loading...',
  coverImageUrl: imgLoading,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  title: 'Loading...',
  isLoadingBook: true,
}

const loadingBooks = Array(10)
  .fill(null)
  .map((item, index) => {
    return {
      id: `loading-book-${index}`,
      ...bookLoading,
    }
  })

function useBook(bookId) {
  const client = useClient()
  const result = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`).then(data => data.book),
  })
  return {...result, book: result?.data ?? bookLoading}
}

function useBookSearch(query) {
  const client = useClient()
  const result = useQuery({
    queryKey: ['book-search', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`).then(
        data => data.books,
      ),
    config: {
      onSuccess: books => {
        for (const book of books) {
          setQueryDataBooks(book)
        }
      },
    },
  })
  return {...result, books: result.data ?? loadingBooks}
}

function setQueryDataBooks(book) {
  queryCache.setQueryData(['book', {bookId: book.id}], book)
}

async function refetchQueryBookSearch(query, user) {
  queryCache.removeQueries('book-search')
  await queryCache.prefetchQuery({
    queryKey: ['book-search', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data.books),
    config: {
      onSuccess: books => {
        for (const book of books) {
          setQueryDataBooks(book)
        }
      },
    },
  })
}

export {useBookSearch, useBook, setQueryDataBooks, refetchQueryBookSearch}
