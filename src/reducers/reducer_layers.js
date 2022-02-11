import { SET_FILTER_DATA, SET_HIGHLIGHTED_LAYERS_STATE, SET_LAYERS, SET_MAP_STYLE, SET_HIGHLIGHTED_FEATURES_MEMORY_STATE, SET_MAP_STYLE_LOADING } from "../actions/actions_layers";

const initialState = {
  layers: [],
  mapStyle: "Default",
  adjustable_filters: false,
  show_highlighted_layers: false,
  highlighted_features_memory: {},
  map_style_loading:false
}
const layers = (state = initialState, action) => {
  switch (action.type) {
    case SET_LAYERS:
      return {
        ...state,
        layers: action.payload
      };
    case SET_MAP_STYLE:
      return {
        ...state,
        mapStyle: action.payload
    };
    case SET_FILTER_DATA:
      return {
        ...state,
        adjustable_filters: action.payload
    };
    case SET_HIGHLIGHTED_LAYERS_STATE:
      return {
        ...state,
        show_highlighted_layers: action.payload
    };
    case SET_HIGHLIGHTED_FEATURES_MEMORY_STATE:
      return {
        ...state,
        highlighted_features_memory: action.payload
    };
    case SET_MAP_STYLE_LOADING:
      return {
        ...state,
        map_style_loading: action.payload
      }
    default:
      return state
  }
}

export default layers
