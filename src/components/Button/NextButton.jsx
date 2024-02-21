import { Typography } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NextButton = ({nextLink,beforeNext=null,afterNext=null,textValue}) => {
    const navigate = useNavigate();
    const next = ()=>{
        beforeNext &&beforeNext();
        nextLink&&navigate(nextLink);
        afterNext &&afterNext();
    }
    return (
        <Typography sx={{cursor:"pointer",userSelect:"none"}} variant="h6" onClick={next}>{textValue}</Typography>
    )
}

export default NextButton
