/**@jsx jsx */
import {jsx} from '@emotion/core'
import React from 'react'
import {Input, Spinner, Button} from 'components/lib'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {useBookSearch, refetchQueryBookSearch} from 'utils/books'
import {BookRow} from 'components/book-row'
import {Profiler} from 'components/profiler'
import {useAuth} from 'context/context'
import * as colors from 'styles/colors'

function Discover() {
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState()
  const {isLoading, books, isSuccess, isError} = useBookSearch(query)
  const [user] = useAuth()

  React.useEffect(() => {
    return () => refetchQueryBookSearch(query, user)
  }, [user, query])

  function handleSubmit(e) {
    e.preventDefault()
    const {search} = e.target.elements
    setQuery(search.value)
    setQueried(true)
  }

  return (
    <Profiler
      id="Discover Screen"
      phases={['update']}
      metaData={{query, bookCount: books.length}}
    >
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Search books..."
            name="search"
            id="search"
            css={{
              width: '100%',
            }}
          />
          <label
            css={{
              position: 'relative',
              marginLeft: '-2em',
            }}
          >
            <Button css={{padding: '0.2em'}}>
              {isLoading ? (
                <Spinner />
              ) : isError ? (
                <FaTimes aria-label="error" css={{color: colors.danger}} />
              ) : (
                <FaSearch />
              )}
            </Button>
          </label>
        </form>
        {queried ? null : (
          <div css={{textAlign: 'center', fontSize: '1.2em'}}>
            <p>Welcome to the discover page.</p>
            <p>Here, let me load a few books for you...</p>
            {isLoading ? (
              <Spinner />
            ) : isSuccess && books.length ? (
              <p>Here you go! Find more books with the search bar above.</p>
            ) : isSuccess && !books.length ? (
              <p>
                Hmmm... I couldn't find any books to suggest for you. Sorry.
              </p>
            ) : null}
          </div>
        )}

        {books.length ? (
          <ul css={{listStyle: 'none', padding: 0}}>
            {books.map(book => {
              return <BookRow book={book} isLoading={isLoading} key={book.id} />
            })}
          </ul>
        ) : queried ? (
          <div css={{textAlign: 'center', fontSize: '1.2em'}}>
            <p>
              Hmmm... I couldn't find any books with the query "{query}." Please
              try another.
            </p>
          </div>
        ) : null}
      </div>
    </Profiler>
  )
}

export {Discover}
