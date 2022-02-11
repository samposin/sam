import mapboxgl from 'mapbox-gl';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';
import { mapStyles } from '../../utils/components/Maps/styles';
import { getActiveLayers, getPopupHTML } from '../../utils/components/Maps/popup';
import { loadDefaultSourcesAndLayers, setPropertyBounds } from '../../utils/components/Maps/layers';
import { initializeShareMap } from '../../utils/components/Maps/initializers';
import { updateAdditionalLayers, updateLayers } from '../../utils/components/Maps/ShareMap/layers';
import { setMapLoading } from '../../actions/actions_share_map';

function ShareMap({ share_map_info, layers, additional_layers, base_maps, specific_popup, dispatch }) {
 /*--------------------------
      INITIAL MAP SETUP
  --------------------------*/
  const [map, setMap] = useState(false);
  const [mapStyleChanged, setMapStyleChanged] = useState(false);
  const [hoverPopup, setHoverPopup] = useState(false);
  const [clickPopup, setClickPopup] = useState(false);

  useEffect(() => {
    const map = initializeShareMap()
    map.on('load', ()=>{
      loadDefaultSourcesAndLayers(map)
      setMap(map)
      setHoverPopup(new mapboxgl.Popup({ closeOnClick: false, closeButton : false }))
      setClickPopup(new mapboxgl.Popup({ closeOnClick: false, closeButton : false }))
    })
  }, [])

  useEffect(() => {
    if(layers && map){
        updateLayers(map, layers)
    }
  }, [layers, map, mapStyleChanged]);

  useEffect(() => {
    if(additional_layers && map){
      updateAdditionalLayers(map, additional_layers)
    }
  }, [additional_layers, map, mapStyleChanged ]);
  
  useEffect(() => {
    if(specific_popup && map || share_map_info && map && share_map_info.marketData.length > 0){
      setPropertyBounds(share_map_info.marketData, specific_popup, map)
    }
  }, [specific_popup, share_map_info, map]);

  useEffect(() => {
    if(base_maps && map){
      base_maps.forEach(baseMap => {
        if(baseMap.checked){
          if(map){
            dispatch(setMapLoading(true))

            map.setStyle(mapStyles[baseMap.name])
            map.once('idle', (e)=>{
              setMapStyleChanged(!mapStyleChanged)
              loadDefaultSourcesAndLayers(e.target)
              dispatch(setMapLoading(false))
            })
          }
        }
      });
    }
  }, [base_maps, map]);

  /*--------------------------
    POPUP FUNCTIONALITY
  --------------------------*/
  useEffect(() => {
    if(map && clickPopup) {
      map.on('click', (e) => {
        const activeLayers = getActiveLayers(map)
        const features = map.queryRenderedFeatures(e.point, { layers : activeLayers })
        if(features.length > 0) {
          clickPopup.setLngLat([e.lngLat.lng, e.lngLat.lat]).setDOMContent(createPopupNode(features, clickPopup)).addTo(map);
        } else {
          clickPopup.remove()
        }
      });
    }
  }, [map, clickPopup, layers])

  const pinPopup = (oldPopup, features) => {
    var newPopup = new mapboxgl.Popup({ closeOnClick: false, closeButton : false });
    var oldLngLat = oldPopup.getLngLat()
    newPopup.setLngLat([oldLngLat.lng, oldLngLat.lat]).setDOMContent(createPopupNode(features, newPopup, true)).addTo(map);
    oldPopup.remove();
  }

  const createPopupNode = (features, popup, pinned, hoverPopup) => {
    const toRender = getPopupHTML(hoverPopup, pinned, popup, features, false, false, pinPopup)
    const popupContent = document.createElement('div');
    ReactDOM.render(toRender, popupContent)
    return popupContent;
  }
  
  return (
    <>
      <div id="map" style={{height: '100vh', width: '100%', position:'absolute'}} />
    </>
  );
}

const mapStateToProps = (state) => ({
  share_map_info: state.shareMap.share_map_info,
  layers: state.shareMap.layers,
  additional_layers: state.shareMap.additional_layers,
  base_maps: state.shareMap.base_maps,
  specific_popup: state.shareMap.specific_popup
});

export default connect(mapStateToProps)(ShareMap);