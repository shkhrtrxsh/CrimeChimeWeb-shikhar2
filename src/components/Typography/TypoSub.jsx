import { Typography } from '@mui/material'
import React from 'react'

const TypoSub = ({mainText,subText=null}) => {
  return (
    <Typography
        sx={{ fontWeight: 'normal',fontSize:'16px', px: 5, textAlign: 'left', '.text-left': { textAlign: 'left' } }}
    >
        {mainText}
        <br />
        {subText&&<span sx={{textAlign:"left",fontSize:"14px"}}>({subText})</span>}
    </Typography>
  )
}

export default TypoSub