import { mapLayers, ownershipLayers, parcelLayers } from "../styles";

export const updateLayers = (map, layers) => {
 //first hide all layers in case layers array has removed an active layer
 layers.forEach(layer => {
    layer.name = layer.name.replace(" ", '')
    if(!layer.checked ){
      if(layer.data){
        layer.data.forEach(layerData =>{
          const visibility = map.getLayoutProperty(layerData + '_outline','visibility');
          if(visibility){
            if(map.getLayer(layerData)){
              map.setLayoutProperty(layerData, 'visibility', 'none');
            }
            if(map.getLayer(layerData + '_outline')){
              map.setLayoutProperty(layerData+ '_outline', 'visibility', 'none');
            }
            if(map.getLayer(layerData+ '_labels')){
              map.setLayoutProperty(layerData + "_labels", 'visibility', 'none');
            }
          }
        })
      }
      else {
       const visibility = map.getLayoutProperty(layer.name,'visibility');
       if(visibility){
        if(map.getLayer(layer.name)){
          map.setLayoutProperty(layer.name, 'visibility', 'none');
        }
        if(map.getLayer(layer.name + '_outline')){
          map.setLayoutProperty(layer.name +  '_outline', 'visibility', 'none');
        }
        if(map.getLayer(layer.name + '_labels')){
          map.setLayoutProperty(layer.name + "_labels", 'visibility', 'none');
        }
       }
      }
    }
 });
 layers.forEach(layer =>{
   layer.name = layer.name.replace(" ", '')
   if(layer.data && layer.checked){
    layer.data.forEach(dataLayer => {
      if(!map.getSource(dataLayer)){
        map.addSource(dataLayer, { type: 'vector', url: 'mapbox://sbarton.' + dataLayer });
        if(dataLayer.includes('ownership')){
          map.addLayer({...ownershipLayers.line, id: dataLayer + '_outline', source: dataLayer, 'source-layer': dataLayer });
          map.addLayer({...ownershipLayers.fill, id: dataLayer, source: dataLayer, 'source-layer': dataLayer});
          if(map.getLayer(dataLayer)){
            map.setFilter(dataLayer,  ['in', ['to-string', ['id']], ['literal', layer.showIds[layer.name]]])
          }
          if(map.getLayer(dataLayer + '_outline')){
            map.setFilter(dataLayer + '_outline',  ['in', ['to-string', ['id']], ['literal', layer.showIds[layer.name]]])
          }
        }
        else {
          map.addLayer({...parcelLayers.line, id: dataLayer + '_outline', source: dataLayer, 'source-layer': dataLayer });
          map.addLayer({...parcelLayers.fill, id: dataLayer, source: dataLayer, 'source-layer': dataLayer});
          if(map.getLayer(dataLayer)){
            map.setFilter(dataLayer,  ['in', ['to-string', ['id']], ['literal', layer.showIds[layer.name]]])
          }
          if(map.getLayer(dataLayer + '_outline')){
            map.setFilter(dataLayer + '_outline',  ['in', ['to-string', ['id']], ['literal', layer.showIds[layer.name]]])
          }
        }
      }
      else {
        if(map.getLayer(dataLayer)){
          map.setLayoutProperty(dataLayer, 'visibility', 'visible');
          map.setFilter(dataLayer,  ['in', ['to-string', ['id']], ['literal', layer.showIds[layer.name]]])
        }
        if(map.getLayer(dataLayer + '_outline')){
          map.setLayoutProperty(dataLayer + '_outline', 'visibility', 'visible');
          map.setFilter(dataLayer + '_outline',  ['in', ['to-string', ['id']], ['literal', layer.showIds[layer.name]]])
        }
      }
    })
   }
   else if (layer.checked){
    let expression = ['in', ['to-string', ['id']], ['literal', layer.showIds[layer.name]]]
    if(mapLayers[layer.name][0].filter){
      expression = ["all", mapLayers[layer.name][0].filter, ['in', ['to-string', ['id']], ['literal', layer.showIds[layer.name]]]]
    }
    if(map.getLayer(layer.name)){
      map.setLayoutProperty(layer.name, 'visibility', 'visible');
      map.setFilter(layer.name,  expression)
    }
    if(map.getLayer(layer.name + '_outline')){
      map.setLayoutProperty(layer.name + '_outline', 'visibility', 'visible');
      map.setFilter(layer.name + '_outline', expression)
    }
    if(map.getLayer(layer.name + '_labels')){
      map.setLayoutProperty(layer.name + '_labels', 'visibility', 'visible');
      map.setFilter(layer.name + '_labels',  expression)
    }
   }
 })
}

export const updateAdditionalLayers = (map, additional_layers) => {
  //first hide all layers in case layers array has removed an active layer
  additional_layers.forEach(layer => {
    layer.name = layer.name.replace(" ", '')
    if(!layer.checked){
      if(layer.data){
        layer.data.forEach(layerData =>{
          const visibility = map.getLayoutProperty(layerData + '_outline','visibility');
          if(visibility){
            if(map.getLayer(layerData)){
              map.setLayoutProperty(layerData, 'visibility', 'none');
            }
            if(map.getLayer(layerData + '_outline')){
              map.setLayoutProperty(layerData + '_outline', 'visibility', 'none');
            }
            if(map.getLayer(layerData + '_labels')){
              map.setLayoutProperty(layerData + '_labels', 'visibility', 'none');
            }
          }
        })
      }
      else {
        const visibility = map.getLayoutProperty(layer.name,'visibility');
        if(visibility){
          if(map.getLayer(layer.name)){
            map.setLayoutProperty(layer.name, 'visibility', 'none');
          }
          if(map.getLayer(layer.name + '_outline')){
            map.setLayoutProperty(layer.name + '_outline', 'visibility', 'none');
          }
          if(map.getLayer(layer.name + '_labels')){
            map.setLayoutProperty(layer.name + '_labels', 'visibility', 'none');
          }
        }
      }
    }
  });
  
  additional_layers.forEach(layer =>{
    layer.name = layer.name.replace(" ", '')
    if(layer.data && layer.checked){
      layer.data.forEach(dataLayer => {
        if(!map.getSource(dataLayer)){
          map.addSource(dataLayer, { type: 'vector', url: 'mapbox://sbarton.' + dataLayer });
          map.addLayer({...ownershipLayers.line, id: dataLayer + '_outline', source: dataLayer, 'source-layer': dataLayer });
          map.addLayer({...ownershipLayers.fill, id: dataLayer, source: dataLayer, 'source-layer': dataLayer});
        }
        else {
          if(map.getLayer(dataLayer)){
            map.setLayoutProperty(dataLayer, 'visibility', 'visible');
          }
          if(map.getLayer(dataLayer + '_outline')){
            map.setLayoutProperty(dataLayer + '_outline', 'visibility', 'visible');
          }
          if(map.getLayer(dataLayer + '_labels')){
            map.setLayoutProperty(dataLayer + '_labels', 'visibility', 'visible');
          }
        }
      })
    }
    else if (layer.checked){
      if(map.getLayer(layer.name )){
        map.setLayoutProperty(layer.name , 'visibility', 'visible');
      }
      if(map.getLayer(layer.name  + '_outline')){
        map.setLayoutProperty(layer.name  + '_outline', 'visibility', 'visible');
      }
      if(map.getLayer(layer.name  + '_labels')){
        map.setLayoutProperty(layer.name  + '_labels', 'visibility', 'visible');
      }
    }
  })
}