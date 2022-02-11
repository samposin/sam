import mapboxgl from "mapbox-gl";
import MapboxDraw from "mapbox-gl-draw";
import MapboxGeocoder from "mapbox-gl-geocoder";
import { getCookie } from "./layers";
import { mapStyles } from "./styles";

export const initializeMap = (mapStyle) => {
    if(getCookie('pk')){
        mapboxgl.accessToken = getCookie('pk');
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: mapStyles[mapStyle],
            center: [-97.757902, 30.271890],
            zoom:9,
            preserveDrawingBuffer : true
        });

        map.doubleClickZoom.disable() //not working?!?

        const geolocate = addGeocoderToMap(map)

        return { map, geolocate }
    }
    else {
        sessionStorage.clear()
        localStorage.clear()
        document.cookie = ''
        window.location.reload()
    }
}

export const initializeShareMap = () => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2JhcnRvbiIsImEiOiJja2ozYm8xdTEyOTRxMnFteXhzbWxpcnF2In0.jyeBfYFa4T1swe8sn307tQ';
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/sbarton/ckovxisx801lw17rt4rsnhcet',
      center: [-97.757902, 30.271890],
      zoom:9,
    });
    return map
}

export const addDrawToMap = (map) => {
    const draw = new MapboxDraw({
        displayControlsDefault: false,
    });
    map.addControl(draw, 'top-left');
    return draw
}

const addGeocoderToMap = (map) => {
    const geocoder =  new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })

    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
        }
    );
    map.addControl(geolocate);
    document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

    return geolocate
}
