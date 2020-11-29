/** @jsx jsx */
import {jsx, keyframes} from '@emotion/core'
import styled from '@emotion/styled/macro'
import {FaSpinner} from 'react-icons/fa'
import * as colors from 'styles/colors'

const ErrorMessage = ({error}) => {
  return (
    <div
      role="alert"
      css={{
        textAlign: 'center',
        color: colors.danger,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div>There was an error:</div>
      <pre>{error.message}</pre>
    </div>
  )
}

const FullPageErrorFallBack = ({error}) => {
  return (
    <div
      css={{
        textAlign: 'center',
        color: colors.danger,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <div>There was an error:</div>
      <pre>{error.message}</pre>
    </div>
  )
}

const buttonVariant = {
  primary: {
    background: colors.indigo,
    color: colors.base,
  },
  secondary: {
    background: colors.gray,
    color: colors.text,
  },
}

const Button = styled.button(
  {
    lineHeight: '1',
    borderRadius: '3px',
    border: 'none',
    marginTop: '0.2em',
    padding: '10px 15px',
  },
  ({variant = 'none'}) => buttonVariant[variant],
)

const spin = keyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(360deg)',
  },
})

const Spinner = styled(FaSpinner)({
  animation: `${spin} 0.8s linear infinite`,
})

Spinner.defaultProps = {
  'aria-label': 'loading',
}

const FullPageSpinner = styled(Spinner)({
  fontSize: '4em',
  margin: '0 auto',
  display: 'block',
  height: '100vh',
})

const CircleButton = styled(Button)({
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  justifyContent: 'center',
  border: `solid 1px ${colors.gray}`,
  background: colors.base,
  // color: colors.gray80,
  alignItems: 'center',
})

const Input = styled.input({
  background: colors.gray10,
  border: 'none',
  padding: '8px 12px',
  marginBottom: '1rem',
  borderRadius: '3px',
})

export {
  Button,
  Spinner,
  Input,
  CircleButton,
  FullPageSpinner,
  ErrorMessage,
  FullPageErrorFallBack,
}
