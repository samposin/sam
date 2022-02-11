import "mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { connect } from "react-redux";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";
import Legend from "../components/Map/Legend";
import { Button } from "semantic-ui-react";
import {
  setAddPropertyDrawModeState,
  setBigQueryDrawState,
  setCurrentSelectedValue,
  setToolModal,
} from "../actions/actions_tools";
import { setLeftSidebarState } from "../actions/actions_sidebar";
import Map from "../components/Map";
import Filter from "../components/Map/Filter";
import { setPropertyToAddFeature, setQueryPolygonFeature } from "../actions/actions_properties";

function MapScreen({
  dispatch,
  current_selected_value,
  draw_for_big_query_mode,
  right_side_bar_open,
  draw_add_property_mode,
  add_property_polygon,
  query_polygon,
}) {
  const returnToQueryModal = (deleteIt) => {
    dispatch(setCurrentSelectedValue(false));
    if (draw_add_property_mode) {
      dispatch(setToolModal("add"));
      if (deleteIt && add_property_polygon) {
        const clone = JSON.parse(JSON.stringify(add_property_polygon));
        clone.delete = true;
        dispatch(setPropertyToAddFeature(clone));
      }
    } else {
      dispatch(setToolModal("query"));
      if (deleteIt && query_polygon) {
        const clone = JSON.parse(JSON.stringify(query_polygon));
        clone.delete = true;
        dispatch(setQueryPolygonFeature(clone));
      }
    }
    dispatch(setBigQueryDrawState(false));
    dispatch(setAddPropertyDrawModeState(false));
    dispatch(setLeftSidebarState(true));
  };

  // console.log('current selected', current_selected_value)
  return (
    <div>
      <div className="top-custom-navigation">
        {current_selected_value && !draw_for_big_query_mode && !draw_add_property_mode ? (
          <p className="content">{current_selected_value}</p>
        ) : null}
        {draw_for_big_query_mode || draw_add_property_mode ? (
          <div className="content">
            <p>{draw_add_property_mode ? "Drawing property to add..." : "Drawing Search Boundary..."}</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button onClick={() => returnToQueryModal(true)} color="red" icon="x" basic></Button>
              <Button onClick={() => returnToQueryModal()} color="blue" icon="check" basic></Button>
            </div>
          </div>
        ) : null}
      </div>

      <Map />

      <LeftSideBar />

      <RightSideBar />

      <div className={`map-overlay ${right_side_bar_open ? "offset" : ""}`}>
        <Legend />
        <Filter />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth2Loaded: state.user.auth2Loaded,
  googleUser: state.user.googleUser,
  layers: state.layers.layers,
  right_side_bar_open: state.sidebar.right_side_bar_open,
  mapStyle: state.layers.mapStyle,
  current_selected_value: state.tools.current_selected_value,
  draw_for_big_query_mode: state.tools.draw_for_big_query_mode,
  query_polygon: state.properties.query_polygon,
  properties_list: state.properties.properties_list,
  draw_add_property_mode: state.tools.draw_add_property_mode,
  add_property_polygon: state.properties.add_property_polygon,
});

export default connect(mapStateToProps)(MapScreen);
