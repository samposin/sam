import { defaultFilterData, layerOrderBefore } from "./constants";
import { defaultSourcesToLoad, ownershipSources, parcelSources } from "./sources";
import { mapLayers, ownershipLayers, parcelLayers } from "./styles";
import { wktToJson } from "../../../utils/actions/helpers";
import { MapboxLayer } from "@deck.gl/mapbox";
import { HexagonLayer } from "@deck.gl/aggregation-layers";

export const getBefore = (layer, map) => {
  if (layer.includes("tx_")) {
    layer = "tx_travis";
  }
  layer = layer.replace("_labels", "").replace("_outline", "");
  const before = layerOrderBefore.slice(0, layerOrderBefore.indexOf(layer));

  const layers = map.getStyle().layers;
  const layerIds = layers.map(function (layer) {
    return layer.id;
  });
  for (let i = 0; i < before.length; i++) {
    const layer_ = before.slice().reverse()[i];
    if (layerIds.includes(layer_)) {
      return layer_;
    }
  }
  return null;
};

export const loadParcelsSourceAndLayers = (layerID, map) => {
  if (map) {
    parcelSources[layerID].forEach((county) => {
      if (!map.getSource(county)) {
        map.addSource(county, { type: "vector", url: "mapbox://sbarton." + county });
      }
    });

    parcelSources[layerID].forEach((county) => {
      if (!map.getLayer(county)) {
        const layers = map.getStyle().layers;
        // Find the index of the first symbol layer in the map style.
        let firstSymbolId;
        for (const layer of layers) {
          if (layer.type === "symbol") {
            firstSymbolId = layer.id;
            break;
          }
        }
        if (county.includes("_merged")) {
          map.addLayer(
            { ...parcelLayers.merge_line, id: county + "_outline", source: county, "source-layer": county },
            firstSymbolId
          );
          map.addLayer(
            { ...parcelLayers.marge_fill, id: county, source: county, "source-layer": county },
            firstSymbolId
          );
          if (parcelLayers.merge_line.paint["line-color"]) {
            map.setPaintProperty(county + "_outline", "line-color", [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "hsl(182, 100%, 61%)",
              parcelLayers.merge_line.paint["line-color"],
            ]);
          }
        } else {
          map.addLayer(
            { ...parcelLayers.line, id: county + "_outline", source: county, "source-layer": county },
            firstSymbolId
          );
          map.addLayer({ ...parcelLayers.fill, id: county, source: county, "source-layer": county }, firstSymbolId);
          if (parcelLayers.line.paint["line-color"]) {
            map.setPaintProperty(county + "_outline", "line-color", [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "hsl(182, 100%, 61%)",
              parcelLayers.line.paint["line-color"],
            ]);
          }
        }
      }
    });
  }
};

export function getCookie(cname) {
  const name = cname + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const loadDefaultSourcesAndLayers = (map) => {
  if (map) {
    defaultSourcesToLoad.forEach((source) => {
      if (!map.getSource(source.id)) {
        map.addSource(source.id, { type: source.type, url: source.url });
      }
    });
    const keys = Object.keys(mapLayers);
    keys.forEach((layerKeys) => {
      mapLayers[layerKeys].forEach((layer) => {
        if (!map.getLayer(layer)) {
          map.addLayer(layer, getBefore(layerKeys, map));
          //set feature state for highlighting
          if (layer.paint["line-color"]) {
            map.setPaintProperty(layer.id, "line-color", [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "hsl(182, 100%, 61%)",
              layer.paint["line-color"],
            ]);
          }
        }
      });
    });
  }
};

export const addLayerForFilter = (layers, adjustable_filters) => {
  const newFiltersDataArray = [];
  layers.forEach((layer) => {
    if (defaultFilterData[layer]) {
      //check to see if layer already exists to preserve values
      const oldLayer = adjustable_filters ? adjustable_filters.find((filter) => filter.layerID === layer) : false;
      let filterValue = oldLayer ? oldLayer.sliderValue : defaultFilterData[layer];
      let rawValue = oldLayer ? oldLayer.sliderValueRaw : false;
      newFiltersDataArray.push({ layerID: layer, sliderValue: filterValue, sliderValueRaw: rawValue });
    }
  });
  return newFiltersDataArray;
};

export function setLayerSource(layerId, source, sourceLayer, map) {
  const oldLayers = map.getStyle().layers;
  const layerIndex = oldLayers.findIndex((l) => l.id === layerId);

  if (layerIndex !== -1) {
    const layerDef = oldLayers[layerIndex];
    layerDef.source = source;
    if (sourceLayer) {
      layerDef["source-layer"] = sourceLayer;
    }
    map.removeLayer(layerId);
    map.addLayer(layerDef);
  }
}

export const loadOwnershipSourceAndLayers = (layerID, map) => {
  if (map) {
    //check to see if source exists if it doesnt then add it
    ownershipSources[layerID].forEach((county) => {
      if (!map.getSource(county)) {
        map.addSource(county, { type: "vector", url: "mapbox://sbarton." + county });
      }
    });
    ownershipSources[layerID].forEach((county) => {
      if (!map.getLayer(county)) {
        map.addLayer({ ...ownershipLayers.line, id: county + "_outline", source: county, "source-layer": county });
        map.addLayer({ ...ownershipLayers.fill, id: county, source: county, "source-layer": county });
        //set feature state for highlighting
        if (ownershipLayers.line.paint["line-color"]) {
          map.setPaintProperty(county + "_outline", "line-color", [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "hsl(182, 100%, 61%)",
            ownershipLayers.line.paint["line-color"],
          ]);
        }
      }
    });
  }
};

export const updateMapLayers = (map, layers, properties_list, modified_properties, deleted_properties) => {
  const layersToAddForFiltering = [];
  var mapBoxLayers = map.getStyle().layers;

  let layersToHide = modified_properties.map((prop) => prop.ID);
  layersToHide = [...layersToHide, ...deleted_properties];
  const resultsIDs = [];
  if (properties_list) {
    properties_list.forEach((property) => {
      resultsIDs.push(property.ID);
    });
  }

  //create data source for the modified and added data
  const modifiedGeojson = createModifiedDataSource(modified_properties);
  if (map.getSource("modified_properties")) {
    //if it already exists then update the data
    map.getSource("modified_properties").setData(modifiedGeojson);
  } else {
    // if source doesnt exist then create the source
    map.addSource("modified_properties", {
      type: "geojson",
      data: modifiedGeojson,
    });
  }

  //MigrationInflow
  if (map.getLayer("HexMigrationInflow")) {
    map.setLayoutProperty("HexMigrationInflow", "visibility", "none");
    if (layers.includes("HexMigrationInflow")) {
      map.setLayoutProperty("HexMigrationInflow", "visibility", "visible");
      layersToAddForFiltering.push("HexMigrationInflow");
    }
  }
  //PPAIndex
  if (map.getLayer("PPAIndex")) {
    map.setLayoutProperty("PPAIndex", "visibility", "none");
    if (layers.includes("PPAIndex")) {
      map.setLayoutProperty("PPAIndex", "visibility", "visible");
      layersToAddForFiltering.push("PPAIndex");
    }
  }
  const layerIDs = mapBoxLayers.map(function (layer) {
    return layer.id;
  });
  //first hide all layers in case layers array has removed an active layer
  layerIDs.forEach((layer) => {
    const visibility = map.getLayoutProperty(layer, "visibility");
    if (visibility) {
      map.setLayoutProperty(layer, "visibility", "none");
    }
  });
  //add back new layer selections
  layers.forEach((layer) => {
    //create layer if the source is = rml_merge and layerId != results and if the layer doesn't exit if layer exists then just turn it on
    if (mapLayers[layer] && mapLayers[layer][0].source === "properties") {
      if (map.getLayer(`modified_${mapLayers[layer][0].id}`)) {
        mapLayers[layer].forEach((newLayer) => {
          map.setLayoutProperty(`modified_${newLayer.id}`, "visibility", "visible");
        });
      } else {
        mapLayers[layer].forEach((newLayer) => {
          const layerClone = { ...newLayer, id: `modified_${newLayer.id}`, source: "modified_properties" };
          delete layerClone["source-layer"];
          map.addLayer(layerClone, getBefore(`${newLayer.id}`, map));
          map.setLayoutProperty(`modified_${newLayer.id}`, "visibility", "visible");
          // if(newLayer.id.includes('RecentSales')){
          //   layersToAddForFiltering.push(`modified_${newLayer.id}`)
          // }
          // //set feature state for highlighting
          if (newLayer.paint["line-color"]) {
            map.setPaintProperty(`modified_${newLayer.id}`, "line-color", [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "hsl(182, 100%, 61%)",
              newLayer.paint["line-color"],
            ]);
          }
        });
      }

      if (mapLayers[layer][0].id === "Results") {
        mapLayers[layer].forEach((OGlayer) => {
          map.setFilter(`modified_${OGlayer.id}`, ["in", ["to-string", ["get", "ID"]], ["literal", resultsIDs]]);
        });
      } else {
        //make sure to filter all the other layers to show new stuff only and hide the layers that have been "modified"
        mapLayers[layer].forEach((OGlayer) => {
          map.setFilter(OGlayer.id, OGlayer.createNewFilter(layersToHide, defaultFilterData.RecentSales));
        });
      }
    }
    if (layer.includes("Ownerships-")) {
      loadOwnershipSourceAndLayers(layer, map);
      //load in proper ownership source and layer
      ownershipSources[layer].forEach((ownership) => {
        if (layerIDs.includes(ownership)) {
          map.setLayoutProperty(ownership, "visibility", "visible");
          map.setLayoutProperty(ownership + "_outline", "visibility", "visible");
        }
      });
      layersToAddForFiltering.push("Ownerships");
    } else if (layer.includes("Parcels-")) {
      //load in proper parcels source and layer
      loadParcelsSourceAndLayers(layer, map);
      parcelSources[layer].forEach((parcel) => {
        if (layerIDs.includes(parcel)) {
          map.setLayoutProperty(parcel, "visibility", "visible");
          map.setLayoutProperty(parcel + "_outline", "visibility", "visible");
        }
      });
    } else if (layerIDs.includes(layer)) {
      mapLayers[layer].forEach((layerChild) => {
        map.setLayoutProperty(layerChild.id, "visibility", "visible");
      });
      layersToAddForFiltering.push(layer);
      if (layer.includes("Results")) {
        map.setFilter(layer, [
          "all",
          ["in", ["to-string", ["get", "ID"]], ["literal", resultsIDs]],
          ["!", ["in", ["to-string", ["get", "ID"]], ["literal", layersToHide]]],
        ]);
        map.setFilter(layer + "_outline", [
          "all",
          ["in", ["to-string", ["get", "ID"]], ["literal", resultsIDs]],
          ["!", ["in", ["to-string", ["get", "ID"]], ["literal", layersToHide]]],
        ]);
      }
      // show layers if water features button is selected
    } else if (layer === "Waterfeatures") {
      map.setLayoutProperty("Waterbody", "visibility", "visible");
      map.setLayoutProperty("Perennial", "visibility", "visible");
      map.setLayoutProperty("Perennial_outline", "visibility", "visible");
      map.setLayoutProperty("Perennial_label", "visibility", "visible");
      map.setLayoutProperty("Intermittent", "visibility", "visible");
      map.setLayoutProperty("Intermittent_label", "visibility", "visible");
      layersToAddForFiltering.push("Waterbody", "Perennial", "Intermittent");
    }
  });
  return layersToAddForFiltering;
};

const createModifiedDataSource = (modified_properties) => {
  return {
    type: "FeatureCollection",
    features: modified_properties.map((property) => ({
      id: property.ID,
      type: "Feature",
      properties: { ...property, status: parseInt(property.status) },
      geometry: JSON.parse(wktToJson(property.geometry)),
    })),
  };
};

export const updateSliderFilters = (
  adjustable_filters,
  MigrationInflowData,
  MigrationInflow,
  PPAIndexData,
  PPAIndex,
  layers,
  map,
  modified_properties,
  deleted_properties
) => {
  adjustable_filters.forEach((filterData) => {
    if (filterData.layerID === "HexMigrationInflow") {
      if (MigrationInflowData && MigrationInflow) {
        MigrationInflow.setProps({
          upperPercentile: filterData.sliderValue[1],
          lowerPercentile: filterData.sliderValue[0],
        });
      }
    } else if (filterData.layerID === "PPAIndex") {
      if (PPAIndexData && PPAIndex) {
        const dataClone = JSON.parse(JSON.stringify(PPAIndexData));
        const newppaData = dataClone.filter(
          (d) =>
            parseInt(d["time"]) * 1000 >= new Date(filterData.sliderValue + "-01-01").getTime() &&
            parseInt(d["time"]) * 1000 <= new Date(filterData.sliderValue + "-12-31").getTime()
        );
        PPAIndex.setProps({ data: newppaData });
      }
    } else if (filterData.layerID === "Ownerships") {
      const layersClone = JSON.parse(JSON.stringify(layers));
      const newLayer = layersClone.filter((layer) => layer.includes("Ownerships"));
      newLayer.forEach((layer) => {
        if (ownershipSources[layer]) {
          ownershipSources[layer].forEach((county) => {
            if (map.getLayer(county)) {
              map.setFilter(
                county + "_outline",
                ownershipLayers.fill.createFilter(filterData.sliderValue[0], filterData.sliderValue[1])
              );
              map.setFilter(
                county,
                ownershipLayers.fill.createFilter(filterData.sliderValue[0], filterData.sliderValue[1])
              );
            }
          });
        }
      });
    } else if (filterData.layerID === "LandCover") {
      setLayerSource("LandCover", "nlcd_" + filterData.sliderValue, "nlcd_" + filterData.sliderValue, map);
    } else if (filterData.layerID === "LandCoverChange") {
      const years = [2004, 2006, 2008, 2011, 2013, 2016];
      years.forEach((year) => {
        map.setLayoutProperty("LandCoverChange" + (year === 2016 ? "" : year), "visibility", "none");
        if ((year >= filterData.sliderValue[0]) & (year < filterData.sliderValue[1])) {
          map.setLayoutProperty("LandCoverChange" + (year === 2016 ? "" : year), "visibility", "visible");
        }
      });
    } else {
      let layersToHide = modified_properties.map((prop) => prop.ID);
      layersToHide = [...layersToHide, ...deleted_properties];
      mapLayers[filterData.layerID].forEach((layerChild) => {
        if (layerChild.createFilter) {
          map.setFilter(layerChild.id, layerChild.createFilter(filterData.sliderValue, layersToHide));
        }
        if (layerChild.createPaint) {
          map.setPaintProperty(
            layerChild.id,
            layerChild.createPaint(filterData.sliderValue)[0],
            layerChild.createPaint(filterData.sliderValue)[1]
          );
        }
        //add filters for the modified layers
        if (layerChild.source === "properties") {
          if (map.getLayer(`modified_${layerChild.id}`)) {
            if (layerChild.createFilter) {
              map.setFilter(`modified_${layerChild.id}`, layerChild.createFilter(filterData.sliderValue, []));
            }
            if (layerChild.createPaint) {
              map.setPaintProperty(
                `modified_${layerChild.id}`,
                layerChild.createPaint(filterData.sliderValue)[0],
                layerChild.createPaint(filterData.sliderValue)[1]
              );
            }
          }
        }
      });
    }
  });
};

export const setPropertyBounds = (properties_list, active_property, map) => {
  const lats = [];
  const longs = [];
  if (active_property) {
    lats.push(active_property.lat_centroid);
    longs.push(active_property.long_centroid);
  } else if (properties_list) {
    properties_list.forEach((property) => {
      lats.push(property.lat_centroid);
      longs.push(property.long_centroid);
    });
  }
  const min_lat = Math.min(...lats);
  const max_lat = Math.max(...lats);
  const min_long = Math.min(...longs);
  const max_long = Math.max(...longs);

  map.fitBounds(
    [
      [min_long, min_lat],
      [max_long, max_lat],
    ],
    { padding: { top: 100, bottom: 50, left: 350, right: 350 }, maxZoom: 13.75 }
  );
};

export const createHexLayer = (id, data) => {
  const hexLayersOptions = {
    HexMigrationInflow: {
      type: HexagonLayer,
      id: "HexMigrationInflow",
      data: data,
      radius: 5000,
      coverage: 1,
      colorRange: [
        [5, 80, 130],
        [38, 129, 182],
        [105, 159, 200],
        [156, 181, 214],
        [202, 203, 226],
        [239, 235, 245],
      ],
      elevationScale: 10,
      elevationRange: [0, 200],
      extruded: false,
      getPosition: (d) => [Number(d.census_tract_id_lng), Number(d.census_tract_id_lat)],
      opacity: 0.8,
      colorScaleType: "quantile",
      //getColorValue: getMeanA,
      //getElevationValue: getMeanB,
      getColorWeight: (point) => parseFloat(point.scaled_inflow),
      colorAggregation: "MEAN",
      getElevationWeight: (point) => parseFloat(point.income_diff),
      elevationAggregation: "MEAN",
      upperPercentile: 100,
      lowerPercentile: 75,
    },
    PPAIndex: {
      type: HexagonLayer,
      id: "PPAIndex",
      data: data,
      radius: 12000,
      coverage: 0.98,
      colorRange: [
        [92, 0, 15],
        [155, 17, 21],
        [196, 23, 27],
        [237, 52, 39],
        [250, 95, 65],
        [252, 135, 103],
        [252, 179, 151],
        [254, 219, 204],
        [255, 243, 283],
      ],
      extruded: false,
      elevationRange: [2000, 2001],
      getPosition: (d) => [Number(d.long), Number(d.lat)],
      opacity: 0.2,
      colorScaleType: "quantile",
      getColorWeight: (point) => parseFloat(point.ppa),
      colorAggregation: "MEAN",
    },
  };

  const hexagonLayer = new MapboxLayer(hexLayersOptions[id]);

  return hexagonLayer;
};
