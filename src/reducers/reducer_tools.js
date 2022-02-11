import { SET_BIG_QUERY_DRAW_STATE, SET_CURRENT_SELECTED_VALUE, SET_CURRENT_TOOL, SET_TOOL_MODAL, SET_ADD_PROPERTY_DRAW_MODE_STATE, SET_NEW_EDIT_PROPERTY_POLY, SET_GEOLOCATE_CLICK, SET_EDIT_PROPERTY_POLY_MODE, SET_RESET_EDIT_PROPERTY_POLY, SET_DELETE_EDIT_PROPERTY_POLY } from "../actions/actions_tools";

const initialState = {
    current_selected_value: false,
    draw_for_big_query_mode: false,
    draw_add_property_mode: false,
    tool_modal: false,
    current_tool: false,
    click_geolocate: false,
    draw_edit_property_mode: false,
    reset_edit_property_poly: false,
    delete_edit_property_poly: false,
    new_edit_property_poly: false
}
  const tools = (state = initialState, action) => {
    switch (action.type) {
      case SET_CURRENT_SELECTED_VALUE:
      return {
        ...state,
        current_selected_value : action.payload
      };

      case SET_BIG_QUERY_DRAW_STATE: 
      return {
        ...state,
        draw_for_big_query_mode : action.payload
      };
      case SET_TOOL_MODAL:
      return {
        ...state,
        tool_modal : action.payload
      };
      case SET_CURRENT_TOOL:
        return {
          ...state,
          current_tool: action.payload
      }
      case SET_ADD_PROPERTY_DRAW_MODE_STATE: 
      return {
        ...state,
        draw_add_property_mode : action.payload
      };

      case SET_GEOLOCATE_CLICK:
        return {
          ...state,
          click_geolocate: action.payload
        }
      case SET_EDIT_PROPERTY_POLY_MODE:
        return {
          ...state,
          draw_edit_property_mode: action.payload
        }
      case SET_RESET_EDIT_PROPERTY_POLY:
        return {
          ...state,
          reset_edit_property_poly: action.payload
        }
      case SET_DELETE_EDIT_PROPERTY_POLY:
        return {
          ...state,
          delete_edit_property_poly: action.payload
        }
      case SET_NEW_EDIT_PROPERTY_POLY:
        return {
          ...state,
          new_edit_property_poly: action.payload
        }
      default:
        return state
    }
  }
  
  export default tools
  