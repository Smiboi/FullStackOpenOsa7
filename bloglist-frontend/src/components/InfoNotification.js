import {
  Alert,
} from '@mui/material'

const InfoNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return <Alert severity="success">{message}</Alert>
}

export default InfoNotification
