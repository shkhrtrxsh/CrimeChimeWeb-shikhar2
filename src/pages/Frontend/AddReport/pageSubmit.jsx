import { Box, Container, Divider, Paper, Typography } from '@mui/material'
import React from 'react'

const data=[
[
    {label:"Crime Reported At",value:"13:45AM"},
],
[
    {label:"Address",value:"UT 474+"},
    {label:"Latitude",value:"27.890"},
    {label:"Longitude",value:"27.890"},
],
[
    {label:"No of Perpetrators",value:"Unknown"},
    {label:"Description",value:"Unknown"},
],
[
    {label:"Murders/Deaths",value:"Unknown"},
    {label:"No of Murders",value:"Unknown"},
],
[
    {label:"Rape",value:"Unknown"},
    {label:"No of Rapes",value:"Unknown"},
],
[
    {label:"Assault",value:"Unknown"},
    {label:"No of Assualted",value:"Unknown"},
],
[
    {label:"Vehicle theft",value:"Unknown"},
],
]
const titles=["Reported Time","Address","Perpetrators","Murders/Deaths","Rape","Assault"];
const Entry = ({data=[],title})=>{
    return(
        <Box sx={{width:"100%",px:{xs:5,md:10}}}>
            <Typography variant="h3" sx={{mr:3}}>{title}</Typography>
            <Divider sx={{mb:2}}/>
            <Box fullWidth component="ul" elevation={3} sx={{display:"flex",flexDirection:"column"}}>
                {data.map((d,ind)=>{
                    return(
                        <Box component="li" sx={{display:"flex"}} key={ind}>
                            <Typography variant="h5" sx={{mr:3}}>{d.label}:</Typography>
                            <Typography variant="h5" sx={{mr:3,fontWeight:"medium"}}>{d.value}</Typography> 
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}

const PageSubmit = () => {
  return (
    <Container maxWidth="md" sx={{mt:5,mb:5}}>
        <Paper elevation={3} mt={5} sx={{display:"flex",flexDirection:"column", justifyContent:"center",alignItems:"center",py:5}}>
            <Typography variant = "h3" mb={4}>Submission Details</Typography>
        {data.map((d,ind)=>(
            <Entry data={d} title={titles[ind]}/>
        )
        )}
        </Paper>
    </Container>
  )
}

export default PageSubmit