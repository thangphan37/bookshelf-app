/** @jsx jsx */
import {jsx} from '@emotion/core'
import {Discover} from 'screens/discover'
import {Reading} from 'screens/reading'
import {Finished} from 'screens/finished'
import {Routes, Route, Link, useMatch} from 'react-router-dom'
import {useAuth} from 'context/context'
import {Button, ErrorMessage, FullPageErrorFallBack} from 'components/lib'
import {ErrorBoundary} from 'react-error-boundary'
import {BookScreen} from 'screens/book'
import {NotFound} from 'screens/not-found'
import * as colors from 'styles/colors'
import * as auth from 'auth-provider'
import * as md from 'styles/media-queries'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/discover" element={<Discover />} />
      <Route path="/finished" element={<Finished />} />
      <Route path="/book/:bookId" element={<BookScreen />} />
      <Route path="/list" element={<Reading />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function NavLink({to, link}) {
  const match = useMatch(to)

  return (
    <li>
      <Link
        to={to}
        css={[
          {
            display: 'block',
            color: colors.text,
            padding: '10px',
            borderRadius: '3px',
            margin: '0.5em 0px',
            width: '100%',
            height: '100%',
            '&:hover': {
              textDecoration: 'none',
              background: colors.gray10,
            },
            background: match ? colors.gray10 : 'none',
            borderLeft: `solid 5px ${match ? colors.indigo : 'transparent'}`,
          },
        ]}
      >
        {link}
      </Link>
    </li>
  )
}

function AppNav() {
  return (
    <nav
      css={{
        border: `solid 1px ${colors.gray10}`,
        padding: '20px 25px',
        position: 'sticky',
        top: '0px',
      }}
    >
      <ul
        css={{
          padding: '0',
          listStyle: 'none',
        }}
      >
        <NavLink to="/list" link="Reading List" />
        <NavLink to="/finished" link="Finished Books" />
        <NavLink to="/discover" link="Discover" />
      </ul>
    </nav>
  )
}

function AppUser() {
  const [user, setUser] = useAuth()

  async function handleLogout() {
    await auth.logout()
    setUser(null)
  }

  return (
    <header
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: '10px',
        top: '10px',
      }}
    >
      <div>{user.username}</div>
      <Button onClick={handleLogout} css={{marginLeft: '10px'}}>
        Logout
      </Button>
    </header>
  )
}

function AuthenticatedApp() {
  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallBack}>
      <div>
        <AppUser />
        <div
          css={{
            maxWidth: '840px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 3fr',
            gridGap: '1em',
            padding: '4em 2em',
            [md.small]: {
              gridTemplateColumns: 'auto',
            },
          }}
        >
          <div>
            <AppNav />
          </div>
          <main>
            <ErrorBoundary FallbackComponent={ErrorMessage}>
              <AppRoutes />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default AuthenticatedApp
