import { Fab } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const TransparentFab = ({children,sx,...rest}) => {
  return (
    <Fab
    sx={{opacity:0.65,...sx}}
    {...rest}
>
    {children}
</Fab>
  )
}

export default TransparentFab