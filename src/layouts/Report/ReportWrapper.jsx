import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { getLocationCoords, loadGoogleMaps } from "src/utils/googleMap";
import { useDispatch, useSelector } from "react-redux";
import {
  clearReport,
  setDuplicate,
  setEdit,
  setLock,
  setPage,
  setZoom,
} from "src/store/reducers/registerReport";
import Page1 from "../../pages/Frontend/AddReport/page1";
import Duplicate from "../../pages/Frontend/AddReport/duplicate";
import Page2 from "../../pages/Frontend/AddReport/page2";
import Page3 from "../../pages/Frontend/AddReport/page3";
import Page4 from "../../pages/Frontend/AddReport/page4";
import Page5 from "../../pages/Frontend/AddReport/page5";
import Page6 from "../../pages/Frontend/AddReport/page6";
import Page7 from "../../pages/Frontend/AddReport/page7";
import Page8 from "../../pages/Frontend/AddReport/page8";
import Page9 from "../../pages/Frontend/AddReport/page9";
import Page10 from "../../pages/Frontend/AddReport/page10";
import Page11 from "../../pages/Frontend/AddReport/page11";
import Page12 from "../../pages/Frontend/AddReport/page12";
import Page13 from "../../pages/Frontend/AddReport/page13";
import Page14 from "../../pages/Frontend/AddReport/page14";
import Page15 from "../../pages/Frontend/AddReport/page15";
import Page16, { SubmitDialog } from "../../pages/Frontend/AddReport/page16";
import Page17 from "src/pages/Frontend/AddReport/page17";
import CancelIcon from "@mui/icons-material/Cancel";
import PageSubmit from "src/pages/Frontend/AddReport/pageSubmit";
import VerticalProgressBar from "src/components/Progress/VerticalProgressBar";
import { objectToFormData } from "src/utils/formatObject";
import API from "src/config/api";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { SatelliteZoom } from "src/constants/googleMap";
import Image from "../../assets/images/duplicate.png";
import axios from "axios";
import { toast } from "react-toastify";

import corporate from "src/store/reducers/corporate";
const ReportPageRouter = ({
  selectActive = 1,
  setSelectActive,
  openState,
  mapRef,
}) => {
  const ReportPages = [
    <Page1 />,
    <Page2 setSelectActive={setSelectActive} />,
    <Duplicate mapRef={mapRef} setSelectActive={setSelectActive} />,
    <Page3 />,
    <Page4 />,
    <Page5 />,
    <Page6 />,
    <Page7 />,
    <Page8 />,
    <Page9 />,
    <Page10 />,
    <Page11 />,
    // <Page17 />,
    <Page12 />,
    <Page13 />,
    <Page14 />,
    <Page15 />,
    <Page16 setSelectActive={setSelectActive} openState={openState} />,
  ];
  return ReportPages[selectActive -1 ];
};

const ReportWrapper = () => {
  const register = useSelector((state) => state.reportRegister);
  const {
    data,
    zoom,
    lock,
    marker,
    duplicate,
    nearbyData = [],
    edit,
  } = register;
  const navigate=useNavigate();
  const { longitude, latitude, vehicle_theft, date_time } = data;
  const [cancel, setCancel] = useState(true);
  const [res, setRes] = useState();
  const [selectActive, setSelectActive] = useState(1);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [locChanged, setLocChanged] = useState(false);
  const dispatch = useDispatch();
  const map = useRef(null);
  const [permission,setPermission] = useState('')
  const [profile,setProfile] = useState('')
  const getPermissionHandler = async () => {
    const response = await API.get(`/reportPermission`)
    setPermission(response.data)
    if(response.data.code==202){
      navigate("/");
      toast.error(response.data.message,{
        toastId:"sahgmndb"
      })
    }
  }
  const getProfile = async () => {
    const response = await API.get(`/getProfile`)
    setProfile(response.data.data)
    if(parseInt(response.data.data.role_id) == 2 ){
      getPermissionHandler();
    }
    // if(response) return response.data.data
  }
  useEffect(() => {
    if (!edit) {
      dispatch(clearReport());
    }
    if (date_time === null) {
      dispatch(setPage({ date_time: new Date(Date.now()).toISOString() }));
    }
    getProfile();
  }, []);
  const markerOptions = {
    icon: {
      url: Image,
      scaledSize: new window.google.maps.Size(80, 80),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(25, 50),
    },
  };
  const markerPosition = {
    lat: Number(marker?.latitude),
    lng: Number(marker?.longitude),
  };
  const theme = useTheme();
  const isMdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  const mapOptions = {
    zoomControlOptions: {
      position: window.google.maps.ControlPosition.RIGHT_CENTER,
    },
    streetViewControlOptions: {
      position: window.google.maps.ControlPosition.RIGHT_CENTER,
    },
    mapTypeId:
      zoom > SatelliteZoom
        ? window.google.maps.MapTypeId.HYBRID
        : window.google.maps.MapTypeId.HYBRID,
  };

  const position = {
    lat: Number(latitude),
    lng: Number(longitude),
  };

  const setActiveStep = (oldStep, newStep) => {
    if (oldStep === 9 || oldStep === 11) {
      if (newStep === 10 && vehicle_theft === 4) {
        setSelectActive(oldStep === 9 ? 11 : 9);
        return;
      }
    }
    setSelectActive(newStep);
  };
  const beforeBack = async () => {
    switch (selectActive) {
      case 3:
        const { index, open } = duplicate || {};
        const { id, latitude, longitude, date_time } = nearbyData[index] || {};
        dispatch(setLock(true));
        try {
          await API.post("report/checkReport", {
            report_id: id,
            latitude,
            longitude,
            date_time,
          });
          dispatch(setDuplicate({ open: 1 }));
        } catch (error) {
          console.error(error);
          dispatch(setDuplicate({ open: 2 }));
        }
        dispatch(setLock(false));
        return;
      case 4:
        setSelectActive(2);
        return;
      default:
        break;
    }
    setActiveStep(selectActive, selectActive - 1);
  };
  const beforeNext = async () => {
    switch (selectActive) {
      case 3:
        //console.log(index)
        // console.log(duplicate)
        const { index, open } = duplicate || {};
        if (!nearbyData[index + 1]) {
          setSelectActive(4);
        }
        dispatch(setDuplicate({ index: index + 1 }));
        return;
      case 17:
        setOpen(true);
        return;
      default:
        break;
    }
    setActiveStep(selectActive, selectActive + 1);
  };

  const onClickEvent = async () => {
    // const temp = getPermissionHandler();
    if(profile.role_id == 2 || profile.role_id == '2'){ 
      if(permission.code === 200 || permission.code == '200'){
        try {
          const fileURL = data.files;
const fileSet = data.fileSet;
let response = { ok: true };
if (fileSet) response = await fetch(fileURL);
if (response.ok) {
  const formData = objectToFormData({
    ...data,
    various: `[${String(data.various)}]`,
  });
  
  if (fileSet) {
    const blob = await response.blob();
    const files = new File([blob], data.fileName);
    formData.set("files", files);
    
  } else {
    formData.delete("files");
    formData.delete("fileName");
  }

  try {
    const url = edit ? "/report/update/" + data?.id : "/report";
    const apiResponse = await API.post(url, formData);
    
    if (apiResponse) {
      if (apiResponse.data.code === 200) {
        setConfirm(true);
        dispatch(setEdit(false));
      } else {
        toast.error(apiResponse.data.message, {
          toastId: 'shjdnvd'
        });
      }
    }
  } catch (error) {
    console.error(error);
    // Handle the error as needed
  }
} else {
  throw new Error(`HTTP error! Status: ${response.status}`);
}

        } catch (error) {
          console.error(error);
          throw new Error("Unknown Error");
        }
      }else{
        toast.error(permission.message,{
          toastId:"sahgmndb"
        })
      }
    }else{
      try {
        const fileURL = data.files;
        const fileSet = data.fileSet;
        let response = { ok: true };
        
        if (fileSet) response = await fetch(fileURL);
        
        if (response.ok) {
          
          const formData = objectToFormData({
            ...data,
            various: `[${String(data.various)}]`,
          });
          if (fileSet) {
            const response = res;
            const blob = await response?.blob();
            
            const files = new File([blob], data.fileName);
            formData.set("files", files);
          } else {
            formData.delete("files");
            formData.delete("fileName");
          }
          const url = edit ? "/report/update/" + data?.id : "/report";
          const response = await API.post(url, formData);
          if(response.data.code == 200){
            
            setConfirm(true);
            dispatch(setEdit(false));
          }else{
            
            toast.error(response.data.message,{
              toastId:'shjdnvd'
            })
          }
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
        throw new Error("Unknown Error");
      }
    }
  };

  const handleZoomChanged = () => {
    if (map.current) dispatch(setZoom(map.current.getZoom()));
  };
  const handleCancel = () => {
    setCancel(true);
    // console.log("clear");
   
  };
  
  const onLoad = async (Map) => {
    map.current = Map; // Store the map instance in a global variable for access in the event handler
    if (!locChanged && !edit) {
      const { latitude: lat, longitude: lng } = await getLocationCoords();
      dispatch(setPage({ latitude: lat, longitude: lng }));
      setLocChanged(true);
    }
  };

  if ([2].includes(selectActive))
    return (
      <ReportPageRouter
        selectActive={selectActive}
        setSelectActive={setSelectActive}
      />
    );

  const textNext = selectActive === 3 ? "NO" : null;
  const textBack = selectActive === 3 ? "YES" : null;

  return (
    <Box
      sx={{
        height: "100%",
        maxHeight: "91.3vh",
        display: "flex",
        flexDirection: isMdBreakpoint ? "row" : "column",
      }}
    >
      {isMdBreakpoint || cancel ? null : (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            height: "45%",
            flexGrow: 1,
            backgroundColor: "#ffe600",
            zIndex: 100,
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "row-reverse", my: 0.5 }}
            onClick={() => handleCancel() }
          >
            <CancelIcon sx={{ ml: 1, mr: 3 }} />
            <Typography>Close</Typography>
          </Box>
          <GoogleMap
            center={position}
            zoom={zoom}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              mapTypeId:
                zoom < SatelliteZoom
                  ? window.google.maps.MapTypeId.HYBRID
                  : window.google.maps.MapTypeId.HYBRID,
              zoomControlOptions: {
                position: window.google.maps.ControlPosition.RIGHT_CENTER,
              },
              streetViewControlOptions: {
                position: window.google.maps.ControlPosition.RIGHT_CENTER,
              },
            }}
            onLoad={onLoad}
            onZoomChanged={handleZoomChanged}
          >
            <Marker position={position} />
            {(marker?.latitude || marker?.longitude) && selectActive === 3 && (
              <Marker
                position={markerPosition}
                options={markerOptions}
                label={{
                  text: `${marker?.user_count || 1}`,
                  color: "red",
                  fontWeight: "bold",
                  className: "map-label",
                }}
              />
            )}
          </GoogleMap>
        </Box>
      )}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          display: "flex",
          zIndex: 500,
        }}
      >
        <ProgressBar
          activeStep={selectActive}
          setActiveStep={setActiveStep}
          backLink={selectActive - 1}
          nextLink="/report/page2"
          cancelState={[cancel, setCancel]}
          lock={lock}
          beforeNext={beforeNext}
          beforeBack={beforeBack}
          submit={selectActive === 17}
          textNext={textNext}
          textBack={textBack}
        />
      </Box>
      <SubmitDialog
        open={open}
        handleClose={() => setOpen(false)}
        confirm={confirm}
        onClickEvent={onClickEvent}
      />
      <Box
        sx={{
          height: "100%",
          position: "fixed",
          display: "flex",
          alignItems: "center",
          top: 0,
        }}
      >
        <VerticalProgressBar progress={selectActive} maxVal={17} />
      </Box>
      <Box
        sx={{
          width: { md: "50%", xs: "100%" },
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 10 }}>
          <ReportPageRouter
            selectActive={selectActive}
            setSelectActive={setSelectActive}
            mapRef={map}
          />
          {/* <Page9/> */}
        </Box>
      </Box>
      <Box
        id="hello"
        sx={{
          width: isMdBreakpoint ? "66.67%" : "100%",
          height: isMdBreakpoint ? "91vh" : "0vh",
        }}
      >
        <GoogleMap
          center={position}
          zoom={zoom}
          options={mapOptions}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={onLoad}
          onZoomChanged={handleZoomChanged}
        >
          <Marker position={position} draggable={false} />
          {(marker?.latitude || marker?.longitude) && selectActive === 3 && (
            <Marker
              position={markerPosition}
              options={markerOptions}
              draggable={true}
              label={{
                text: `${marker?.user_count || 1}`,
                fontWeight: "bold",
                className: "map-label",
              }}
            />
          )}
        </GoogleMap>
      </Box>
    </Box>
  );
};

export default ReportWrapper;
