import React, { useState, useEffect, useRef } from 'react';
import { SatelliteZoom } from 'src/constants/googleMap';

export const CurrentLocationCoordinates = () => {

    const [position, setPosition] = useState({
        lat: positionLatitude,
        lng: positionLongitude
    })

    const [currentLocation, setCurrentLocation] = useState({
        lat: 0,
        lng: 0
    })

    function showPosition(position) {
        setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    }
    navigator.geolocation.getCurrentPosition(showPosition)

    useEffect(() => {
        if(position.lat === positionLatitude && position.lng === positionLongitude){
            setTimeout(function(){
                setPosition(currentLocation)
            },500)

            
        }

    }, [currentLocation])

    useEffect(() => {
        if(currentLocation.lat === 0 && currentLocation.lng === 0){
            setTimeout(function(){
                setPosition({
                    lat: positionLatitude,
                    lng: positionLongitude
                })
            },1000)
            
        }
    }, [])

    return position;
}

export const positionLatitude = -26.2041028;

export const positionLongitude = 28.0473051;


export const mapSettings = (zoom)=> ({
    // zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    gestureHandling: "greedy",
    fullscreenControl: false,
    mapTypeId: (zoom<SatelliteZoom)?window.google.maps.MapTypeId.TERRAIN:window.google.maps.MapTypeId.TERRAIN
})