export const SET_CURRENT_SELECTED_VALUE = 'SET_CURRENT_SELECTED_VALUE';
export const SET_BIG_QUERY_DRAW_STATE = 'SET_BIG_QUERY_DRAW_STATE';
export const SET_TOOL_MODAL = 'SET_TOOL_MODAL';
export const SET_CURRENT_TOOL = 'SET_CURRENT_TOOL';
export const SET_ADD_PROPERTY_DRAW_MODE_STATE = 'SET_ADD_PROPERTY_DRAW_MODE_STATE';
export const SET_GEOLOCATE_CLICK = 'SET_GEOLOCATE_CLICK';
export const SET_EDIT_PROPERTY_POLY_MODE = 'SET_EDIT_PROPERTY_POLY_MODE';
export const SET_RESET_EDIT_PROPERTY_POLY = 'SET_RESET_EDIT_PROPERTY_POLY';
export const SET_DELETE_EDIT_PROPERTY_POLY = 'SET_DELETE_EDIT_PROPERTY_POLY';
export const SET_NEW_EDIT_PROPERTY_POLY = 'SET_NEW_EDIT_PROPERTY_POLY';

export function setCurrentSelectedValue(string) {
    return {
      type : SET_CURRENT_SELECTED_VALUE,
      payload : string
    }
}

export function setBigQueryDrawState(state) {
  return {
    type : SET_BIG_QUERY_DRAW_STATE,
    payload : state
  }
}

export function setToolModal(modalName) {
  return {
    type : SET_TOOL_MODAL,
    payload : modalName
  }
}

export function setCurrentTool(toolName) {
  return {
    type : SET_CURRENT_TOOL,
    payload : toolName
  }
}

export function setAddPropertyDrawModeState(state) {
  return {
    type : SET_ADD_PROPERTY_DRAW_MODE_STATE,
    payload : state
  }
}

export function setGeolocateClick(state) {
  return {
    type : SET_GEOLOCATE_CLICK,
    payload : state
  }
}

export function setEditPropertyPolyMode(state) {
  return {
    type : SET_EDIT_PROPERTY_POLY_MODE,
    payload : state
  }
}

export function setResetEditPropertyPoly(state) {
  return {
    type : SET_RESET_EDIT_PROPERTY_POLY,
    payload : state
  }
}

export function setDeleteEditPropertyPoly(state) {
  return {
    type : SET_DELETE_EDIT_PROPERTY_POLY,
    payload : state
  }
}


export function setNewEditPropertyPoly(state) {
  return {
    type : SET_NEW_EDIT_PROPERTY_POLY,
    payload : state
  }
}