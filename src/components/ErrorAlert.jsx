import {
    Alert,
    AlertIcon,
    AlertTitle,
    CloseButton,
  } from '@chakra-ui/react'

function ErrorAlert({errorTitle, onClose}){
  return(
    <Alert status='error'>
      <AlertIcon />
        <AlertTitle >{errorTitle}</AlertTitle>
        <CloseButton size= 'sm' onClick={onClose} />
    </Alert>
  )
}

export default ErrorAlert;
