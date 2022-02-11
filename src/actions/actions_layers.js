export const SET_LAYERS = 'SET_LAYERS';
export const SET_MAP_STYLE = 'SET_MAP_STYLE';
export const SET_FILTER_DATA = 'SET_FILTER_DATA';
export const SET_HIGHLIGHTED_LAYERS_STATE = 'SET_HIGHLIGHTED_LAYERS_STATE';
export const SET_HIGHLIGHTED_FEATURES_MEMORY_STATE = 'SET_HIGHLIGHTED_FEATURES_MEMORY_STATE';
export const SET_MAP_STYLE_LOADING = 'SET_MAP_STYLE_LOADING';

export function setLayers(layers) {
  return {
    type : SET_LAYERS,
    payload : layers
  }
}

export function setMapStyle(style) {
  return {
    type : SET_MAP_STYLE,
    payload : style
  }
}

export function setAdjustableFilters(filterData) {
  return {
    type : SET_FILTER_DATA,
    payload : filterData
  }
}

export function setShowHighlightedLayers(state) {
  return {
    type: SET_HIGHLIGHTED_LAYERS_STATE,
    payload: state
  }
} 


export function setHighlightedFeaturesMemory(memory) {
  return {
    type: SET_HIGHLIGHTED_FEATURES_MEMORY_STATE,
    payload: memory
  }
}

export function setMapStyleLoading(state) {
  return {
    type: SET_MAP_STYLE_LOADING,
    payload: state
  }
} 