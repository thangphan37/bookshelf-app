/**@jsx jsx */
import {jsx} from '@emotion/core'
import {Link} from 'react-router-dom'
import * as colors from 'styles/colors'

function NotFound() {
  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <p>
        Sorry... nothing here.{' '}
        <Link to="/list" css={{color: colors.indigo}}>
          Go home
        </Link>
      </p>
    </div>
  )
}

export {NotFound}
