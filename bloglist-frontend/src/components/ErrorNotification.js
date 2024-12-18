import {
  Alert,
} from '@mui/material'

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return <Alert severity="error">{message}</Alert>
}

export default ErrorNotification
