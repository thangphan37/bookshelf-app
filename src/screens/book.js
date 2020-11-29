/**@jsx jsx */
import {jsx} from '@emotion/core'
import {StatusButton} from 'components/status-buttons'
import {useParams} from 'react-router-dom'
import {useListItems} from 'utils/list-items'
import {useBook} from 'utils/books'
import {formatTime} from 'utils/date'
import {FaRegCalendarAlt} from 'react-icons/fa'
import {Rating} from 'components/rating'
import {useUpdateListItem} from 'utils/list-items'
import {Spinner, ErrorMessage} from 'components/lib'
import {Profiler} from 'components/profiler'
import React from 'react'
import debounceFn from 'debounce-fn'
import Tooltip from '@reach/tooltip'
import * as colors from 'styles/colors'
import * as md from 'styles/media-queries'

function BookScreen() {
  const {bookId} = useParams()
  const {book, isLoading} = useBook(bookId)
  const [update, {isLoading: isPending, isError, error}] = useUpdateListItem()
  const debounceUpdate = React.useMemo(() => debounceFn(update, {wait: 300}), [
    update,
  ])
  const handleChange = e => {
    debounceUpdate({id: listItem?.id, notes: e.target.value})
  }
  const listItems = useListItems()
  const listItem = listItems?.find(li => li.bookId === bookId) ?? null

  return (
    <Profiler
      id="Book Screen"
      phases={['update']}
      metaData={{bookId, listItemId: listItem?.id}}
    >
      <div>
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gridGap: '1.5em',
            [md.small]: {
              gridTemplateColumns: 'auto',
            },
          }}
        >
          <img
            src={book.coverImageUrl}
            alt={book.title}
            width="100%"
            css={{
              maxWidth: '14rem',
            }}
          />
          <div>
            <div css={{display: 'flex', justifyContent: 'space-between'}}>
              <div>
                <h1>{book.title}</h1>
                <div css={{flex: 1}}>
                  <i>{book.author}</i>
                  <span css={{marginLeft: 6, marginRight: 6}}>|</span>
                  <i>{book.publisher}</i>
                </div>
              </div>
              <div
                css={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  minHeight: 100,
                }}
              >
                <StatusButton bookId={book.id} />
              </div>
            </div>
            <div css={{minHeight: 46, marginBottom: '2rem'}}>
              {listItem?.finishDate && !book.isLoadingBook ? (
                <Rating listItem={listItem} />
              ) : null}
              {listItem ? (
                <Tooltip
                  label={`${
                    listItem.finishDate ? 'Start and finish date' : 'Start date'
                  }`}
                >
                  <div
                    css={{display: 'flex', alignItems: 'center'}}
                    aria-label={
                      listItem.finishDate
                        ? 'Start and finish date'
                        : 'Start date'
                    }
                  >
                    <FaRegCalendarAlt />
                    <div css={{marginLeft: '0.5em'}}>
                      {formatTime(listItem.startDate)}
                      {listItem.finishDate ? (
                        <span>{' — ' + formatTime(listItem.finishDate)}</span>
                      ) : null}
                    </div>
                  </div>
                </Tooltip>
              ) : null}
            </div>
            <p css={{whiteSpace: 'break-spaces', display: 'block'}}>
              {book.synopsis}
            </p>
          </div>
        </div>
        {listItem && !isLoading ? (
          <div css={{marginTop: 46}}>
            <label htmlFor="notes" css={{fontWeight: 'bold'}}>
              Notes {isPending ? <Spinner /> : null}
            </label>
            {isError ? <ErrorMessage error={error} /> : null}
            <textarea
              onChange={handleChange}
              id="notes"
              defaultValue={listItem.notes}
              css={{
                width: '100%',
                maxHeight: '300px',
                minHeight: '300px',
                border: 'none',
                paddingLeft: '0.5rem',
                background: colors.gray20,
              }}
            />
          </div>
        ) : null}
      </div>
    </Profiler>
  )
}

export {BookScreen}
