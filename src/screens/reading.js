/**@jsx jsx */
import {jsx} from '@emotion/core'
import {ListItems} from 'components/list-item-list'
import {Link} from 'react-router-dom'
import * as colors from 'styles/colors'

function Reading() {
  return (
    <ListItems
      filterItem={li => !li.finishDate}
      noListItems={
        <p>
          Hey there! Welcome to your bookshelf reading list. Get started by
          heading over to{' '}
          <Link to="/discover" css={{color: colors.indigo}}>
            the Discover page
          </Link>{' '}
          to add books to your list.
        </p>
      }
      noFilterListItems={
        <p>
          Looks like you've finished all your books! Check them out in your{' '}
          <Link to="/finished">finished books</Link> or{' '}
          <Link to="/discover">discover more</Link>.
        </p>
      }
    />
  )
}

export {Reading}
