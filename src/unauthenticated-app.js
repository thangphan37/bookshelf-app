/**@jsx jsx */
import {jsx} from '@emotion/core'
import {Logo} from 'components/logo'
import {Button, Spinner, Input} from 'components/lib'
import {ModalOpenButton, Modal, ModalContents} from 'components/modal'
import {login, register} from 'auth-provider'
import {useAsync} from 'utils/hooks'
import {useAuth} from 'context/context'
import * as colors from 'styles/colors'

function AuthForm({onSubmit, variant, title}) {
  const {run, error, isPending, isError} = useAsync()
  const [, setUser] = useAuth()

  function handleSubmit(e) {
    e.preventDefault()
    const {username, password} = e.target.elements
    run(
      onSubmit({
        username: username.value,
        password: password.value,
      }).then(user => setUser(user)),
    )
  }

  return (
    <form
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        marginTop: '1rem',
        paddingBottom: '2em',
      }}
      onSubmit={handleSubmit}
    >
      <div
        css={{
          margin: '0 auto',
          maxWidth: '300px',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <label htmlFor="username">Username</label>
        <Input id="username" name="username" />
      </div>
      <div
        css={{
          margin: '0 auto',
          maxWidth: '300px',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          marginTop: '0.2em',
        }}
      >
        <label htmlFor="password">Password</label>
        <Input id="password" name="password" />
      </div>
      <div
        css={{
          margin: '0 auto',
          maxWidth: '300px',
          width: '100%',
        }}
      >
        <Button variant={variant}>
          {title}
          {isPending ? <Spinner css={{marginLeft: '0.2em'}} /> : null}
        </Button>
        {isError ? (
          <div css={{color: colors.danger}}>{error.message}</div>
        ) : null}
      </div>
    </form>
  )
}

function UnauthenticatedApp() {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gridGap: '0.7em',
        }}
      >
        <Modal>
          <ModalOpenButton>
            <Button variant="primary">Login</Button>
          </ModalOpenButton>
          <ModalContents title="Login" aria-label="Login Form">
            <AuthForm title="Login" variant="primary" onSubmit={login} />
          </ModalContents>
        </Modal>

        <Modal>
          <ModalOpenButton>
            <Button variant="secondary">Register</Button>
          </ModalOpenButton>
          <ModalContents title="Register" aria-label="Register Form">
            <AuthForm
              title="Register"
              variant="secondary"
              onSubmit={register}
            />
          </ModalContents>
        </Modal>
      </div>
    </div>
  )
}

export default UnauthenticatedApp
