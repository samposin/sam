import { ownershipSources, parcelSources } from "./sources";
import { mapLayers, ownershipLayers, parcelLayers } from "./styles";

export const loadHighlightedLayers = (show_highlighted_layers, map) => {

  //TODO: hide the "modified_" layers

  //set layers paint props to only show highlighted properties
  if(show_highlighted_layers && map && mapLayers){
    //get all layers
    const keys = Object.keys(mapLayers);
    keys.forEach(layerKeys =>{
      mapLayers[layerKeys].forEach(layer =>{
          if(layer.paint){
            //save old paint for later
            if(layer.paint['fill-color']){
              map.setPaintProperty(layer.id, 'fill-color', [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                layer.paint['fill-color'],
                'rgba(0,0,0,0)',
              ])

              if(map.getLayer("modified_"+layer.id)){
                map.setPaintProperty("modified_"+layer.id, 'fill-color', [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  layer.paint['fill-color'],
                  'rgba(0,0,0,0)',
                ])
              }
            }
            else if(layer.paint['line-color']){
              map.setPaintProperty(layer.id, 'line-color', [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                layer.paint['line-color'],
                'rgba(0,0,0,0)',
              ])
              map.setPaintProperty(layer.id, 'line-width', [
                "interpolate",
                ["linear"],
                ["zoom"],
                8,
                1,
                15.5,
                ['case', ['boolean', ['feature-state', 'hover'], false], 3, 6]
              ])

              if(map.getLayer("modified_"+layer.id)){
                map.setPaintProperty("modified_"+layer.id, 'line-color', [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  layer.paint['line-color'],
                  'rgba(0,0,0,0)',
                ])
                map.setPaintProperty("modified_"+layer.id, 'line-width', [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  8,
                  1,
                  15.5,
                  ['case', ['boolean', ['feature-state', 'hover'], false], 3, 6]
                ])
              }
            }
            else if(layer.paint['text-color']){
              map.setPaintProperty(layer.id, 'text-color', [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                layer.paint['text-color'],
                'rgba(0,0,0,0)',
              ])
              if(map.getLayer("modified_"+layer.id)){
                map.setPaintProperty("modified_"+layer.id, 'text-color', [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  layer.paint['text-color'],
                  'rgba(0,0,0,0)',
                ])
              }
            }
          }
      })
    })
    const ownershipsLayerKeys = Object.keys(ownershipSources);
    ownershipsLayerKeys.forEach(layerId =>{
      ownershipSources[layerId].forEach(layerKeyID =>{
        // map.setPaintProperty(layer.id, 'saved-paint', layer.paint['line-color'])
        if(map.getLayer(layerKeyID +'_outline')){
          map.setPaintProperty(layerKeyID +'_outline', 'line-color', [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            ownershipLayers.line.paint['line-color'],
            'rgba(0,0,0,0)',
          ])
          map.setPaintProperty(layerKeyID +'_outline', 'line-width', [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            1,
            15.5,
            ['case', ['boolean', ['feature-state', 'hover'], false], 3, 6]
          ])
        }
      })
    })

    const parcelLayerKeys = Object.keys(parcelSources);
    parcelLayerKeys.forEach(layerId =>{
      parcelSources[layerId].forEach(layerKeyID =>{
        // map.setPaintProperty(layer.id, 'saved-paint', layer.paint['line-color'])
        if(map.getLayer(layerKeyID +'_outline')){
          map.setPaintProperty(layerKeyID +'_outline', 'line-color', [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            parcelLayers.line.paint['line-color'],
            'rgba(0,0,0,0)',
          ])
          map.setPaintProperty(layerKeyID +'_outline', 'line-width', [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            1,
            15.5,
            ['case', ['boolean', ['feature-state', 'hover'], false], 3, 6]
          ])
        }
      })

    })
  }
  else if (map && mapLayers){
    //reset layers paint props
    const keys = Object.keys(mapLayers);
    keys.forEach(layerKeys =>{
      mapLayers[layerKeys].forEach(layer =>{
        if(layer.paint){
          if(layer.paint['fill-color']){
            map.setPaintProperty(layer.id, 'fill-color', layer.paint['fill-color'])
            if(map.getLayer("modified_"+layer.id)){
              map.setPaintProperty("modified_"+layer.id, 'fill-color', layer.paint['fill-color'])
            }
          }
          else if(layer.paint['line-color']){
            map.setPaintProperty(layer.id, 'line-color', [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              'hsl(182, 100%, 61%)',
              layer.paint['line-color'],
            ])
            map.setPaintProperty(layer.id, 'line-width', [
              "interpolate",
              ["linear"],
              ["zoom"],
              8,
              1,
              15.5,
              ['case', ['boolean', ['feature-state', 'hover'], false], 6, 3]
            ])

            if(map.getLayer("modified_"+layer.id)){
              console.log("modified_"+layer.id)
              map.setPaintProperty("modified_" + layer.id, 'line-color', [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                'hsl(182, 100%, 61%)',
                layer.paint['line-color'],
              ])
              map.setPaintProperty("modified_" + layer.id, 'line-width', [
                "interpolate",
                ["linear"],
                ["zoom"],
                8,
                1,
                15.5,
                ['case', ['boolean', ['feature-state', 'hover'], false], 6, 3]
              ])

            }

            
          }
          else if(layer.paint['text-color']){
            map.setPaintProperty(layer.id, 'text-color', layer.paint['text-color'])
            if(map.getLayer("modified_"+layer.id)){
              map.setPaintProperty("modified_" + layer.id, 'text-color', layer.paint['text-color'])
            }
          }
        }
      })
    })

    const ownershipsLayerKeys = Object.keys(ownershipSources);
    ownershipsLayerKeys.forEach(layerId =>{
      ownershipSources[layerId].forEach(layerKeyID =>{
        if(map.getLayer(layerKeyID +'_outline')){
          map.setPaintProperty(layerKeyID +'_outline', 'line-color', [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            'hsl(182, 100%, 61%)',

            ownershipLayers.line.paint['line-color'],
          ])
          map.setPaintProperty(layerKeyID +'_outline', 'line-width', [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            1,
            15.5,
            ['case', ['boolean', ['feature-state', 'hover'], false], 6, 3]
          ])

        }
      })
    })

    const parcelLayerKeys = Object.keys(parcelSources);
    parcelLayerKeys.forEach(layerId =>{
      parcelSources[layerId].forEach(layerKeyID =>{
        if(map.getLayer(layerKeyID +'_outline')){
          map.setPaintProperty(layerKeyID +'_outline', 'line-color', [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            'hsl(182, 100%, 61%)',
            parcelLayers.merge_line.paint['line-color'],
          ])
          map.setPaintProperty(layerKeyID +'_outline', 'line-width', [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            1,
            15.5,
            ['case', ['boolean', ['feature-state', 'hover'], false], 6, 3]
          ])
        }
      })
    })
  }
}

export const createHighlightMemory = (highlighted_features_memory, updateHighlightedMemory) => {
  const highlightedFeaturesClone = JSON.parse(JSON.stringify(highlighted_features_memory))
  const source = updateHighlightedMemory.data.source
  const featureID = updateHighlightedMemory.data.id
  if(highlightedFeaturesClone[source]){
    if(highlightedFeaturesClone[source].includes(featureID)){
      //remove feature
      const newArray = highlightedFeaturesClone[source].filter(e => e !== featureID)
      if(newArray.length === 0){
        delete highlightedFeaturesClone[source]
      }
      else {
        highlightedFeaturesClone[source] = newArray
      }
    }
    else {
      //add feature
      highlightedFeaturesClone[source].push(featureID)
    }
  }
  else {
    highlightedFeaturesClone[source] = [featureID]
  }
  return highlightedFeaturesClone
}