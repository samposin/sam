import * as turf from '@turf/turf'
import { wktToJson } from '../../../utils/actions/helpers';

export const loadCurrentTool = (current_tool, draw, map) => {
    switch (current_tool) {
        case "Measure":
            draw.changeMode("draw_line_string")
            break;
        case "Area":
            draw.changeMode("draw_polygon")
            break;
        case "Erase":
            draw.changeMode("simple_select")
            break;
        case "Highlight":
            draw.changeMode("simple_select")
            break;
        case "Match":
            draw.changeMode("simple_select")
            break;
        case "North":
            map.resetNorthPitch()
        break;
        case "Clear":
            //resets all the layers and removes highlighted properties
            draw.deleteAll()
        break;
        case "ScreenShot":
            var dpi = 300;
            Object.defineProperty(window, 'devicePixelRatio', {
                get: function() {return dpi / 96}
            });
            let link = document.createElement("a");
            link.download = "image.png";
            var dataUrl = map.getCanvas().toDataURL('image/jpeg', 0.92);
            link.href = dataUrl;
            link.click();
        break;
        case "De-Highlight":
        break;
        default:
            break;
    }
    return current_tool
}

export const resetOrDeleteActiveEditingPoly = (active_property, delete_edit_property_poly, reset_edit_property_poly, draw) => {
    if(draw.get(active_property.ID) && !delete_edit_property_poly && reset_edit_property_poly){
        draw.delete([active_property.ID])
        const polygon = JSON.parse(wktToJson(active_property.geometry))
        var feature = {
          id: active_property.ID,
          type: 'Feature',
          properties: {},
          geometry: polygon
        };
        draw.add(feature)
        draw.changeMode("direct_select", {featureId: active_property.ID})
        return 'reset'
      }
    else if(delete_edit_property_poly && draw && !reset_edit_property_poly){
      draw.delete([active_property.ID])
      draw.changeMode("draw_polygon")
      return 'delete'
    }
    return false;
}

export const createTextToDisplayCalculations = (e) => {
    if(e.features[0]){
        const coords = e.features[0].geometry.coordinates
        const type = e.features[0].geometry.type
        if(type === "LineString"){
          const line = turf.lineString(coords);
          const length = turf.length(line, {units: 'miles'});
          return "Selected Length: " + length.toFixed(2)+ " mi."
        }
        else if(type === "Polygon"){
          const polygon = turf.polygon(coords);
          const area = turf.area(polygon);
          const finalOutcome = area * 0.00024710538146717
          return "Selected Area: " + finalOutcome.toFixed(2)+ " acres"
        }
        else {
            return false
        }
    }
}

export const loadPropertyEditMode = (new_edit_property_poly, draw, active_property) => {
    if(new_edit_property_poly) {
        draw.add(new_edit_property_poly)
        draw.changeMode("direct_select", {featureId: active_property.ID})
    }
    else if(!draw.get(active_property.ID)) {
        const polygon = JSON.parse(wktToJson(active_property.geometry))
        const feature = { id: active_property.ID, type: 'Feature', properties: {}, geometry: polygon };
        draw.add(feature)
        draw.changeMode("direct_select", {featureId: active_property.ID})
    }
}

export const getPolygonToSave = (e, active_property, draw) => {
    const type = e.type
    if(type === "draw.create"){
      const newestFeature = e.features[e.features.length - 1]
      const featureClone = JSON.parse(JSON.stringify(newestFeature))
      featureClone.id = active_property.ID
      draw.delete([newestFeature.id])
      draw.add(featureClone)
      return featureClone
    }
    else {
      const feature = e.features.filter(e => e.id === active_property.ID)
      return feature[0]
    }
}
