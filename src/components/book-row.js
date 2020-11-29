/**@jsx jsx */
import {jsx} from '@emotion/core'
import {StatusButton} from 'components/status-buttons'
import {Link} from 'react-router-dom'
import {Rating} from 'components/rating'
import {useListItems} from 'utils/list-items'
import * as colors from 'styles/colors'

function BookRow({book}) {
  const listItems = useListItems()
  const listItem = listItems?.find(li => li.bookId === book.id) || null
  return (
    <li
      key={book.id}
      css={{
        padding: '1.2em',
        marginBottom: '1em',
        gridGap: '1em',
        border: `solid 1px ${colors.gray10}`,
        position: 'relative',
        minHeight: '270px',
      }}
    >
      <Link
        to={`/book/${book.id}`}
        css={{
          color: colors.text,
          '&:hover': {
            color: colors.text,
            textDecoration: 'none',
          },
        }}
      >
        <div
          css={{
            width: '100%',
            gridGap: '1em',
            gridTemplateColumns: '1fr 3fr',
            display: 'grid',
          }}
        >
          <div css={{width: '140px'}}>
            <img
              src={book.coverImageUrl}
              alt={book.title}
              css={{width: '100%'}}
            />
          </div>
          <div css={{display: 'flex', flexDirection: 'column'}}>
            <div
              css={{
                display: 'grid',
                gridTemplateColumns: '2fr auto',
                justifyContent: 'center',
                alignItems: 'center',
                gridGap: '1em',
              }}
            >
              <div css={{display: 'flex', flexDirection: 'column'}}>
                <h3 css={{color: colors.indigo}}>{book.title}</h3>
                {listItem?.finishDate ? <Rating listItem={listItem} /> : null}
              </div>

              <div
                css={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '0.9em',
                }}
              >
                <i>{book.author}</i>
                <small>{book.publisher}</small>
              </div>
            </div>
            <small css={{whiteSpace: 'break-spaces'}}>
              {book.synopsis.substring(0, 500) + '...'}
            </small>
          </div>
        </div>
      </Link>
      <div
        css={{
          position: 'absolute',
          right: '-1.5em',
          display: 'flex',
          top: 0,
          height: '100%',
          flexDirection: 'column',
          justifyContent: `space-around`,
        }}
      >
        <StatusButton bookId={book.id} />
      </div>
    </li>
  )
}

export {BookRow}
