import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";
import {
  setCurrentSelectedValue,
  setCurrentTool,
  setDeleteEditPropertyPoly,
  setGeolocateClick,
  setNewEditPropertyPoly,
  setResetEditPropertyPoly,
} from "../actions/actions_tools";
import { setRightSidebarState } from "../actions/actions_sidebar";
import {
  addPropertyToList,
  getModifiedProperties,
  setPropertyToAddFeature,
  setQueryPolygonFeature,
  setSinglePropertyState,
} from "../actions/actions_properties";
import {
  setAdjustableFilters,
  setHighlightedFeaturesMemory,
  setLayers,
  setMapStyleLoading,
  setShowHighlightedLayers,
} from "../actions/actions_layers";
import {
  addLayerForFilter,
  createHexLayer,
  loadDefaultSourcesAndLayers,
  setPropertyBounds,
  updateMapLayers,
  updateSliderFilters,
} from "../utils/components/Maps/layers";
import { mapStyles } from "../utils/components/Maps/styles";
import { closePopup, getActiveLayers, getPopupHTML } from "../utils/components/Maps/popup";
import {
  createTextToDisplayCalculations,
  getPolygonToSave,
  loadCurrentTool,
  loadPropertyEditMode,
  resetOrDeleteActiveEditingPoly,
} from "../utils/components/Maps/draw";
import { createHighlightMemory, loadHighlightedLayers } from "../utils/components/Maps/highlight";
import { initializeMap, addDrawToMap } from "../utils/components/Maps/initializers";
import "mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "../styles/Map.scss";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

function Map(props) {
  const {
    dispatch,
    layers,
    mapStyle,
    show_highlighted_layers,
    click_geolocate,
    new_edit_property_poly,
    reset_edit_property_poly,
    delete_edit_property_poly,
    draw_edit_property_mode,
    highlighted_features_memory,
    active_property,
    add_property_polygon,
    current_tool,
    draw_add_property_mode,
    draw_for_big_query_mode,
    properties_list,
    query_polygon,
    adjustable_filters,
    modified_properties,
    deleted_properties,
  } = props;
  const draw = useRef(false);
  const [map, setMap] = useState(false);
  const [geolocate, setGeolocate] = useState(false);
  const [hoverPopup, setHoverPopup] = useState(false);
  const [clickPopup, setClickPopup] = useState(false);
  const [mapStyleChanged, setMapStyleChanged] = useState(false);
  const [MigrationInflowData, setMigrationInflowData] = useState(false);
  const [MigrationInflow, setMigrationInflow] = useState(false);
  const [PPAIndexData, setPPAIndexData] = useState(false);
  const [PPAIndex, setPPAIndex] = useState(false);
  const [updateHighlightedMemory, setUpdateHighlightedMemory] = useState({ state: false });
  const [openFeatureID, setOpenFeatureID] = useState(false);

  /*--------------------------
      INITIAL MAP SETUP
  --------------------------*/
  const setupInitialMapSourceAndLayers = async (map) => {
    dispatch(getModifiedProperties());
    loadDefaultSourcesAndLayers(map);
    try {
      if (!MigrationInflow || !PPAIndex) {
        const inflowDataResponse = await d3.csv("https://storage.googleapis.com/big-query-nxt/unacast_4.csv");
        setMigrationInflowData(inflowDataResponse);
        const inflowHexagonLayer = createHexLayer("HexMigrationInflow", inflowDataResponse);
        setMigrationInflow(inflowHexagonLayer);
        map.addLayer(inflowHexagonLayer);
        map.setLayoutProperty("HexMigrationInflow", "visibility", "none");

        const PPADataResponse = await d3.csv("https://storage.googleapis.com/big-query-nxt/unfolded_ppa.csv");
        setPPAIndexData(PPADataResponse);
        const PPAHexagonLayer = createHexLayer("PPAIndex", PPADataResponse);
        setPPAIndex(PPAHexagonLayer);
        map.addLayer(PPAHexagonLayer);
        map.setLayoutProperty("PPAIndex", "visibility", "none");
      } else {
        map.addLayer(PPAIndex);
        map.setLayoutProperty("PPAIndex", "visibility", "none");
        map.addLayer(MigrationInflow);
        map.setLayoutProperty("HexMigrationInflow", "visibility", "none");
      }
      setMapStyleChanged(!mapStyleChanged);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const { geolocate, map } = initializeMap(mapStyle);
    setGeolocate(geolocate);
    setHoverPopup(new mapboxgl.Popup({ closeOnClick: false, closeButton: false }));
    setClickPopup(new mapboxgl.Popup({ closeOnClick: false, closeButton: false }));

    map.on("load", () => {
      setMap(map);
      setupInitialMapSourceAndLayers(map);
      draw.current = addDrawToMap(map);
    });
    return () => {
      return (document.getElementById("geocoder").innerHTML = "");
    };
  }, []);

  useEffect(() => {
    if (click_geolocate && geolocate) {
      geolocate.trigger();
      dispatch(setGeolocateClick(false));
    }
  }, [click_geolocate]);

  useEffect(() => {
    if (map) {
      map.setStyle(mapStyles[mapStyle]);
      dispatch(setMapStyleLoading(true));

      map.once("idle", () => {
        setupInitialMapSourceAndLayers(map);
      });
    }
  }, [mapStyle]);

  const loadMapLayers = () => {
    const layersToAddForFiltering = updateMapLayers(
      map,
      layers,
      properties_list,
      modified_properties,
      deleted_properties
    );
    const newAdjustableFiltersArray = addLayerForFilter(layersToAddForFiltering, adjustable_filters);
    dispatch(setAdjustableFilters(newAdjustableFiltersArray));
    dispatch(setMapStyleLoading(false));
  };

  useEffect(() => {
    if (map) {
      loadMapLayers();
    }
  }, [layers, mapStyleChanged, modified_properties, deleted_properties]);

  useEffect(() => {
    //Adjustable filters also adds filters for other layers that dont have sliders
    if (map) {
      if (adjustable_filters) {
        updateSliderFilters(
          adjustable_filters,
          MigrationInflowData,
          MigrationInflow,
          PPAIndexData,
          PPAIndex,
          layers,
          map,
          modified_properties,
          deleted_properties
        );
      }
    }
  }, [adjustable_filters, mapStyleChanged, layers, map, modified_properties, deleted_properties]);

  /*--------------------------
      POPUP FUNCTIONALITY
  --------------------------*/
  const mapClickEvent = (e) => {
    if (draw.current && draw.current.getMode() === "simple_select" && draw.current.getSelected().features.length < 1) {
      const activeLayers = getActiveLayers(map, "click");
      if (activeLayers.length > 0) {
        let features = map.queryRenderedFeatures(e.point, { layers: activeLayers });
        //make sure layers doesn't include _merged
        features = features.filter((feature) => !feature.layer.id.includes("_merged"));
        features = features.filter(
          (value, index, self) =>
            self.map((v) => (v.layer.id == value.layer.id ? v.properties.ID : null)).indexOf(value.properties.ID) ===
            index
        );
        if (features.length > 0 && !draw_for_big_query_mode && !draw_add_property_mode && !draw_edit_property_mode) {
          console.log(features);
          clickPopup
            .setLngLat([e.lngLat.lng, e.lngLat.lat])
            .setDOMContent(createPopupNode(features, clickPopup))
            .addTo(map);
        } else {
          clickPopup.remove();
        }
      }
    }
  };

  const mapHoverEvent = (e) => {
    if (draw.current && draw.current.getMode() === "simple_select" && draw.current.getSelected().features.length < 1) {
      const activeLayers = getActiveLayers(map, "hover");
      if (activeLayers.length > 0) {
        let features = map.queryRenderedFeatures(e.point, { layers: activeLayers });
        features = features.filter((feature) => !feature.layer.id.includes("_merged"));
        features = features.filter(
          (value, index, self) =>
            self.map((v) => (v.layer.id == value.layer.id ? v.properties.ID : null)).indexOf(value.properties.ID) ===
            index
        );
        if (features.length > 0 && !draw_for_big_query_mode && !draw_add_property_mode && !draw_edit_property_mode) {
          hoverPopup
            .setLngLat([e.lngLat.lng, e.lngLat.lat])
            .setDOMContent(createPopupNode(features, hoverPopup, false, true))
            .addTo(map);
        } else {
          hoverPopup.remove();
        }
      }
    }
  };

  useEffect(() => {
    if (map) {
      map.on("mousemove", mapHoverEvent);
      map.on("click", mapClickEvent);
    }
    return () => {
      if (map) {
        map.off("click", mapClickEvent);
        map.off("mousemove", mapHoverEvent);
      }
    };
  }, [map]);

  const pinPopup = (oldPopup, features, pinned) => {
    if (pinned) {
      setClickPopup(new mapboxgl.Popup({ closeOnClick: false, closeButton: false }));
      var oldLngLat = oldPopup.getLngLat();
      clickPopup
        .setLngLat([oldLngLat.lng, oldLngLat.lat])
        .setDOMContent(createPopupNode(features, clickPopup))
        .addTo(map);
      oldPopup.remove();
    } else {
      var newPopup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false });
      var oldLngLat = oldPopup.getLngLat();
      newPopup
        .setLngLat([oldLngLat.lng, oldLngLat.lat])
        .setDOMContent(createPopupNode(features, newPopup, true))
        .addTo(map);
      oldPopup.remove();
    }
  };

  const createPopupNode = (features, popup, pinned, hoverPopup) => {
    const findPropertyAndOpenIt = (propID) => {
      console.log(propID);
      setOpenFeatureID(propID);
    };
    const highlightFeature = (feature) => {
      if (!feature.id) {
        feature.id = feature.properties.ID;
      }
      if (feature.layer.source === "modified_properties") {
        feature.layer.source = "properties";
        feature.layer["source-layer"] = "properties";
        feature.isModifiedLayer = true;
      }
      setUpdateHighlightedMemory(
        JSON.parse(JSON.stringify({ state: true, data: { source: feature.layer.source, id: feature.id } }))
      );
    };
    const toRender = getPopupHTML(
      hoverPopup,
      pinned,
      popup,
      features,
      findPropertyAndOpenIt,
      highlightFeature,
      pinPopup
    );
    const popupContent = document.createElement("div");
    ReactDOM.render(toRender, popupContent);
    return popupContent;
  };

  useEffect(() => {
    if (updateHighlightedMemory.state) {
      const newFeatureMemory = createHighlightMemory(highlighted_features_memory, updateHighlightedMemory);
      dispatch(setHighlightedFeaturesMemory(newFeatureMemory));
    }
  }, [updateHighlightedMemory]);

  useEffect(() => {
    if (highlighted_features_memory && map) {
      //reset hover state to false
      const allSources = Object.keys(map.getStyle().sources);
      allSources.forEach((source) => {
        if (!source.includes("mapbox:/") && !source.includes("mapbox-gl")) {
          map.removeFeatureState({ source: source, sourceLayer: source });
        }
      });
      //set new hover state
      const keys = Object.keys(highlighted_features_memory);
      keys.forEach((key, index) => {
        highlighted_features_memory[key].forEach((propId) => {
          const mockFeature = {
            id: propId,
            layer: {
              source: key,
              "source-layer": key,
            },
          };
          map.setFeatureState(
            { source: mockFeature.layer.source, id: mockFeature.id, sourceLayer: mockFeature.layer["source-layer"] },
            { hover: true }
          );
          if (mockFeature.layer.source === "projects_merge") {
            map.setFeatureState(
              { source: "project_labels_tim", id: mockFeature.id, sourceLayer: "project_labels_tim" },
              { hover: true }
            );
          }
          if (mockFeature.isModifiedLayer) {
            map.setFeatureState({ source: "modified_properties", id: mockFeature.id }, { hover: true });
          }
        });
      });

      closePopup(clickPopup);
    }
  }, [highlighted_features_memory, layers]);

  useEffect(() => {
    //FUNCTIONALITY TO OPEN SINGLE PROPERTY FROM POPUP
    if (openFeatureID && properties_list && properties_list.some((property) => property.ID === openFeatureID)) {
      properties_list.forEach((property) => {
        if (parseInt(property.ID) === parseInt(openFeatureID)) {
          dispatch(setSinglePropertyState(property));
        }
      });
      dispatch(setRightSidebarState(true));
      setOpenFeatureID(false);
    }
    if (openFeatureID) {
      //this listing isnt part of the query, add it to the query
      dispatch(addPropertyToList(openFeatureID));
      dispatch(setRightSidebarState(true));
      setOpenFeatureID(false);
    }
  }, [openFeatureID]);

  /*--------------------------
  HIGHLIGHT TOOL FUNCTIONALITY
  --------------------------*/
  useEffect(() => {
    loadHighlightedLayers(show_highlighted_layers, map);
  }, [show_highlighted_layers]);

  /*--------------------------
  QUERY UPDATE FOR PROPERTY LIST
  --------------------------*/
  useEffect(() => {
    if ((properties_list && map) || (active_property && map)) {
      setPropertyBounds(properties_list, active_property, map);
    } else if (!active_property && map) {
      clickPopup.remove();
    }
  }, [properties_list, active_property]);

  const saveQueryPolygon = (e) => {
    dispatch(setQueryPolygonFeature(e.features[0]));
  };

  const saveAddPropertyPolygon = (e) => {
    e.features[0].isAddDraw = true;
    dispatch(setPropertyToAddFeature(e.features[0]));
  };

  /*--------------------------
  VISUALIZATION TOOLS FUNCTIONALITY
  --------------------------*/
  useEffect(() => {
    if ((draw_for_big_query_mode && draw.current) || (draw_add_property_mode && draw.current)) {
      if (draw_for_big_query_mode) {
        map.on("draw.update", saveQueryPolygon);
        map.on("draw.create", saveQueryPolygon);
        if (query_polygon) {
          draw.current.add(query_polygon);
          draw.current.changeMode("direct_select", { featureId: query_polygon.id });
        } else {
          draw.current.changeMode("draw_polygon");
        }
      } else {
        map.on("draw.update", saveAddPropertyPolygon);
        map.on("draw.create", saveAddPropertyPolygon);
        if (add_property_polygon) {
          draw.current.add(add_property_polygon);
          draw.current.changeMode("direct_select", { featureId: add_property_polygon.id });
        } else {
          draw.current.changeMode("draw_polygon");
        }
      }
    } else if (query_polygon || add_property_polygon) {
      draw.current.changeMode("simple_select");
      draw.current.delete(query_polygon.id);
      draw.current.delete(add_property_polygon.id);
    }
    if (!draw_add_property_mode && add_property_polygon.delete) {
      dispatch(setPropertyToAddFeature(false));
    }

    if (!draw_for_big_query_mode && query_polygon.delete) {
      dispatch(setQueryPolygonFeature(false));
    }
    return () => {
      if (map && draw) {
        draw.current.trash();
        if (draw_for_big_query_mode) {
          map.off("draw.update", saveQueryPolygon);
          map.off("draw.create", saveQueryPolygon);
        } else {
          map.off("draw.update", saveAddPropertyPolygon);
          map.off("draw.create", saveAddPropertyPolygon);
        }
      }
    };
  }, [draw_for_big_query_mode, draw_add_property_mode, draw_edit_property_mode]);

  const savePropertyEditPoly = (e) => {
    const polygon = getPolygonToSave(e, active_property, draw.current);
    if (polygon) {
      dispatch(setNewEditPropertyPoly(polygon));
    }
  };

  useEffect(() => {
    if (draw_edit_property_mode && draw.current) {
      //EDIT PROPERTY MODE START
      loadPropertyEditMode(new_edit_property_poly, draw.current, active_property);
      map.on("draw.update", savePropertyEditPoly);
      map.on("draw.create", savePropertyEditPoly);
    } //EDIT PROPERTY MODE END
    else if (!draw_edit_property_mode && draw.current) {
      draw.current.delete(active_property.ID);
    }
    return () => {
      if (map) {
        map.off("draw.update", savePropertyEditPoly);
        map.off("draw.create", savePropertyEditPoly);
      }
    };
  }, [draw_edit_property_mode]);

  useEffect(() => {
    //This handles the 'reset' and 'delete' button when editing an active property polygon
    if ((reset_edit_property_poly && draw) || (delete_edit_property_poly && draw.current)) {
      const instruction = resetOrDeleteActiveEditingPoly(
        active_property,
        delete_edit_property_poly,
        reset_edit_property_poly,
        draw.current
      );
      if (instruction === "reset") {
        dispatch(setResetEditPropertyPoly(false));
        dispatch(setNewEditPropertyPoly(false));
      } else if (instruction === "delete") {
        dispatch(setDeleteEditPropertyPoly(false));
        dispatch(setNewEditPropertyPoly(false));
      }
    }
  }, [reset_edit_property_poly, delete_edit_property_poly]);

  //TOOLS
  useEffect(() => {
    //set the current tool
    if (current_tool && draw.current) {
      const currentTool = loadCurrentTool(current_tool, draw.current, map);
      if (currentTool === "North" || currentTool === "ScreenShot") {
        dispatch(setCurrentTool(false));
      } else if (currentTool === "De-Highlight") {
        setUpdateHighlightedMemory({ state: false });
        dispatch(setHighlightedFeaturesMemory({}));
        dispatch(setCurrentTool(false));
        dispatch(setShowHighlightedLayers(false));
      } else if (current_tool === "Clear") {
        dispatch(setLayers([]));
        dispatch(setCurrentTool(false));
        dispatch(setCurrentSelectedValue(false));
      }
    }
  }, [current_tool, draw]);

  const loadTextToDisplay = (e) => {
    //calculate and send text
    const text = createTextToDisplayCalculations(e);
    dispatch(setCurrentSelectedValue(text));
  };

  const deleteEvent = (e) => {
    if (e.features.length > 0) {
      // console.log('deleting')
      loadTextToDisplay(e);
      if (current_tool === "Erase") {
        draw.current.delete(e.features[0].id);
        dispatch(setCurrentSelectedValue(false));
      }
    } else {
      dispatch(setCurrentSelectedValue(false));
    }
  };

  const updateFunction = (e) => {
    if (current_tool || draw_edit_property_mode) {
      loadTextToDisplay(e);
    }
  };

  const deleteFunction = (e) => {
    dispatch(setCurrentTool(false));
  };

  useEffect(() => {
    if (draw && map) {
      map.on("draw.update", updateFunction);
      map.on("draw.create", deleteFunction);
      map.on("draw.selectionchange", deleteEvent);
    }
    return () => {
      if (map) {
        return map.off("draw.selectionchange", deleteEvent);
      }
    };
  }, [map]);

  return <div id="map" style={{ height: "100vh", width: "100%", position: "absolute" }} />;
}

const mapStateToProps = (state) => ({
  auth2Loaded: state.user.auth2Loaded,
  googleUser: state.user.googleUser,
  layers: state.layers.layers,
  right_side_bar_open: state.sidebar.right_side_bar_open,
  mapStyle: state.layers.mapStyle,
  draw_for_big_query_mode: state.tools.draw_for_big_query_mode,
  query_polygon: state.properties.query_polygon,
  properties_list: state.properties.properties_list,
  current_tool: state.tools.current_tool,
  adjustable_filters: state.layers.adjustable_filters,
  show_highlighted_layers: state.layers.show_highlighted_layers,
  draw_add_property_mode: state.tools.draw_add_property_mode,
  add_property_polygon: state.properties.add_property_polygon,
  active_property: state.properties.active_property,
  highlighted_features_memory: state.layers.highlighted_features_memory,
  click_geolocate: state.tools.click_geolocate,
  draw_edit_property_mode: state.tools.draw_edit_property_mode,
  reset_edit_property_poly: state.tools.reset_edit_property_poly,
  delete_edit_property_poly: state.tools.delete_edit_property_poly,
  new_edit_property_poly: state.tools.new_edit_property_poly,
  modified_properties: state.properties.modified_properties,
  deleted_properties: state.properties.deleted_properties,
});

export default connect(mapStateToProps)(Map);
