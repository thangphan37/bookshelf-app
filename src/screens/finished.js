/**@jsx jsx */
import {jsx} from '@emotion/core'
import {ListItems} from 'components/list-item-list'
import {Link} from 'react-router-dom'
import * as colors from 'styles/colors'

function Finished() {
  return (
    <ListItems
      filterItem={li => li.finishDate}
      noListItems={
        <p>
          Hey there! This is where books will go when you've finished reading
          them. Get started by heading over to{' '}
          <Link to="/discover" css={{color: colors.indigo}}>
            the Discover page
          </Link>{' '}
          to add books to your list.
        </p>
      }
      noFilterListItems={
        <p>
          Looks like you've got some reading to do! Check them out in your{' '}
          <Link to="/list">reading list</Link> or{' '}
          <Link to="/discover">discover more</Link>.
        </p>
      }
    />
  )
}

export {Finished}
