import React, { useEffect, useState } from 'react'
import API from 'src/config/api';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCrimeIndex,  setNearbyReports } from 'src/store/reducers/registerReport';
import { Button } from '@mui/material';
import { fDateTime } from 'src/utils/formatTime';

export default function NotificationsModal(props) {
    const modal = {
        border:"1px solid yellow",
        background:"white",
        position:"absolute",
        top:"30px",
        minHeight:"140px",
        maxHeight:"600px",
        width:"300px",
        left:"-180px",
        borderRadius:"16px",
        padding:"16px 0",
        overflowX:"auto"
    }
    const [data,setData] = useState([])
    const getData = async () => {
        const response = await API.get(`/notificationList`);
        if(response.data.code == 200){
            setData(response.data.data)
        }
    }
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { reports,error } = useSelector((state) => ({ ...state.report }));
    const handler = (e) => {   
        const id = e.currentTarget.getAttribute("id")     
        dispatch(setNearbyReports(reports.data));
        dispatch(setCrimeIndex({id,viewCrime:true}))
        navigate("/")
    }
    const buttonHandler = () => {
        navigate("/my-addresses/add")
        props.handler();
    }
    useEffect(()=>{
        getData();
    },[])
  return (
    <div style={modal} >
        {data.length == 0 &&<div style={{padding:"10px"}}> 
             <h5 style={{color:"black",fontWeight:"400"}} >
                No new notification...<br/><br/>
                1. Tap below or select  "Crime tracker" in menu. <br/><br/>
                2. Select up to three locations.<br/><br/>

                Receive a notification whenever a crime is reported within 500 meters (0.5 Km ) of your selected locations.<br/><br/>
                You can change your selected locations at any time.
                <br/><br/>
            </h5>
            <Button size="small" style={{marginLeft:"20%",textTransform:"lowercase"}} onClick={buttonHandler}>+ add a new location</Button>
        </div>}
        {data.length > 0 && data.map((item,index)=><h5 key={index} id={item.id} onClick={handler} style={{color:"black",fontWeight:"400",borderBottom:"1px solid #e6e6e6",padding:"10px 16px "}} >
            <p>
                New crime reported at {item.address} {fDateTime(item.created_at)} <br></br> {item.distance} meters away from {item.location_name},<br/>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:"6px"}}>
                <Button size="small" onClick={()=>{
                    props.handler()
                    navigate('/crimedetails?id=' + item.report_id+'&show=false&type=all')
                }}>View on map</Button>
                </div>
            </p>
            {/* <p style={{textAlign:"right"}}></p> */}
        </h5>
    )}
    </div>
  )
}
