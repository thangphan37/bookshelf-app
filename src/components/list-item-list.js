/**@jsx jsx */
import {jsx} from '@emotion/core'
import {BookRow} from './book-row'
import {useListItems} from 'utils/list-items'
import {Profiler} from 'components/profiler'

function ListItems({noFilterListItems, filterItem, noListItems}) {
  const listItems = useListItems()
  const filerListItems = listItems?.filter(filterItem)

  if (!listItems.length) {
    return <div css={{fontSize: '1.2em', marginTop: '1em'}}>{noListItems}</div>
  }

  if (!filerListItems.length) {
    return (
      <div css={{fontSize: '1.2em', marginTop: '1em'}}>{noFilterListItems}</div>
    )
  }

  return (
    <Profiler id="List Item List" metaData={{listItemsCount: listItems.length}}>
      <ul css={{listStyle: 'none', padding: 0}}>
        {filerListItems.map(listItem => {
          return <BookRow book={listItem.book} key={listItem.book.id} />
        })}
      </ul>
    </Profiler>
  )
}

export {ListItems}
